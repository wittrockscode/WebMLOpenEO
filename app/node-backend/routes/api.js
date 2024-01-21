"use strict"

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const  demodata = require('./../demodata.json');

// OpenAPI is used for Dokumentation and first limited validation
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const openApiSpec = require('./../openapi.json');
const apiSpecPath = path.join(__dirname, './../openapi.json');

// JOI is used for precised validation  ----- findBoundingCoords is a helpfunction for Validation which is also used in this file
const {CLASSIFY_SCHEMA, validate_input, findBoundingCoords, fusionCoords} = require("../validation_schemes/classify_schemas");
const {SENTINEL_SCHEMA} = require("../validation_schemes/sentinel_schemas");

// We use the OpenEO-JS-Client to communicate with the R-Backend
const { OpenEO } = require('@openeo/js-client');
const Connection = require("@openeo/js-client/src/connection");

// Init dictionary to save modelpaths
const uuid = require('uuid');
const fs = require('fs');
let modelFolder = "./models";
let modelPathDict = {};

// ----------------- Middleware --------------------

// Checks if request fits to OpenAPI-specification
ROUTER.use(OpenApiValidator.middleware({ apiSpec: apiSpecPath, validateResponses: true, }));

// API calls generally do not want caching because the returned data may change
ROUTER.use(function(req, res, next)
{
  res.set('Cache-Control', 'no-store');
  next();
});

// ----------------- Endpoints -----------------------

// GET OpenAPI-Documentation about this API 
ROUTER.get('/', function(req, res) 
{
  res.setHeader('Content-Type', 'application/json');
  res.send(openApiSpec);
});

// GET openEOcubes-Documentation
ROUTER.get('/openeocubes', async function(req, res) 
{
  try
  {
    let doku = await fetch (process.env.OPENEOCUBES_URI ?? "http://localhost:8000");
    let dokuJSON = await doku.json();
    res.setHeader('Content-Type', 'application/json');
    res.send(dokuJSON);
  }
  catch (error) 
  {
    console.error('Fehler beim Abrufen der OpenEOcubes-Doku:', error)
    res.status(500).json({ message: 'Interner Serverfehler' })
  }
});

// GET an example Json-Request for classify-Endpoint 
ROUTER.get('/getdemodata', function(req, res) 
{
  res.setHeader('Content-Type', 'application/json');
  res.send(demodata);
});

// Train Model and classify map
ROUTER.post('/classify', async function(req, res) 
{
  try 
  {
    // request mit JOI validieren:
    let validation_result = validate_input(req.body, CLASSIFY_SCHEMA);
    //console.log(typeof validation_result.errorDetails === 'undefined' ? "valid result" : validation_result.errorDetails);

    if (validation_result.hasError)
    {
      res.status(422).json({errors: validation_result.errorDetails});
    }
    else
    {
      // build connection
      let client = new Connection(process.env.OPENEOCUBES_URI ?? "http://localhost:8000");

      // basic login with default params
      await client.authenticateBasic("user", "password");

      let id = await trainModel(client, validation_result.value);

      // TODO: classifyRequest on R-backend with traind model

      // let result = await classifyMap(client, modelPathDict[id]);

      // FOR TESTING:
      let dummyResult = {
        "Model": id,
        "Model-Result": {
          // classes, propabilities, ...
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(dummyResult);
    }
  } 
  catch (error) 
  {
    console.error('Fehler beim Abrufen der Klassifikation:', error)
    res.status(500).json({ message: 'Interner Serverfehler' })
  }
});

ROUTER.get('/getmodel', function(req, res) 
{
  const searchId = req.query.id;
  try
  {
    // Search modelPath in Dictionary
    let modelPath = modelPathDict[searchId];
    const absolutePath = path.resolve(modelPath);

    const fileName = path.basename(modelPath);

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/rds');
    res.sendFile(absolutePath);
  }
  catch (err)
  {
    res.status(404).json({ message: 'Id not found' })
  }
});

ROUTER.post('/getsentinelimg', async function(req, res) 
{
  try 
  {
    // request mit JOI validieren:
    let validation_result = validate_input(req.body, SENTINEL_SCHEMA);
    //console.log(typeof validation_result.errorDetails === 'undefined' ? "valid result" : validation_result.errorDetails);

    if (validation_result.hasError)
    {
      res.status(422).json({errors: validation_result.errorDetails});
    }
    else
    {
      let BoundingCoords = findBoundingCoords(req.body.AOI.geometry.coordinates[0]);
      // build connection
      let client = new Connection(process.env.OPENEOCUBES_URI ?? "http://localhost:8000");

      // basic login with default params
      await client.authenticateBasic("user", "password");

      // build a user-defined process
      let builder = await client.buildProcess();

      // load the initial data collection and limit the amount of data loaded
      const datacubeInit = builder.load_collection(
        'sentinel-s2-l2a-cogs',
        BoundingCoords, 
        32618,
        [req.body.TOI.start_date, req.body.TOI.end_date],
        ["B02","B03","B04"]
      );

      // Save result as GeoTiff
      const result = builder.save_result(datacubeInit, "GTiff");

      // Process and download data synchronously
      const blob_res = await client.computeResult(result);

      res.writeHead(200, {
        'Content-Type': blob_res.type,
      });

      blob_res.data.pipe(res);
    }
  } 
  catch (error) 
  {
    console.error('Fehler beim Abrufen der Sentinel-Bilder:', error)
    res.status(500).json({ message: 'Interner Serverfehler' })
  }
});

// ------------------- help-functions ----------------------------

/**
 * This function builds an OpenEO-Processgraph and executes it. Thereby a ML-model gets trained with Trainingdata and then stored in the node-backend.
 * 
 * @param {*} client - openEO-Client
 * @param {*} request_params - JSON-Object, which contains all needed Information (see Validation)
 * @returns {uuid} - id of trained model
 */
async function trainModel(client, request_params)
{
  // build a user-defined process
  let builder = await client.buildProcess();

  let BoundingCoords;
  if (request_params.Training_Data.hasOwnProperty("bbox")) 
  {
    BoundingCoords = findBoundingCoords(request_params.Training_Data.bbox[0]);
  }
  else
  {
    let training_coords = fusionCoords(request_params.Training_Data);
    BoundingCoords = findBoundingCoords(training_coords);
  }

  // load the initial data collection and limit the amount of data loaded
  const datacubeInit = builder.load_collection(
    'sentinel-s2-l2a-cogs',
    BoundingCoords, 
    3857, 
    [request_params.TOI.start_date, request_params.TOI.end_date],
    ["B02","B03","B04"] // TODO: ANPASSEN
  );

  // TODO: TRAINMODEL

  // Save result as RDS-file
  const result = builder.save_result(datacubeInit, "RDS");

  // Process and download data synchronously
  const startTime = new Date();
  const blob_res = await client.computeResult(result);
  const endTime = new Date();
  const timeTaken = endTime - startTime;
  console.log('Duration of process:', timeTaken);
  let id = await saveModelFile(await blob_res.data);
  return id;
}

async function classifyMap(client, modelpath)
{
  // build a user-defined process
  let builder = await client.buildProcess();

  //TODO: Add process
}

/**
 * Save Modelfile in ModelPath and give it an uuid and name to find it
 * 
 * @param {*} rds_file - model to be saved
 * @returns {int} - uuid of model
 */
async function saveModelFile(rds_file) 
{
  // Give model uuid and name
  let id = uuid.v4();
  let modelName = "model_" + id + ".rds"; 
  const modelPath = path.join(modelFolder, modelName);

  // Save model in modelPath
  const writeStream = fs.createWriteStream(modelPath);
  rds_file.pipe(writeStream);

  // Wait for the writeStream to finish writing the data
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  console.log('Result saved successfully on the server:', modelPath);

  // Save model-uuid and -path in dict
  modelPathDict[id] = modelPath;

  return id;
}

module.exports = ROUTER;

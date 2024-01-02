"use strict"

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const  demodata = require('./../demodata.json');

// OpenAPI is used for Dokumentation and first limited validation
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const openApiSpec = require('./../openapi.json');
const apiSpecPath = path.join(__dirname, './../openapi.json');

// JOI is used for precised validation
const {CLASSIFY_SCHEMA, validate_input} = require("../validation_schemes/classify_schemas");

// We use the OpenEO-JS-Client to communicate with the R-Backend
const { OpenEO } = require('@openeo/js-client');
const Connection = require("@openeo/js-client/src/connection");

// Init dictionary to save modelpaths
const fs = require('fs');
let modelFolder = "./models";
let modelPathDict = {};
let id_count = 0;

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
    console.log("valid result", validation_result.errorDetails);

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

      let id = await trainModel(client, req.body);

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
    res.setHeader('Content-Type', 'application/Rda');
    res.send(modelPath); // TODO: Send data not Path
  }
  catch (err)
  {
    res.status(404).json({ message: 'Id not found' })
  }
});

// ------------------- help-functions ----------------------------

async function trainModel(client, request_params)
{
  // build a user-defined process
  let builder = await client.buildProcess();

  let BoundingCoords = findBoundingCoords(request_params.Training_Data.bbox[0]);

  // load the initial data collection and limit the amount of data loaded
  const datacubeInit = builder.load_collection(
    'sentinel-s2-l2a-cogs',
    BoundingCoords, 
    3857, 
    ['2021-06-01', '2021-06-30'], // TODO: ANPASSEN?
    ["B02","B03","B04"] // TODO: ANPASSEN
  );

  // TODO: TRAINMODEL

  // Save result as RDS-file
  const result = builder.save_result(datacubeInit, "RDS");

  // Process and download data synchronously
  const startTime = new Date();
  const blob_res = await client.computeResult(result);
  console.log (await blob_res.data)
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
 * this function finds Bounding Coordinates for the four directions (west, south, east, north) out of an array of lng,lat coords
 * 
 * @param {*} coordinates - array of lng,lat coordinates
 * @returns {{ west: number, south: number, east: number, north: number }} - Bounding Coords in sequenz: west, south, east, north
 */
function findBoundingCoords(coordinates)
{
  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;
  
  for (const coordinate of coordinates) {
    const [longitude, latitude] = coordinate;
  
    if (longitude < west) {
      west = longitude;
    }
    if (longitude > east) {
      east = longitude;
    }
    if (latitude < south) {
      south = latitude;
    }
    if (latitude > north) {
      north = latitude;
    }
  }
  return { west: west, south: south, east: east, north: north };
}

/**
 * Save Modelfile in ModelPath and give it an id and name to find it
 * 
 * @param {*} rds_file - model to be saved
 * @returns {int} - id of model
 */
async function saveModelFile(rds_file) 
{
  // Give model id and name
  let id = ++id_count;
  let modelName = "model_" + id.toString() + ".rds"; 
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

  // Save model-id and -path in dict
  modelPathDict[id] = modelPath;

  return id;
}

module.exports = ROUTER;

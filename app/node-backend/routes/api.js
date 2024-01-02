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

// Init dictionary to save modelpaths
const fs = require('fs');
let modelFolder = "./models";
let modelPathDict = {};
let id_count = 0;
// FOR TESTING:
let testmodel = './model.rds';

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
ROUTER.post('/classify', function(req, res) 
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
      // request-body an R-backend weiterleiten und ggf. darauf anpassen
      let id = saveModelFile(testmodel);
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

/**
 * Save Modelfile in ModelPath and give it an id and name to find it
 * 
 * @param {*} rds_file - model to be saved
 * @returns {int} - id of model
 */
function saveModelFile(rds_file) 
{
  // Give model id and name
  let id = ++id_count;
  let modelName = "model_" + id.toString() + ".rds"; 
  const modelPath = path.join(modelFolder, modelName);

  // Save model in modelPath
  fs.copyFile(rds_file, modelPath, function (err) 
  {
    if (err) {
      console.error('Error in model save', err);
    } else {
      console.log('Successful model save.');
    }
  });

  // Save model-id and -path in dict
  modelPathDict[id] = modelPath;

  return id;
}

module.exports = ROUTER;

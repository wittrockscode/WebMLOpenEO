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
      //request-body an R-backend weiterleiten und ggf. darauf anpassen
      let dummyResult = {
        "Model": "id",
        "Model-Result": {
          //classes, propabilities, ...
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(dummyResult);
    }
  } 
  catch (error) 
  {
    console.error('Fehler beim Abrufen der Stationen:', error)
    res.status(500).json({ message: 'Interner Serverfehler' })
  }
});

module.exports = ROUTER;

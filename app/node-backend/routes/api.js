"use strict"

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const openApiSpec = require('./../openapi.json');
const apiSpecPath = path.join(__dirname, './../openapi.json');

// Checks if request fits to specification
ROUTER.use(OpenApiValidator.middleware({ apiSpec: apiSpecPath, validateResponses: true, }));

// API calls generally do not want caching because the returned data may change
ROUTER.use(function(req, res, next)
{
  res.set('Cache-Control', 'no-store');
  next();
})

// GET OpenAPI-Documentation about this API 
ROUTER.get('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(openApiSpec);
});

// Train Model and classify map
ROUTER.post('/classify', function(req, res) {
  //request an R-backend weiterleiten und ggf. darauf anpassen
  let dummyResult = {
    "Model": "Modeldata",
    "Model-Result": {
      //classes, propabilities, ...
    }
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(dummyResult);
});

module.exports = ROUTER;

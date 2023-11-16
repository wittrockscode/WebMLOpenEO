"use strict"

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const openApiSpec = require('./../openapi.json');

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

module.exports = ROUTER;

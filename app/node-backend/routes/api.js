"use strict"

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const { Client } = require('@openeo/js-client');

const client = new Client({
    endpoint: 'http://localhost:8000', // so richtig?
    // wenn benötigt, woher die daten?
    auth: {
        username: 'IhrBenutzername',
        password: 'IhrPasswort'
    }
});


// API calls generally do not want caching because the returned data may change
ROUTER.use(function(req, res, next)
{
  res.set('Cache-Control', 'no-store');
  next();
});

// Train Model and classify map
ROUTER.post('/preRelease', function(req, res) 
{
  try 
  {
    //y = Lng, x = Lat
    let yMax,yMin, xMax, xMin;
    for(let i=0;i<req.body.geometry.coordinates[0].length();i++)
    {
      if (req.body.geometry.coordinates[0][i][0] < yMin)
      {
        yMin = req.body.geometry.coordinates[0][i][0];
      }
      if (req.body.geometry.coordinates[0][i][0] > yMax)
      {
        yMax = req.body.geometry.coordinates[0][i][0];
      }
      if (req.body.geometry.coordinates[0][i][1] < xMin)
      {
        xMin = req.body.geometry.coordinates[0][i][1];
      }
      if (req.body.geometry.coordinates[0][i][1] > xMax)
      {
        xMax = req.body.geometry.coordinates[0][i][1];
      }
    }

    
  } 
  catch (error) 
  {
    console.error('Fehler beim Abrufen des Pre-Release-Beispiels:', error)
    res.status(500).json({ message: 'Interner Serverfehler' })
  }
});

module.exports = ROUTER;

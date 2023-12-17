"use strict"

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const fs = require('fs');
const path = require('path');

const { OpenEO } = require('@openeo/js-client');

// API calls generally do not want caching because the returned data may change
ROUTER.use(function(req, res, next)
{
  res.set('Cache-Control', 'no-store');
  next();
});

// Train Model and classify map
ROUTER.post('/preRelease', async function(req, res) 
{
  try 
  {
    let east, west, north, south;
    east = req.body.geometry.coordinates[0][0][0];
    west = east;
    north = req.body.geometry.coordinates[0][0][1];
    south = north;
    for(let i=0;i<req.body.geometry.coordinates[0].length;i++)
    {
      if (req.body.geometry.coordinates[0][i][0] < west)
      {
        west = req.body.geometry.coordinates[0][i][0];
      }
      if (req.body.geometry.coordinates[0][i][0] > east)
      {
        east = req.body.geometry.coordinates[0][i][0];
      }
      if (req.body.geometry.coordinates[0][i][1] < south)
      {
        south = req.body.geometry.coordinates[0][i][1];
      }
      if (req.body.geometry.coordinates[0][i][1] > north)
      {
        north = req.body.geometry.coordinates[0][i][1];
      }
    }

    try 
    {
      // build connection
      let client = await OpenEO.connect("http://localhost:8000");

      // basic login with default params
      await client.authenticateBasic("user", "password");

      // get the collection list
      //const collections = await client.listCollections();
      //console.log('Accesable Collections:', collections);

      // to check description of a collection
      //const collectionDescription = await client.describeCollection('sentinel-s2-l2a-cogs');
      //console.log('Description of Collection:', collectionDescription);

      // get the process collection to use the predefined processes of the back-end
      //const processes = await client.listProcesses();
      //console.log('Verfügbare Prozesse:', processes);

      // describe a single process
      //console.log(await client.describeProcess("load_collection"));

      // build a user-defined process
      let builder = await client.buildProcess();

      // load the initial data collection and limit the amount of data loaded
      const datacubeInit = builder.load_collection(
        'sentinel-s2-l2a-cogs',
        { west: west, south: south, east: east, north: north }, // Bspl: { west: 563080.6, south: 4483092.4, east: 609472, north: 4530135 },
        3857, // Bspl: 32618,
        ['2021-06-01', '2021-06-30'],
        ["B02","B03","B04"]
      );
      //console.log(datacubeInit)

      // filter the data cube for the desired bands
      //const datacubeFiltered = builder.filter_bands(datacubeInit,["B02","B03","B04"]);
      
      //const formats = client.listFileTypes();
      //console.log(formats.data.output.GTIFF);

      // Save result as GeoTiff
      const result = builder.save_result(datacubeInit, "GTiff");
      
      // Process and download data synchronously
      const startTime = new Date();

      await client.downloadResult( result, "./Tiffs/test.tif")

      const endTime = new Date();
      const timeTaken = endTime - startTime;
      console.log('Duration of process:', timeTaken);

      const filePath = path.join(__dirname, "../Tiffs/test.tif");

      const fileStream = fs.createReadStream(filePath);

      res.setHeader('Content-Type', 'image/tiff');
      res.setHeader('Content-Disposition', 'inline; filename=file.tif');
      res.setHeader('Content-Length', fs.statSync(filePath).size);

      fileStream.pipe(res);

    } catch (error) {
        //console.error('Error:', error);
    }

  } 
  catch (error) 
  {
    console.error('Fehler beim Abrufen des Pre-Release-Beispiels:', error)
    res.status(500).json({ message: 'Interner Serverfehler' })
  }
});

module.exports = ROUTER;

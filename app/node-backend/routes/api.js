"use strict"

const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const mkdirp = require("mkdirp");

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
    res.status(500).json({ message:  error.message })
  }
});

// GET an example Json-Request for classify-Endpoint 
ROUTER.get('/getDemodata', function(req, res) 
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
      // change class-names to numbers for easier legend of classification
      let {class_map, processed_geojson} = mapClasses(validation_result.value);
      //console.log(processed_geojson.Training_Data.features)  
      // build connection
      let client = new Connection(process.env.OPENEOCUBES_URI ?? "http://localhost:8000");

      // basic login with default params
      await client.authenticateBasic("user", "password");

      let id = await trainModel(client, processed_geojson, false);

      let result = await classifyMap(client, processed_geojson, false);

      const buffer = await streamToBuffer(result);
      let response = {
        "model_id": id,
        "classification": await buffer.toString('base64'),
        "class_map": class_map,
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(response);
    }
  } 
  catch (error) 
  {
    console.error('Fehler beim Abrufen der Klassifikation:', error)
    res.status(500).json({ message:  error.message })
  }
});

ROUTER.post('/demoClassify', async function(req, res) 
{
  try 
  {
    if (!areObjectsEqual(req.body, demodata))
    {
      res.status(422).json({errors: "This demo-Endpoint only allows the demodata (see also /getDemodata) as request-body."});
    }
    else
    {
      // change class-names to numbers for easier legend of classification
      let {class_map, processed_geojson} = mapClasses(req.body);
          
      // build connection
      let client = new Connection(process.env.OPENEOCUBES_URI ?? "http://localhost:8000");

      // basic login with default params
      await client.authenticateBasic("user", "password");

      let id = await trainModel(client, processed_geojson, true);

      let result = await classifyMap(client, processed_geojson, true);

      const buffer = await streamToBuffer(result);
      let response = {
        "model_id": id,
        "classification": buffer.toString('base64'),
        "class_map": class_map
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(response);
    }
  } 
  catch (error) 
  {
    console.error('Fehler beim Abrufen der Klassifikation:', error)
    res.status(500).json({ message:  error.message })
  }
});

ROUTER.get('/getModel', function(req, res) 
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

ROUTER.post('/getSentinelImg', async function(req, res) 
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
        3857,
        [req.body.TOI.start_date, req.body.TOI.end_date],
        ["B02","B03","B04"],
        10
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
    res.status(500).json({ message:  error.message })
  }
});

// ------------------- help-functions ----------------------------

/**
 * This function builds an OpenEO-Processgraph and executes it. Thereby a ML-model gets trained with Trainingdata and then stored in the node-backend.
 * 
 * @param {*} client - openEO-Client
 * @param {*} request_params - JSON-Object, which contains all needed Information (see Validation)
 * @param {boolean} isDemo - Truth-value if its the demo-process
 * @returns {uuid} - id of trained model
 */
async function trainModel(client, request_params, isDemo)
{
  // build a user-defined process
  let builder = await client.buildProcess();

  // spatial extend of training data
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

  // we define these bands as the only relevant bands for model training
  let bands = ["B02", "B03", "B04", "B05", "B06","B07", "B08", "B8A", "B11", "B12"];

  // load the initial data collection and limit the amount of data loaded
  let datacube_init;
  if (isDemo)
  {
    datacube_init = builder.load_netCDF_cube("Training_Testcube")
  }
  else
  {
    datacube_init = builder.load_collection(
      'sentinel-s2-l2a-cogs',
      BoundingCoords, 
      3857, 
      [request_params.tot.start_date, request_params.tot.end_date],
      bands,
      request_params.Resolution 
    );
  }
  // fill NAs in Datacube
  const datacube_NA_filled = builder.fill_missing_values(datacube_init, "near");

  // calculate ndvi as additional input for ML-algorithm
  const datacube_ndvi = builder.ndvi(datacube_NA_filled, "B08", "B04", true);

  // reduces temporal period of the cube to one day
  // custom reducer function is used to be able to convert band names, as "gdalcubes" currently doesn't support renaming with pre-defined reducers
  const datacube_reduced = builder.reduce_dimension(
    datacube_ndvi,
    undefined,
    "time",
    // this function creates 11 new bands. Each band value is the mean of the old band values over all temporal dimensions inside the given cube 
    "function(x){return(c(mean(x['B02',], na.rm = TRUE),mean(x['B03',], na.rm = TRUE),mean(x['B04',], na.rm = TRUE),mean(x['B05',], na.rm = TRUE),mean(x['B06',], na.rm = TRUE),mean(x['B07',], na.rm = TRUE),mean(x['B08',], na.rm = TRUE),mean(x['B8A',], na.rm = TRUE),mean(x['B11',], na.rm = TRUE),mean(x['B12',], na.rm = TRUE),mean(x['NDVI',], na.rm = TRUE)))}",
    [...bands, "NDVI"]
  );

  // trains model and initialize hyperparameter if requested
  let datacube_model;
  if (request_params.hasOwnProperty("Hyperparameter") && request_params.Hyperparameter.length > 1 && request_params.model == "RandomForest")
  {
    let hyperparams = transformHyperparameterRF(request_params.Hyperparameter);
    datacube_model = builder.train_model(
      datacube_reduced,
      "RF",
      JSON.stringify(request_params.Training_Data), // String containing the JSON data
      hyperparams, // hyperparameters depending on the choosen model_type
      true,
      "myModel" // R-Backend-intern id for the trained model
    );
  }
  else
  {
    datacube_model = builder.train_model(
      datacube_reduced,
      "RF",
      JSON.stringify(request_params.Training_Data), // String containing the JSON data
      undefined, // hyperparameters depending on the choosen model_type
      true,
      "myModel" // R-Backend-intern id for the trained model
    );
  }
  // Save result as RDS-file
  const result = builder.save_result(datacube_model, "RDS");

  // Process and download data synchronously
  const startTime = new Date();
  const blob_res = await client.computeResult(result);
  const endTime = new Date();
  const timeTaken = endTime - startTime;
  console.log('Duration of training-process:', timeTaken);
  let id = await saveModelFile(await blob_res.data);
  return id;
}

/**
 * This function builds an OpenEO-Processgraph and executes it. Thereby a present ML-model gets applied on an AOI and TOI to get a classified map
 * 
 * @param {*} client - openEO-Client
 * @param {*} request_params - JSON-Object, which contains all needed Information (see Validation)
 * @param {boolean} isDemo - Truth-value if its the demo-process
 * @returns {*} - classified map with class_props as GTiff
 */
async function classifyMap(client, request_params, isDemo)
{
  // build a user-defined process
  let builder = await client.buildProcess();

  // define Bounding of AOI
  let BoundingCoords = findBoundingCoords(request_params.AOI.geometry.coordinates[0]);
  
  // we define these bands as the only relevant bands for classification
  let bands = ["B02", "B03", "B04", "B05", "B06","B07", "B08", "B8A", "B11", "B12"];

  // load the initial data collection and limit the amount of data loaded
  let datacube_init;
  if (isDemo)
  {
    datacube_init = builder.load_netCDF_cube("AOI_Testcube")
  }
  else
  {
    datacube_init = builder.load_collection(
      'sentinel-s2-l2a-cogs',
      BoundingCoords, 
      3857, 
      [request_params.TOI.start_date, request_params.TOI.end_date],
      bands,
      request_params.Resolution 
    );
  }

  // fill NAs in Datacube
  const datacube_NA_filled = builder.fill_missing_values(datacube_init, "near");

  // calculate ndvi as additional input for ML-algorithm
  const datacube_ndvi = builder.ndvi(datacube_NA_filled, "B08", "B04", true);

  // reduces temporal period of the cube to one day
  // custom reducer function is used to be able to convert band names, as "gdalcubes" currently doesn't support renaming with pre-defined reducers
  const datacube_reduced = builder.reduce_dimension(
    datacube_ndvi,
    undefined,
    "time",
    // this function creates 11 new bands. Each band value is the mean of the old band values over all temporal dimensions inside the given cube 
    "function(x){return(c(mean(x['B02',], na.rm = TRUE),mean(x['B03',], na.rm = TRUE),mean(x['B04',], na.rm = TRUE),mean(x['B05',], na.rm = TRUE),mean(x['B06',], na.rm = TRUE),mean(x['B07',], na.rm = TRUE),mean(x['B08',], na.rm = TRUE),mean(x['B8A',], na.rm = TRUE),mean(x['B11',], na.rm = TRUE),mean(x['B12',], na.rm = TRUE),mean(x['NDVI',], na.rm = TRUE)))}",
    [...bands, "NDVI"]
  );

  // the model stated in R-Backend-intern "model_id" has to be created with the "openeocubes" process "train_model"
  const datacube_predict = builder.apply_prediction(
    datacube_reduced,
    "myModel",
  );

  // Save result as GTiff
  const result = builder.save_result(datacube_predict, "GTiff");

  // Process and download data synchronously
  const startTime = new Date();
  const blob_res = await client.computeResult(result);
  const endTime = new Date();
  const timeTaken = endTime - startTime;
  console.log('Duration of classify-process:', timeTaken);

  return await blob_res.data;
}

/**
 * This function converts a stream to a buffer
 * 
 * @param {*} stream - stream that should be converted
 * @returns {*} - buffer which is created from stream
 */
async function streamToBuffer(stream) 
{
  // Return a promise to handle asynchronous operations
  return new Promise(function(resolve, reject) 
  {
    // Initialize an array to store stream chunks
    const chunks = [];

    // Listen for 'data' events to accumulate chunks
    stream.on('data', function(chunk)
    {
      chunks.push(chunk);
    });

    // Listen for the 'end' event to signify the end of the stream
    stream.on('end', function() 
    {
      // Concatenate all chunks into a single buffer
      resolve(Buffer.concat(chunks));
    });

    // Listen for 'error' events in case of any errors during the stream
    stream.on('error', function(error) 
    {
      reject(error);
    });
  });
}

/**
 * This function transforms the Hyperparameter-object in classify-request to Hyperparameter-object needed in R-Backend
 * 
 * @param {*} hyper_request - Hyperparameter-object from request_body
 * @returns {*} - Hyperparameter-object for R-Backend
 */
function transformHyperparameterRF(hyper_request)
{
  let transformed_Hyperparams = {};

  hyper_request.forEach(function (param)
  {
    transformed_Hyperparams[param.name] = parseInt(param.value, 10);
  });
  
  return transformed_Hyperparams;
}

/**
 * This function assigns a number to each class in a Feature Collection and creates a dictionary that contains the mapping of classes to numbers.
 * 
 * @param {*} request_params - request_params with class property within Training_Data
 * @returns {*} - object with the updated features and the class dictionary.
 */
function mapClasses(request_params) 
{
  let classDictionary = {};
  let classCounter = 0;

  // Iterate through each feature in the Feature Collection
  const updatedFeatures = request_params.Training_Data.features.map(function (feature) 
  {
    if (feature.properties.class in classDictionary) 
    {
      // Assign same number to same classes
      feature.properties.class = classDictionary[feature.properties.class];
    }
    else
    {
      // Assign a new number to the class if not already assigned
      classDictionary[feature.properties.class] = classCounter;
      feature.properties.class = classCounter;
      classCounter++;
    }
    return feature;
  });

  request_params.Training_Data.features = updatedFeatures;

  // Return an object with the updated features and the class dictionary
  return {processed_geojson: request_params, class_map: swapKeysValues(classDictionary)};
}

/**
 * This function takes a dictionary and create a new one with swapped keys and values
 * 
 * @param {*} inputDict - Dict with key-value-pairs to be swapped
 * @returns {*} - Dict with swapped key-value-pairs
 */
function swapKeysValues(inputDict) 
{
  const swappedDict = {};

  for (const key in inputDict) 
  {
    swappedDict[inputDict[key]] = key;
  }

  return swappedDict;
}

/**
 * Checks recursive if two objects are equal
 * 
 * @param {*} obj1 
 * @param {*} obj2 
 * @returns {boolean} - if they are equal
 */
function areObjectsEqual(obj1, obj2) {
  // Check if both arguments are objects
  if (typeof obj1 !== typeof obj2 ) 
  {
      return false;
  }
  else if (typeof obj1 !== 'object' || typeof obj2 !== 'object') 
  {
    return obj1 == obj2;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) 
  {
      return false;
  }

  // Check values for each key
  for (const key of keys1) 
  {
      // If the key doesn't exist in the second object or the values are not equal, return false
      if (!obj2[key] || !areObjectsEqual(obj1[key], obj2[key])) {
          return false;
      }
  }

  // If all checks pass, the objects are equal
  return true;
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
  const modelPath = path.join(__dirname, modelFolder);
  console.log(__dirname)
  console.log('Saving result to:', modelPath);
  await mkdirp(modelPath);
  const modelPathWithName = path.join(modelPath, modelName);
  // Save model in modelPath
  const writeStream = fs.createWriteStream(modelPathWithName);
  rds_file.pipe(writeStream);

  // Wait for the writeStream to finish writing the data
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  console.log('Result saved successfully on the server:', modelPathWithName);

  // Save model-uuid and -path in dict
  modelPathDict[id] = modelPathWithName;

  return id;
}

module.exports = ROUTER;

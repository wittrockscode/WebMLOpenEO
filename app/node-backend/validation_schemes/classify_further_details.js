"use strict"

const proj4 = require('proj4');
const reproject = require('reproject');

/**
 * This function validates complicate constraints to the Classify-Request-Body
 * 
 * @param {*} input - Classify-Request-Body OR Sentinel-Request-Body
 * @returns {hasFurtherError, errorMessage, transformed} - Boolean if theres an error, if so also a message with Errordetails and the input maybe with transformed CRS
 */
function validate_further(input)
{
    let hasFurtherError = false;
    let errorMessage;

    // if input is Classify-Request the bbox and the CRS of training_Data has to be checked
    if (input.hasOwnProperty("Training_Data"))
    {
       let {hfe, i} = validate_CRS(input.Training_Data);
       hasFurtherError = hfe;
       input.Training_Data = i;
      if (hasFurtherError)
      {
          errorMessage = "The given CRS is not found or could not be transformed to 3857"
          return {hasFurtherError, errorMessage, transformed: input};
      }
      // Bbox is an optional attribut, so if its given it gets validated
      if (input.Training_Data.hasOwnProperty("bbox")) 
      {
        hasFurtherError = validate_trainingBBox(input.Training_Data);
        if (hasFurtherError)
        {
            errorMessage = "The BBox of Training_Data does not contain all Training_Features"
            return {hasFurtherError, errorMessage, transformed: input};
        }

        hasFurtherError = validate_area(input.Training_Data.bbox[0]);
      }
      // else its get calculated and then checked
      else
      {
        let training_coords = fusionCoords(input.Training_Data);
        hasFurtherError = validate_area(training_coords);
      }
      if (hasFurtherError)
      {
          errorMessage = "The BBox of Training_Data is too large or has an invalid aspect ratio"
          return {hasFurtherError, errorMessage, transformed: input};
      }
    }

    // The AOI has to be checked in every Request-Body
    hasFurtherError = validate_area(input.AOI.geometry.coordinates[0]);
    if (hasFurtherError)
    {
        errorMessage = "The BBox of AOI is too large or has an invalid aspect ratio"
        return {hasFurtherError, errorMessage, transformed: input};
    }

    return {hasFurtherError, errorMessage, transformed: input};
}

/**
 * This function tests if the BoundingBox of the Training_Data really contains all features
 * 
 * @param {*} Training_Data - Training_Data that should be validated
 * @returns {boolean} - true if the BBox is too small for its features
 */
function validate_trainingBBox(Training_Data)
{
    let BBox_bounding = findBoundingCoords(Training_Data.bbox[0])
    for (const feature of Training_Data.features)
    {
        let bounding = findBoundingCoords(feature.geometry.coordinates[0]);
        if(bounding.west < BBox_bounding.west || bounding.south < BBox_bounding.south || bounding.east > BBox_bounding.east || bounding.north > BBox_bounding.north)
        {
            return true;
        }

    }
    return false;
}

/**
 * This function checks if a Polygon has a BBox which is too big or has a unfavourable aspect ratio, so that the sentinel-data cant be loaded well.
 * 
 * @param {*} polygon - polygon that should be validated
 * @returns {boolean} - true if the BBox is too big or has an invalid aspect ratio
 */
function validate_area(polygon)
{
    // check area
    let bounding = findBoundingCoords(polygon);
    const width = Math.abs(bounding.east - bounding.west);
    const height = Math.abs(bounding.north - bounding.south);
    const area = width * height;

    // check aspect ratio
    const aspectRatio = width / height;

    return (area > 1000000000 || aspectRatio < 0.05 || aspectRatio > 20); // TODO: werte anpassen!
}

function validate_CRS(feature_collection)
{
  try
  {
    // Proj4-Definition for Web Mercator (EPSG:3857)
    const webMercatorDef = proj4.defs('EPSG:3857');
    
    const sourceCRS = proj4.defs(feature_collection.crs.properties.name);
    // transform coordinates in Webmercator if its not already in this crs
    if (webMercatorDef != sourceCRS)
    {
      // coordinates of features
      feature_collection.features.forEach( function (feature) 
      {
        const coordinates = feature.geometry.coordinates;
        const transformedCoordinates = coordinates.map(ring => ring.map(coord => proj4(sourceCRS, webMercatorDef, coord)));
        feature.geometry.coordinates = transformedCoordinates;
      });
      // bbox
      if (feature_collection.hasOwnProperty("bbox")) 
      {
        const coordinates = feature_collection.bbox;
        const transformedCoordinates = coordinates.map(ring => ring.map(coord => proj4(sourceCRS, webMercatorDef, coord)));
        feature_collection.bbox = transformedCoordinates;
      }
      // CRS
      feature_collection.crs.properties.name = 'EPSG:3857';
    }
    console.log(feature_collection.bbox)
    return {hfe: false, i: feature_collection};
  }
  catch (error)
  {
    console.log(error);
    return {hfe: true, i: feature_collection};
  }
}

/**
 * This function fusions all coordinates of all features of a featureCollection (only containing Polygons!) in one array
 * 
 * @param {*} featureCollection - featureCollection (only containing Polygons!) - which feature-coords should be fusiond
 * @returns {*} - array of all coords
 */
function fusionCoords(featureCollection)
{
  let training_coords = [];
  featureCollection.features.forEach(function(feature) 
  {
    feature.geometry.coordinates[0].forEach(function(coord)
    {
      training_coords.push(coord);
    });
  });
  return training_coords;
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

module.exports = {validate_further, findBoundingCoords, fusionCoords};
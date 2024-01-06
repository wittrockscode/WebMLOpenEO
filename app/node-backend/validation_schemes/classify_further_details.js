"use strict"

/**
 * This function validates complicate constraints to the Classify-Request-Body
 * 
 * @param {*} input - Classify-Request-Body
 * @returns {hasFurtherError, errorMessage} - Boolean if theres an error, if so also a message with Errordetails
 */
function validate_further(input)
{
    let hasFurtherError = false;
    let errorMessage;

    hasFurtherError = validate_trainingBBox(input.Training_Data);
    if (hasFurtherError)
    {
        errorMessage = "The BBox of Training_Data does not contain all Training_Features"
        return {hasFurtherError, errorMessage};
    }

    return {hasFurtherError, errorMessage};
}

/**
 * This function tests if the BoundingBox of the Training_Data really contains all features
 * 
 * @param {*} Training_Data - Training_Data that should be validated
 * @returns {boolean} - true if the BBox is too small
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

module.exports = {validate_further, findBoundingCoords};
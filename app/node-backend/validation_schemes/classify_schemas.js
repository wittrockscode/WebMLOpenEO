"use strict"

const JOI = require("joi");

const {validate_further, findBoundingCoords, fusionCoords} = require("./classify_further_details");

const MODEL_SCHEMA = JOI.string().custom(function(value)
  {
    if (value !== "RandomForest")
    {
      throw new Error("'model' must be 'RandomForest'");
    }
  }
).required();

const TOI_SCHEMA = JOI.object(
  {
    start_date: JOI.date().iso().min('2015-06-23').required(),
    // start_date shouldnt be before sentinel 2 was launched
    end_date: JOI.date().iso().max('now').min(JOI.ref('start_date')).required()
    // end_date shouldnt be before start_date or in future
  }
).required();

const POINT_SCHEMA = JOI.array().items(
  JOI.number().min(-20048966.1).max(20048966.1).required(),
  JOI.number().min(-20037508.34).max(20037508.34).required()
).length(2).required();

const POLYGON_SCHEMA = JOI.array().max(1).items(
  JOI.array().min(3).items(POINT_SCHEMA).required()
).required();

const GEOMETRY_SCHEMA = JOI.object(
  {
    coordinates: POLYGON_SCHEMA.required(),
    type: JOI.string().custom(function(value)
      {
          if (value !== 'Polygon')
          {
              throw new Error("'type' must be 'Polygon'")
          }
      }
    ).required(),
  }
).required();

const AOI_SCHEMA = JOI.object(
  {
    geometry: GEOMETRY_SCHEMA.required()
  }
).required();

const BBOX_SCHEMA = JOI.array().max(1).items(
  JOI.array().items(POINT_SCHEMA).min(4).max(5).custom(function(value)
  {
    if (value.length === 5 && !(value[0].every((num, index) => num === value[4][index]))) 
    {
      throw new Error("if bbox contains 5 items the first must be equal to the last")
    }
    else
    {
      return value;
    }
  }).required()
);

const FEATURES_SCHEMA = JOI.array().min(2).items(
  JOI.object(
    {
      type: JOI.string().custom(function(value)
        {
          if (value !== 'Feature')
          {
            throw new Error("'type' must be 'Feature'")
          }
        }
      ).required(),
      properties: JOI.object(
        {
          class: JOI.string().required()
        }
      ).required(),
      geometry: GEOMETRY_SCHEMA.required()
    }
  ).required()
).required();

const CRS_SCHEMA = JOI.object(
  {
    type: JOI.string().custom(function(value)
    {
      if (value !== 'name')
      {
          throw new Error("'type' must be 'name'")
      }
    }
  ).required(),
    properties: JOI.object(
      {
        name: JOI.string().required()
      }
    ).required()
  }
);

const TRAINING_DATA_SCHEMA = JOI.object(
  {
    type: JOI.string().custom(function(value)
      {
        if (value !== 'FeatureCollection')
        {
            throw new Error("'type' must be 'FeatureCollection'")
        }
      }
    ).required(),
    bbox: BBOX_SCHEMA,
    features: FEATURES_SCHEMA.required(),
    crs: CRS_SCHEMA
  }
).required();

const HYPERPARAMETER_SCHEMA = JOI.array().items(
  JOI.object(
    {
      name: JOI.string().required(),
      value: JOI.string().required(),
    }
  )
);

const RESOLUTION_SCHEMA = JOI.number().valid(10, 30, 60).required();

const CLASSIFY_SCHEMA = JOI.object(
  {
    model: MODEL_SCHEMA.required(),
    TOI: TOI_SCHEMA.required(),
    AOI: AOI_SCHEMA.required(),
    Training_Data: TRAINING_DATA_SCHEMA.required(),
    Hyperparameter: HYPERPARAMETER_SCHEMA,
    Resolution: RESOLUTION_SCHEMA.required()
  }
).required().options({abortEarly: false}); // makes sure, each error is returned

/**
 * Validates the input using "joi"s ".validate()"-method and provides custom return values for server side responses
 * @param {any} input - any input that should be validated.
 * @param {} schema - JOI-Schema to validate input against.
 * @returns The validated value. Else it returns an array of all errors
 */
function validate_input(input, schema)
{
  const {value, error} = schema.validate(input);

  if (error) 
  {
    let errorDetails = error.details;
    let hasError = true;
    console.log(errorDetails);
    return {hasError, errorDetails};
  }
  else 
  {
    let {hasFurtherError, errorMessage} = validate_further(input);
    if (hasFurtherError)
    {
      let errorDetails = errorMessage;
      let hasError = true;
      console.log(errorDetails);
      return {hasError, errorDetails};
    }
    else
    {
      let hasError = false;
      return {hasError, value};
    }
  }
}

module.exports = {CLASSIFY_SCHEMA, validate_input, findBoundingCoords, fusionCoords};
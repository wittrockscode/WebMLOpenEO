"use strict"

const JOI = require("joi");

const MODEL_SCHEMA = JOI.string().custom(function(value)
  {
    if (value !== "RandomForest")
    {
      throw new Error("'model' must be 'RandomForest'");
    }
  }).required();

const TOI_SCHEMA = JOI.object(
  {
    start_date: JOI.date().iso().min('2015-06-23').required(),
    // start_date shouldnt be before sentinel 2 was launched
    end_date: JOI.date().iso().max('now').min(JOI.ref('start_date')).required()
    // end_date shouldnt be before start_date or in future
  }
).required();

const AOI_SCHEMA = JOI.object().required();

const TRAINING_DATA_SCHEMA = JOI.object().required();

const HYPERPARAMETER_SCHEMA = JOI.object().required();

const RESOLUTION_SCHEMA = JOI.object().required();

const CLASSIFY_SCHEMA = JOI.object(
  {
    model: MODEL_SCHEMA.required(),
    TOI: TOI_SCHEMA.required(),
    AOI: AOI_SCHEMA.required(),
    Training_Data: TRAINING_DATA_SCHEMA.required(),
    Hyperparameter: HYPERPARAMETER_SCHEMA.required(),
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
    let hasError = false;
    return {hasError, value};
  }
}

module.exports = {CLASSIFY_SCHEMA, validate_input};
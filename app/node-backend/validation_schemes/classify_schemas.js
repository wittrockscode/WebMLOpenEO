"use strict"

const JOI = require("joi");

const CLASSIFY_SCHEMA = JOI.object();

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
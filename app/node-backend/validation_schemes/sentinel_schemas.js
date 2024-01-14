"use strict"

const JOI = require("joi");

const {TOI_SCHEMA, AOI_SCHEMA} = require("./classify_schemas");

const SENTINEL_SCHEMA = JOI.object(
    {
      TOI: TOI_SCHEMA.required(),
      AOI: AOI_SCHEMA.required(),
    }
).required().options({abortEarly: false}); // makes sure, each error is returned

module.exports = {SENTINEL_SCHEMA};
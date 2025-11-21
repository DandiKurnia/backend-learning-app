const Joi = require('joi');

const createJourneySchema = Joi.object({
  name: Joi.string().required(),
  summary: Joi.string().required(),
  point: Joi.number().default(0),
  required_point: Joi.number().default(0),
  xp: Joi.number().default(0),
  required_xp: Joi.number().default(0),
  status: Joi.number().default(0),
  listed: Joi.number().default(0),
  dead_line: Joi.date().required(),
});

const updateJourneySchema = Joi.object({
  name: Joi.string(),
  summary: Joi.string(),
  point: Joi.number(),
  required_point: Joi.number(),
  xp: Joi.number(),
  required_xp: Joi.number(),
  status: Joi.number(),
  listed: Joi.number(),
  dead_line: Joi.date(),
}).min(1);

module.exports = { createJourneySchema, updateJourneySchema };

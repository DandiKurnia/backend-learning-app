const Joi = require('joi');

const createTutorialSchema = Joi.object({
  title: Joi.string().required(),
  position: Joi.number().integer().required(),
  status: Joi.string().required(),
});

const updateTutorialSchema = Joi.object({
  title: Joi.string(),
  position: Joi.number().integer(),
  status: Joi.string(),
});

module.exports = { createTutorialSchema, updateTutorialSchema };

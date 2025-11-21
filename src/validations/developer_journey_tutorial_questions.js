const Joi = require('joi');

const createTutorialQuestionSchema = Joi.object({
  question_text: Joi.string().required(),
  position: Joi.number().integer().required(),
});

const updateTutorialQuestionSchema = Joi.object({
  question_text: Joi.string().required(),
  position: Joi.number().integer().required(),
});
module.exports = { createTutorialQuestionSchema, updateTutorialQuestionSchema };

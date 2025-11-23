const Joi = require('joi');


const createTutorialQuestionsOptionsSchema = Joi.object({
    option_label: Joi.string().required(),
    option_text: Joi.string().required(),
});

const updateTutorialQuestionsOptionsSchema = Joi.object({
    option_text: Joi.string(),
});

module.exports = { createTutorialQuestionsOptionsSchema, updateTutorialQuestionsOptionsSchema };

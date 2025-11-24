const Joi = require('joi');


const createTutorialQuestionsOptionsSchema = Joi.object({
    option_label: Joi.string().required(),
    option_text: Joi.string().required(),
    is_correct: Joi.boolean().required(),
    
});

const updateTutorialQuestionsOptionsSchema = Joi.object({
    option_text: Joi.string(),
    is_correct: Joi.boolean(),
});

module.exports = { createTutorialQuestionsOptionsSchema, updateTutorialQuestionsOptionsSchema };

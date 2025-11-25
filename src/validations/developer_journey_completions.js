const Joi = require('joi');

const developerJourneyCompletionsSchema = Joi.object({

  duration: Joi.number().required()
});

module.exports = { developerJourneyCompletionsSchema };

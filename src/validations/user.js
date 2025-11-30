const Joi = require('joi');

const registerUserSchema = Joi.object({
  display_name: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must have at least 6 characters',
  }),
  phone: Joi.string().required(),
  user_role: Joi.number().required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must have at least 6 characters',
  }),
});

module.exports = { registerUserSchema, loginUserSchema };
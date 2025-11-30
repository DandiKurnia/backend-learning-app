const BadRequestError = require('../errors/bad-request');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    throw new BadRequestError(errorMessage);
  }

  next();
};

module.exports = validate;
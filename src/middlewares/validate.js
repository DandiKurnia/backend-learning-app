const BadRequestError = require('../errors/bad-request');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    throw new BadRequestError("Invalid request payload");
  }

  next();
};

module.exports = validate;
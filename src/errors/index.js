const CustomeAPIError = require('./custome-api-error');
const BadRequestError = require('./bad-request');
const NotFoundError = require('./not-found');
const UnauthenticatedError = require('./unauthenticated');
const UnauthorizedError = require('./unauthorized');

module.exports = {
  CustomeAPIError,
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
};

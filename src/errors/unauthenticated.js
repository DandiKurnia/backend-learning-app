const { StatusCodes } = require('http-status-codes');
const CustomeAPIError = require('./custome-api-error');

class UnauthenticatedError extends CustomeAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
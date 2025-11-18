const { StatusCodes } = require('http-status-codes');
const CustomeAPIError = require('./custome-api-error');

class UnauthorizedError extends CustomeAPIError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;

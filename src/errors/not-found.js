const { StatusCodes } = require('http-status-codes');

const CustomeAPIError = require('./custome-api-error');

class NotFound extends CustomeAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFound;

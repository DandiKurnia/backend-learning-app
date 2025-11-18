const { StatusCodes } = require('http-status-codes');

const CustomeAPIError = require('./custome-api-error');

class BadRequest extends CustomeAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;

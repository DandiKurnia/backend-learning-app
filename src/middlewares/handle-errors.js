const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong';

  // Prisma Client Validation Error
  if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid request payload. Please check your input.';
  }

  // Prisma Client Known Error
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Invalid request.';
  }

  return res.status(statusCode).json({

    error: {
      code: statusCode,
      message,
    },
  });
};

module.exports = errorHandlerMiddleware;

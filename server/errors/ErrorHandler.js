const ForbiddenError = require('./ForbiddenError');
const ModelNotFoundError = require('./ModelNotFoundError');
const UnauthorizedError = require('./UnauthorizedError');
const ValidationError = require('./ValidationError');
const IoC = require('AppIoC');

class ErrorHandler {
  format(error) {
    if(error && error.toObject) {
      return error.toObject();
    }
    return error;
  }

  getStatusCode(error) {
    if(error instanceof ForbiddenError) {
      return 401;
    }
    if(error instanceof ModelNotFoundError) {
      return 404;
    }
    if(error instanceof UnauthorizedError) {
      return 401;
    }
    if(error instanceof ValidationError) {
      return 400;
    }
    return 500;
  }
}

IoC.singleton('app.errorHandler', [], ErrorHandler);

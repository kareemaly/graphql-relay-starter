const IoC = require('AppIoC');
const PrettyError = require('pretty-error');

class ErrorMiddleware {
  constructor(errorHandler) {
    this.errorHandler = errorHandler;
  }

  log(err, req, res, next) {
    let pe = new PrettyError();
    console.log(req.originalUrl);
    console.log(pe.render(err));
    next(err);
  }

  response(err, req, res, next) {
    res.status(this.errorHandler.getStatusCode(err)).send(this.errorHandler.format(err));
  }
}

IoC.singleton('app.errorMiddleware', [
  'app.errorHandler'
], ErrorMiddleware);

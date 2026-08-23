import pinoHttp from 'pino-http';
import logger from '../logger/logger.js';

const loggerMiddleware = pinoHttp({
  logger,

  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) {
      return 'error';
    }

    if (res.statusCode >= 400) {
      return 'warn';
    }

    return 'info';
  },

  customSuccessMessage: (req) => {
    return `${req.method} ${req.originalUrl} completed`;
  },

  customErrorMessage: (req) => {
    return `${req.method} ${req.originalUrl} failed`;
  },
});

export default loggerMiddleware;

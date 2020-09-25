const errorHandler = require('./error-handler');

const errorWrapper = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (e) {
    errorHandler(req, res, e);
  }
};

module.exports = errorWrapper;

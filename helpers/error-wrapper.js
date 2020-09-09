const responseNormalizer = require('../normalizers/response-normalizer');

const errorWrapper = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (e) {
    res.status(500).send(responseNormalizer(e));
  }
};

module.exports = errorWrapper;

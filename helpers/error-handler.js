const responseNormalizer = require('../normalizers/response-normalizer');
const ApiError = require('./ApiError');
const getLogger = require('./get-logger');

const logger = getLogger('ErrorHandler');

module.exports = (req, res, error) => {
  // logger.error('------------------------');
  // logger.error(error);
  // logger.error('------------------------');
  // logger.error(req.params, req.query, req.body);
  // logger.error('=========================');

  if (error instanceof ApiError) {
    return res.status(error.status).send(
      responseNormalizer({
        message: error.message,
        data: error.data,
      }),
    );
  }

  res
    .status(500)
    .send(responseNormalizer({ message: 'Internal server error' }));
};

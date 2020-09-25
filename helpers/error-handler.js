const responseNormalizer = require('../normalizers/response-normalizer');
const ApiError = require('./ApiError');

module.exports = (req, res, error) => {
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

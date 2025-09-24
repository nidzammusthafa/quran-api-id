const httpStatus = require('http-status');
const { quranService } = require('../services');
const ApiError = require('../utils/ApiError');

const getPage = (req, res) => {
  const { pageNumber } = req.params;
  if (pageNumber < 1 || pageNumber > 604) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Page number must be between 1 and 604');
  }
  const page = quranService.getPage(pageNumber);
  res.send(page);
};

module.exports = { getPage };

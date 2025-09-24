const httpStatus = require('http-status');
const { quranService } = require('../services');
const ApiError = require('../utils/ApiError');

const getJuz = (req, res) => {
  const { juzNumber } = req.params;
  if (juzNumber < 1 || juzNumber > 30) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Juz number must be between 1 and 30');
  }
  const juz = quranService.getJuz(juzNumber);
  res.send(juz);
};

module.exports = { getJuz };

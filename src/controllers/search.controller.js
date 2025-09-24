const httpStatus = require('http-status');
const { search } = require('../services/quran.service');
const catchAsync = require('../utils/catchAsync');

const searchByKeyword = catchAsync(async (req, res) => {
  const { q } = req.query;
  const result = search(q);
  res.status(httpStatus.OK).send(result);
});

module.exports = { searchByKeyword };

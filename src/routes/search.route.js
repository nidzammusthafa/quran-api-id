const express = require('express');
const { searchByKeyword } = require('../../controllers/search.controller');

const router = express.Router();

router.get('/', searchByKeyword);

module.exports = router;

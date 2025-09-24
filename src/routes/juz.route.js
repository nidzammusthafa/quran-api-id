const express = require('express');
const juzController = require('../controllers/juz.controller');

const router = express.Router();

router.get('/:juzNumber', juzController.getJuz);

module.exports = router;

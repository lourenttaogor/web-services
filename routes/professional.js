const express = require('express');
const router = express.Router();

const professionalController = require('../controllers/professional');

router.get('/', professionalController.getProfessional);

module.exports = router;

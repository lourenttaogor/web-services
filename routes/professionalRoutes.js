const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');

// Professional Route
router.get('/', professionalController.getProfessional);

module.exports = router;

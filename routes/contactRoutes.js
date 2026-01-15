const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Contact Route
router.get('/', contactController.getContacts);

module.exports = router;

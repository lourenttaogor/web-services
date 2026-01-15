const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Health Check Endpoint
router.get('/health', healthController.getHealth);

// Debug Route - List collections
router.get('/debug/collections', healthController.getCollections);

module.exports = router;

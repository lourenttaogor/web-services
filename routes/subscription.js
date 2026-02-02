const express = require('express');
const router = express.Router();

const subscriptionController = require('../controllers/subscription');

const { IsAuthenticated } = require('../middleware/autheticate');

// Protected routes - require authentication
router.get('/', IsAuthenticated, subscriptionController.getAllSubscription);

router.get('/:id', IsAuthenticated, subscriptionController.getSingleSubscription);

router.post('/', IsAuthenticated, subscriptionController.createSubscription);

router.put('/:id', IsAuthenticated, subscriptionController.updateSubscription);

router.delete('/:id', IsAuthenticated, subscriptionController.deleteSubscription);

module.exports = router;


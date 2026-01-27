const express = require('express');
const router = express.Router();

const subscriptionController = require('../controllers/subscription');

router.get('/', subscriptionController.getAllSubscription);

router.get('/:id', subscriptionController.getSingleSubscription);

router.post('/', subscriptionController.createSubscription);

router.put('/:id', subscriptionController.updateSubscription);

router.delete('/:id', subscriptionController.deleteSubscription);




module.exports = router;


const express = require('express');
const router = express.Router();
const contactsRouter = require('./contacts');
const professionalRouter = require('./professional');
const subscriptionRouter = require('./subscription');
const userRouter = require('./users');



router.use('/professional', professionalRouter);
router.use('/contacts', contactsRouter);
router.use('/subscription', subscriptionRouter);
router.use('/users', userRouter);
router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Hello World');
})

module.exports = router;


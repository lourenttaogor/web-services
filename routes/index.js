const express = require('express');
const router = express.Router();
const subscriptionRouter = require('./subscription');
const userRouter = require('./users');



router.use('/subscription', subscriptionRouter);
router.use('/users', userRouter);
router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Hello World');
})

module.exports = router;


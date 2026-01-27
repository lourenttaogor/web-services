const express = require('express');
const router = express.Router();
const contactsRouter = require('./contacts');
const professionalRouter = require('./professional');



router.use('/professional', professionalRouter);
router.use('/contacts', contactsRouter);
router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Hello World');
})

module.exports = router;


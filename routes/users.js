const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

const { IsAuthenticated } = require('../middleware/autheticate');

// Public routes
router.post('/signup', usersController.signup);
router.post('/login', usersController.login);

// Protected routes (require authentication)
router.get('/', IsAuthenticated, usersController.getAllUsers);

router.get('/:id', IsAuthenticated, usersController.getSingleUsers);

router.put('/:id', IsAuthenticated, usersController.updateUsers);

router.delete('/:id', IsAuthenticated, usersController.deleteUsers);




module.exports = router;







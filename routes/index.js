const express = require('express');
const router = express.Router();
const passport = require('passport');
const subscriptionRouter = require('./subscription');
const professionalRouter = require('./professional');
const userRouter = require('./users');



router.use('/subscription', subscriptionRouter);
router.use('/professional', professionalRouter);
router.use('/users', userRouter);
router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Hello World');
});

// Route to display login page
router.get('/login-page', (req, res) => {
    res.sendFile('login.html', { root: 'public' });
});

// Route to display subscriptions page
router.get('/subscriptions', (req, res) => {
    res.sendFile('subscriptions.html', { root: 'public' });
});

// API route to get current user info
router.get('/api/user', (req, res) => {
    console.log('Session:', req.session); // Debug logging
    console.log('Session User:', req.session?.user); // Debug logging

    if (req.session && req.session.user) {
        return res.status(200).json({
            loggedIn: true,
            user: {
                id: req.session.user.id,
                displayName: req.session.user.displayName,
                username: req.session.user.username,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName,
                avatar: req.session.user.photos ? req.session.user.photos[0].value : null,
                profileUrl: req.session.user.profileUrl,
                email: req.session.user.email
            }
        });
    }
    res.status(200).json({ loggedIn: false });
});

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }
            res.status(200).json({ message: 'Logout successful' });
        });
    });
});

module.exports = router;


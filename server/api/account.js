const express = require('express');
const router = express.Router();
const passport = require('passport');

const { User } = require('../models/user');
const Account = User.User;

router.post('/register', (req, res) => {
    let account = {
        username: req.body.username,
        role: req.body.role,
        licenseId: req.body.licenseId
    };

    Account.register(new Account(account), req.body.password, (err) => {
        err ? res.send(err) : res.send('Register Successful');
    });
});

router.post('/login', passport.authenticate('local'/* , { failureRedirect: '/login', failureFlash: true } */), (req, res) => {
    req.session.save((err) => {
        err ? res.send(err) : res.send('Login Successful');
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.save((err) => {
        err ? res.send(err) : res.send('Logout Successful');
    });
});

module.exports = router;

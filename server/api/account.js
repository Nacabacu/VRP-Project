const express = require('express');
const router = express.Router();
const passport = require('passport');

const { User } = require('../models/user');
const Account = User.User;

router.post('/register', (req, res) => {
    let account = {
        username: req.body.username,
        role: req.body.role,
        licenseNo: req.body.licenseNo
    };

    Account.register(new Account(account), req.body.password, (err) => {
        err ? res.send(err) : res.send('Register Successful');
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    req.session.save((err) => {
        err ? res.send(err) : res.send({
            username: res.req.user.username,
            role: res.req.user.role,
            licenseNo: res.req.user.licenseNo
        });
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.save((err) => {
        err ? res.send(err) : res.send('Logout Successful');
    });
});

module.exports = router;

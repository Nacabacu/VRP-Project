const express = require('express');
const router = express.Router();

const account = require('./api/account');
const client = require('./api/client');
const vrp = require('./api/vrp');

// API for Account
router.use('/account', account);

// API for Mongodb
router.use('/client', client);

// API for VRP
router.use('/vrp', vrp);

module.exports = router;
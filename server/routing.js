const express = require('express');
const router = express.Router();

const account = require('./api/account');
const client = require('./api/client');
const depot = require('./api/depot');
const driver = require('./api/driver');
const vrp = require('./api/vrp');

// API for Account
router.use('/account', account);

// API for clients
router.use('/client', client);

// API for depots
router.use('/depot', depot);

// API for Drivers
router.use('/driver', driver);

// API for VRP
router.use('/vrp', vrp);

module.exports = router;

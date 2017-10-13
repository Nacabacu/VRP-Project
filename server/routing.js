const express = require('express');
const router = express.Router();

const account = require('./api/account');
const mongodb = require('./api/mongodb');
const vrp = require('./api/vrp');

// API for Account
router.use('/account', account);

// API for Mongodb
router.use('/mongodb', mongodb);

// API for VRP
router.use('/vrp', vrp);

module.exports = router;
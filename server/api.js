const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const node_or_tools = require('node_or_tools');
const passport = require('passport');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Depot } = require('./models/depot');
const { Client } = require('./models/client');
const { Driver } = require('./models/driver');
const { PlanningResult } = require('./models/planningResult');
const Account = require('./models/user').User;

// API for Account
router.post('/register', (req, res) => {
    var account = {
        username: req.body.username,
        role: req.body.role,
        licenseId: req.body.licenseId
    };

    Account.register(new Account(account), req.body.password, (err, account) => {
        err ? res.send(err) : res.send('Register Successful');
    });
});

router.post('/login', passport.authenticate('local'/*, { failureRedirect: '/login', failureFlash: true }*/), (req, res) => {
    req.session.save((err) => {
        err ? res.send(err) : res.send('Login Successful');
    });
});

router.get('/logout', (req, res) => {
    console.log(req)
    req.logout();
    req.session.save((err) => {
        err ? res.send(err) : res.send('Logout Successful');
    });
});

// API for Apps
router.get('/depots', (req, res) => {
    Depot.find().then((depots) => {
        res.send({ depots });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/clients', (req, res) => {
    Client.find().then((clients) => {
        res.send({ clients });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/drivers', (req, res) => {
    Driver.find().then((drivers) => {
        res.send({ drivers });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/planningResults', (req, res) => {
    PlanningResult.find().then((results) => {
        res.send({ results });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/node', (req, res) => {
    var solverOpts = {
        numNodes: 3,
        costs: [[0, 10, 10], [10, 0, 10], [10, 10, 0]],
        durations: [[0, 2, 2], [2, 0, 2], [2, 2, 0]],
        timeWindows: [[0, 9], [2, 3], [2, 3]],
        demands: [[0, 0, 0], [1, 1, 1], [1, 1, 1]]
    };

    var VRP = new node_or_tools.VRP(solverOpts);

    var vrpSearchOpts = {
        computeTimeLimit: 1000,
        numVehicles: 3,
        depotNode: 0,
        timeHorizon: 9 * 60 * 60,
        vehicleCapacity: 3,
        routeLocks: [[], [], []],
        pickups: [],
        deliveries: []
    };

    VRP.Solve(vrpSearchOpts, function (err, solution) {
        if (err) return console.log(err);
        res.send(solution);
    });
});

module.exports = router;
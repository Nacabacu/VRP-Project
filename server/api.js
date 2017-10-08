const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const node_or_tools = require('node_or_tools');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Depot } = require('./models/depot');
var { Client } = require('./models/client');
var { Driver } = require('./models/driver');
var { PlanningResult } = require('./models/planningResult');

router.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({ users });
    }, (e) => {
        res.status(400).send(e);
    });
});

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
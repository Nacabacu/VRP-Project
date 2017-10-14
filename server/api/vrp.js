const express = require('express');
const router = express.Router();
const node_or_tools = require('node_or_tools');
const vrpHandler = require('../handlers/vrp');

var googleMapClient = require('@google/maps').createClient({
    key: 'AIzaSyABytE7LZW-b6GR54wThg3n6iwaWuw0vqU',
    Promise: require('q').Promise
});

router.post('/saveRoute', (req, res) => {
    googleMapClient.distanceMatrix({
        origins: req.body.origins,
        destinations: req.body.destinations
    })
    .asPromise()
    .then(function (response) {
        return vrpHandler.vrpSolver(req.body, response);      
    })
    .then(function (results) {
        res.send(results);
    });
});

router.get('/node', (req, res) => {
    var solverOpts = {
        numNodes: 8,
        costs: [
            [0, 1573, 1995, 811, 1230, 2042, 822, 921],
            [1568, 0, 421, 1017, 703, 469, 1994, 2093],
            [1992, 424, 0, 1442, 1127, 606, 2418, 2517],
            [826, 1011, 1432, 0, 668, 1480, 1252, 1352],
            [1230, 696, 1118, 679, 0, 1165, 1655, 1754],
            [2037, 469, 588, 1487, 1172, 0, 2463, 2562],
            [803, 1996, 2417, 1234, 1653, 2465, 0, 836],
            [922, 2116, 2537, 1353, 1772, 2585, 837, 0]
        ],
        durations: [
            [0, 1, 1, 1, 1, 1, 1, 1],   
            [1, 0, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0]
        ],
        timeWindows: [[0, 5], [0, 5], [0, 5], [0, 5], [0, 5], [0, 5], [0, 5], [0, 5]],
        demands: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]
    };

    var test = new node_or_tools.VRP(solverOpts);

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

    test.Solve(vrpSearchOpts, function (err, solution) {
        if (err) return console.log(err);
        res.send(solution);
    });
});


module.exports = router;
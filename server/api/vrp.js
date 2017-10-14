const express = require('express');
const router = express.Router();
const node_or_tools = require('node_or_tools');
const vrpHandler = require('../handlers/vrp');

var googleMapClient = require('@google/maps').createClient({
    key: 'AIzaSyABytE7LZW-b6GR54wThg3n6iwaWuw0vqU',
    Promise: require('q').Promise
});

const { mongoose } = require('../db/mongoose')
const { PlanningResult } = require('../models/planningResult');

const errorHandler = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

router.get('/getResults', (req, res) => {
    PlanningResult.find().then((results) => {
        res.send({ results });
    }, (err) => {
        errorHandler(err, res);
    });
});

router.post('/saveRoute', (req, res) => {
    var coordinates = [];
    coordinates.push(req.body.depot.coordinate);

    req.body.clients.forEach(function (client) {
        coordinates.push(client.coordinate);
    });

    googleMapClient.distanceMatrix({
        origins: coordinates,
        destinations: coordinates,
        departure_time: new Date(req.body.date).getTime()
    })
    .asPromise()
    .then(function (response) {
        return vrpHandler.vrpSolver(req.body, response);      
    })
    .then(function (result) {
        var vehicles = [];

        result.routes.forEach(function (route, index) {
            var loadWeight = 0;

            route.forEach(function (client) {
                loadWeight += req.body.demands[client];
            });

            vehicles.push({
                "driver": req.body.drivers[index],
                "route": route,
                "LoadWeight": loadWeight,
                "isCompleted": false
            });
            index++;
        });

        var planningResult = new PlanningResult({
            date: new Date('2018-01-22T14:56:59.301Z'),
            depot: req.body.depot,
            vehicles: vehicles,
            clients: req.body.clients
        });

        planningResult.save(function (err) {
            if (err) errorHandler(err, res);
            res.status(200).send(result);
        });
    })
    .catch(function (err) {
        errorHandler(err, res);
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
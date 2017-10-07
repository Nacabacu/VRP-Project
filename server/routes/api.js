const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const node_or_tools = require('node_or_tools');

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
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
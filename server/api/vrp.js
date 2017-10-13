const express = require('express');
const router = express.Router();
const node_or_tools = require('node_or_tools');

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
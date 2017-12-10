const nodeOrTools = require('node_or_tools');

var getDistancesMatrix = function (input) {
    return new Promise(function (resolve) {
        var distance = [];
        var duration = [];

        input.json.rows.forEach(function (elements, rowIndex) {
            var distanceTemp = [];
            var durationTemp = [];

            elements.elements.forEach(function (element, colIndex) {
                distanceTemp.push(element.distance.value);
                rowIndex === colIndex ? durationTemp.push(0) : durationTemp.push(element.duration_in_traffic.value);
            });

            distance.push(distanceTemp);
            duration.push(durationTemp);
        });

        resolve({
            distance,
            duration
        });
    });
};

var vrpSolver = function (request, distances) {
    return new Promise(function (resolve, reject) {
        getDistancesMatrix(distances).then(function (results) {
            // 8 hours [9am - 5pm]
            var demandsArray = [0];
            var waitTimeArray = [0];
            var depotIndex = 0;
            var dayStarts = 0;
            var dayEnds = 3 * 60 * 60; // 3 hours per delivery round
            var numNodes = results.duration[0].length;
            var timeWindows = new Array(numNodes);
            var demands = new Array(numNodes);
            var waitTime = new Array(numNodes);
            var routeLocks = [];

            // set timeWindows as full day working
            for (var at = 0; at < numNodes; ++at) {
                // if (at === 0) {
                    // timeWindows[at] = [dayStarts, dayEnds + 1 * 60 * 60]; // add 1 hour for end day of depot
                // } else {
                timeWindows[at] = [dayStarts, dayEnds];
                // }
            }

            request.clients.forEach((client) => {
                demandsArray.push(client.demand);
                waitTimeArray.push(client.waitTime);
            });

            // Building demands Array
            for (var from = 0; from < numNodes; ++from) {
                demands[from] = new Array(numNodes);
                for (var to = 0; to < numNodes; ++to) {
                    demands[from][to] = demandsArray[from];
                }
            }

            // Building wait time array
            for (var from = 0; from < numNodes; from++) {
                waitTime[from] = new Array(numNodes);
                for (var to = 0; to < numNodes; to++) {
                    if (from !== to) {
                        waitTime[from][to] = waitTimeArray[from] * 60 + results.duration[from][to];
                    } else {
                        waitTime[from][to] = 0;
                    }
                }
            }

            // Building route locking
            for (var index = 0; index < request.numVehicles; index++) {
                routeLocks.push([]);
            }

            var solverOpts = {
                numNodes: numNodes,
                costs: request.method === 'distance' ? results.distance : waitTime, /* results.duration */
                durations: waitTime,
                timeWindows: timeWindows,
                demands: demands
            };

            var VRP = new nodeOrTools.VRP(solverOpts);

            var vrpSearchOpts = {
                computeTimeLimit: 3000,
                numVehicles: parseInt(request.numVehicles),
                depotNode: depotIndex,
                timeHorizon: 3 * 60 * 60,
                vehicleCapacity: parseInt(request.vehicleCapacity),
                routeLocks: routeLocks,
                pickups: [],
                deliveries: []
            };

            VRP.Solve(vrpSearchOpts, function (err, solution) {
                if (err) reject('Unable to find a solution');
                resolve({
                    solution,
                    duration: results.duration
                });
            });
        }).catch(function (err) {
            console.log(err);
            reject('Unable to get distance matrix');
        });
    });
};

module.exports = {
    vrpSolver
};

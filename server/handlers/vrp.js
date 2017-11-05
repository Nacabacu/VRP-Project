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
            var dayEnds = request.workingHour * 60 * 60;
            var numNodes = results.duration[0].length;
            var timeWindows = new Array(numNodes);
            var demands = new Array(numNodes);
            var waitTime = new Array(numNodes);

            // set timeWindows as full day working
            for (var at = 0; at < numNodes; ++at) {
                timeWindows[at] = [dayStarts, dayEnds];
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
                        waitTime[from][to] = waitTimeArray[from] + results.duration[from][to];
                    } else {
                        waitTime[from][to] = 0;
                    }
                }
            }

            var solverOpts = {
                numNodes: numNodes,
                costs: request.method === 'distance' ? results.distance : results.duration,
                durations: waitTime,
                timeWindows: timeWindows,
                demands: demands
            };

            var VRP = new nodeOrTools.VRP(solverOpts);

            var vrpSearchOpts = {
                computeTimeLimit: 2000,
                numVehicles: request.numVehicles,
                depotNode: depotIndex,
                timeHorizon: 12 * 60 * 60,
                vehicleCapacity: request.vehicleCapacity,
                routeLocks: request.routeLocks,
                pickups: [],
                deliveries: []
            };

            VRP.Solve(vrpSearchOpts, function (err, solution) {
                if (err) reject(err);
                resolve({
                    solution,
                    duration: results.duration
                });
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

module.exports = {
    vrpSolver
};

const node_or_tools = require('node_or_tools');

var getDistancesMatrix = function (input) {
    return new Promise(function (resolve, reject) {
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
        })
    });
}

var vrpSolver = function (request, distances) {
    
    return new Promise(function (resolve, reject) {
        getDistancesMatrix(distances).then(function (results) {
            // 8 hours [9am - 5pm]
            var depotIndex = 0;
            var dayStarts = 0;
            var dayEnds = request.workingHour * 60 * 60;
            var numNodes = results.duration[0].length;
            var timeWindows = new Array(numNodes);
            var demands = new Array(numNodes);
            
            // set timeWindows as full day working
            for (var at = 0; at < numNodes; ++at)
            timeWindows[at] = [dayStarts, dayEnds];
            
            // set demands as 1 
            for (var from = 0; from < numNodes; ++from) {
                demands[from] = new Array(numNodes);
                for (var to = 0; to < numNodes; ++to) {
                    demands[from][to] = request.demands[from];
                }
            }
            
            var solverOpts = {
                numNodes: numNodes,
                costs: request.method === 'distance' ? results.distance : results.duration,
                durations: results.duration,
                timeWindows: timeWindows,
                demands: demands
            };
            
            var VRP = new node_or_tools.VRP(solverOpts);
            
            var vrpSearchOpts = {
                computeTimeLimit: 2000,
                numVehicles: request.numVehicles,
                depotNode: 0,
                timeHorizon: 12 * 60 * 60,
                vehicleCapacity: request.vehicleCapacity,
                routeLocks: request.routeLocks,
                pickups: [],
                deliveries: []
            };

            VRP.Solve(vrpSearchOpts, function (err, solution) {
                if (err) reject(err);
                resolve(solution);
            });
        }).catch(function (err) {
            reject(err);
        })
    });
}

module.exports = {
    vrpSolver
}
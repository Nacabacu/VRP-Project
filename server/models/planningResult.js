const mongoose = require('mongoose');

var PlanningResult = mongoose.model('planningResults', {
    date: {
        type: Date,
        require: true
    },
    depot: {
        depotName: {
            type: String,
            require: true
        },
        coordinate: {
            type: [Number],
            require: true
        }
    },
    vehicles: [
        {
            driver: {
                name: {
                    type: String,
                    require: true
                },
                licenseNo: {
                    type: String,
                    require: true
                },
                vehicleNo: {
                    type: String,
                    require: true
                }
            },
            route: {
                type: [Number],
                require: true
            },
            LoadWeight: {
                type: Number,
                require: true
            },
            isCompleted: {
                type: Boolean,
                require: true
            }
        }
    ],
    clients: [
        {
            clientName: {
                type: String,
                require: true
            },
            coordinate: {
                type: [Number],
                require: true
            }
        },
    ]
}, 'planningResults');

module.exports = { PlanningResult }

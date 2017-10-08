var mongoose = require('mongoose');

var PlanningResult = mongoose.model('planningResults', {
  date: {
    type: Date,
    require: true
  },
  depoId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  vehicles: [
    {
      driverId: {
        type: mongoose.Schema.ObjectId,
        require: true
      },
      route: {
        type: [Number],
        require: true
      },
      capacity: {
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
      clientId: {
        type: mongoose.Schema.ObjectId,
        require: true
      },
      branchId: {
        type: Number,
        require: true
      }
    },
  ]
}, 'planningResults');

module.exports = { PlanningResult }
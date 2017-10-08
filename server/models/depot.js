var mongoose = require('mongoose');

var Depot = mongoose.model('depots', {
  depotName: {
    type: String,
    require: true,
    trim: true
  },
  lat: {
    type: Number,
    require: true
  },
  lng: {
    type: Number,
    require: true
  }
});

module.exports = { Depot }
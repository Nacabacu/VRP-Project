var mongoose = require('mongoose');

var Driver = mongoose.model('drivers', {
  name: {
    type: String,
    require: true,
    trim: true
  },
  licenseNo: {
    type: String,
    require: true,
    trim: true
  },
  vehicle: {
    type: String,
    require: true,
    trim: true
  },
  maxCapacity: {
    type: Number,
    require: true
  }
});

module.exports = { Driver }
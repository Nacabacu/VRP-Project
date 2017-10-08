var mongoose = require('mongoose');

var Client = mongoose.model('clients', {
  companyName: {
    type: String,
    require: true,
    trim: true
  },
  branch: [
    {
      branchId: {
        type: Number,
        require: true
      },
      branchName: {
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
    }
  ]
});

module.exports = { Client }
var mongoose = require('mongoose');

var User = mongoose.model('users', {
  username: {
    type: String,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  role: {
    type: String,
    require: true
  },
  licenseNo: {
    type: String
  }
});

module.exports = { User }
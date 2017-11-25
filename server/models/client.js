const { mongoose } = require('../db/mongoose');

var Client = mongoose.model('clients', {
    clientName: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        trim: true
    },
    address: {
        type: String,
        require: true,
    },
    coordinate: {
        type: [Number],
        require: true
    }
});

module.exports = { Client };

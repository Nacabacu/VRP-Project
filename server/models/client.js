const { mongoose } = require('../db/mongoose');

var Client = mongoose.model('clients', {
    clientName: {
        type: String,
        require: true,
    },
    telNum: {
        type: String,
        require: true,
        trim: true
    },
    coordinate: {
        type: [Number],
        require: true
    }
});

module.exports = { Client };

const { mongoose } = require('../db/mongoose');

var Depot = mongoose.model('depots', {
    depotName: {
        type: String,
        require: true,
        trim: true
    },
    coordinate: [Number]
});

module.exports = { Depot };

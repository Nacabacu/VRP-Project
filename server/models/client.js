const mongoose = require('mongoose');

var Client = mongoose.model('clients', {
    companyName: {
        type: String,
        require: true,
        trim: true
    },
    branches: [
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
            coordinate: [Number]
        }
    ]
});

module.exports = { Client }

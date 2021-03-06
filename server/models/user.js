const { mongoose } = require('../db/mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        require: true
    },
    licenseNo: String
});

Account.plugin(passportLocalMongoose);

var User = mongoose.model('users', Account);

module.exports = { User };

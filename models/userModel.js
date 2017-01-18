var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    email: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    },
    learner: {
        type: Boolean,
        default: true
    },
    teacher: {
        type: Boolean,
        default: false
    },
    moderator: {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', UserSchema);
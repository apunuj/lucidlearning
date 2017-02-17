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
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
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
        default: true
    },
    moderator: {
        type: Boolean,
        default: false
    },
    freelancer: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', UserSchema);
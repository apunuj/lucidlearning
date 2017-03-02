var User = require('../models/userModel');
var jwt = require('jsonwebtoken');

var config = require('../config.js');

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {
        expiresIn: 36000
    });
};

exports.verifyLearner = function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded){
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

exports.verifyTeacher = function(req, res, next){
    if(!req.decoded) {
        console.log('You are not a verified user');
        var err = new Error ('You are not a verified user');
        err.status = 401;
        return next(err);
    } else {
        var isTeacher = req.decoded._doc.teacher;
        if (isTeacher == true) {
            console.log('User is verified and is also a teacher');
            next();
        } else {
            var err = new Error('You don\'t have admin privileges');
            err.status = 401;
            return next(err);
        }
    }
};

exports.verifyModerator = function(req, res, next){
    if(!req.decoded) {
        console.log('You are not a verified user');
        var err = new Error ('You are not a verified user');
        err.status = 401;
        return next(err);
    } else {
        var isModerator = req.decoded._doc.moderator;
        if (isModerator == true) {
            console.log('User is verified and is also a moderator');
            next();
        } else {
            var err = new Error('You don\'t have admin privileges');
            err.status = 401;
            return next(err);
        }
    }
};

exports.verifyAdmin = function(req, res, next){
    if(!req.decoded) {
        console.log('You are not a verified user');
        var err = new Error ('You are not a verified user');
        err.status = 401;
        return next(err);
    } else {
        var isAdmin = req.decoded._doc.admin;
        if (isAdmin == true) {
            console.log('User is verified and is also an admin');
            next();
        } else {
            var err = new Error('You don\'t have admin privileges');
            err.status = 401;
            return next(err);
        }
    }
};


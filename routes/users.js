var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/userModel');
var Verify = require('./verify');

/* GET users listing. */
router.get('/', Verify.verifyLearner, Verify.verifyAdmin, function(req, res, next) {
  User.find(req.query, function(err, users){
        if (err) {
           res.send(err);
           return;
       } 
        res.json(users);
    });
});

//Fields required with signup request: email, name, teacher, password
router.post('/signup', function(req, res){
    User.register(new User({
      email: req.body.email,
      userName: req.body.userName,
      teacher: req.body.teacher}), req.body.password, function(err, user){
        if (err)
            return res.status(500).json({err: err});
        passport.authenticate('local')(req, res, function(){
            return res.status(200).json({status: 'Registration Successfull!'});
        });
    });
});

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if (err) {
            return next(err);
        }
        if(!user) {
            return res.status(401).json({
                err: info
            });
        }
        
        req.logIn(user, function(err){
           if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            
            var token = Verify.getToken(user);
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token,
                user: {
                    _id: user._id,
                    email: user.email,
                    friends: user.friends,
                    userName: user.userName,
                    learner: user.learner,
                    teacher: user.teacher,
                    moderator: user.moderator,
                    admin: user.admin
                }
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

module.exports = router;


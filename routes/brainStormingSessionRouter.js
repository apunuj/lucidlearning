var express = require('express');
var brainStormingSessionRouter = express.Router();

var BrainStormingSessions = require('../models/brainStormingSessions');
var Modules = require('../models/modules');
var Verify = require('./verify');

brainStormingSessionRouter.route('/')
.get(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    BrainStormingSessions.find(req.query, function(err, brainStormingSessions){
        if (err){
            next (err);
        }
        res.json(brainStormingSessions);
    })
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    BrainStormingSessions.create(req.body, function(err, brainStormingSession){
        if (err) {
            next (err);
        }
        res.json(brainStormingSession);
    });
})

brainStormingSessionRouter.route('/:id')
.get(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    BrainStormingSessions.findById(req.params.id, function(err, brainStormingSession){
        if (err) {
            next (err);
        }
        res.json(brainStormingSession);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    BrainStormingSessions.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {new: true}, function(err, updatedBrainStormingSession){
         if (err) {
            next (err);
        }
        res.json(updatedBrainStormingSession);
    });
})

module.exports = brainStormingSessionRouter;

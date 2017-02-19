var express = require('express');
var lpRouter = express.Router();

var LearningPoints = require('../models/learningPoints');
var Verify = require('./verify');

lpRouter.route('/')
.get(Verify.verifyLearner, function(req, res, next){
    LearningPoints.find(req.query, function(err, learningPoints) {
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(learningPoints);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    LearningPoints.create(req.body, function(err, learningPoint){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(learningPoint._id);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    LearningPoints.remove(req.query, function(err, resp){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(resp);
    });
});

lpRouter.route('/:id')
.get(Verify.verifyLearner, function(req, res, next){
    LearningPoints.findById(req.params.id, function(err, learningPoint){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(learningPoint);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    LearningPoints.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function(err, learningPoint){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(learningPoint);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    LearningPoints.findByIdAndRemove(req.params.id, function(err, resp){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(resp);
    });
});

module.exports = lpRouter;

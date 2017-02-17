var express = require('express');
var topicRouter = express.Router();

var async = require('async');

var Topics = require('../models/topics');
var LearningPoints = require('../models/learningPoints');

var Verify = require('./verify');

topicRouter.route('/')
.get(Verify.verifyLearner, function(req, res, next){
    Topics.find(req.query).populate({
        path: 'learningPoints',
        model: 'LearningPoint'
    }).exec(function(err, topics) {
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(topics);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Topics.create({name:req.body.name, learningPoints: []}, function(err, topic){
        if (err) {
            console.log(err);
            next(err);
        }
        async.eachSeries(req.body.learningPoints, function(learningPoint, cb){
            LearningPoints.create(learningPoint, function(err, newLp){
                topic.learningPoints.push(newLp._id);
                cb();
            });
        }, function(err){
            topic.save(function(err, savedTopic){
                res.json(savedTopic);
            });
        });
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, Verify.verifyAdmin, function(req, res, next) {
    Topics.remove(req.query, function(err, resp){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(resp);
    });
});

topicRouter.route('/:id')
.get(Verify.verifyLearner, function(req, res, next){
    Topics.findById(req.params.id).populate({
        path: 'learningPoints',
        model: 'LearningPoint'
    }).exec(function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(topic);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    Topics.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(topic);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, Verify.verifyAdmin, function(req, res, next){
    Topics.findByIdAndRemove(req.params.id, function(err, resp){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(resp);
    });
});

topicRouter.route('/:id/learningPoints')
.get(Verify.verifyLearner, function(req, res, next){
    Topics.findById(req.params.id).populate({
        path: 'learningPoints',
        populate: 'LearningPoint'
    }).exec(function(err, topic){
       if (err) {
           console.log(err);
           next(err);
       } 
        res.json(topic.learningPoints);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    LearningPoints.create(req.body, function(err, learningPoint){
        if (err) {
            next (err);
        }
        Topics.findById(req.params.id, function(err, topic){
            topic.learningPoints.push(learningPoint._id);
            topic.save(function(err, savedTopic){
                if (err) {
                    next(err);
                }
                res.json(learningPoint);
            });
        });
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, Verify.verifyAdmin,function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
       async.eachSeries(topic.learningPoints, function(learningPoint, cb){
           LearningPoints.findByIdAndRemove(learningPoint, function (err, resp){
               if (err) {
                   next(err);
               }
               cb();
           });
       }, function (err){
           if (err) {
               next(err);
           }
           topic.learningPoints = [];
           topic.save(function (err, savedTopic) {
               if (err) {
                   next(err);
               }
               res.json(resp);
           });
       });
    });
});

topicRouter.route('/:id/learningPoints/:lid')
.get(Verify.verifyLearner, function(req, res, next){
    LearningPoints.findById(req.params.lid, function(err, learningPoint){
        if (err) {
           console.log(err);
           next(err);
        }
        res.json(learningPoint);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    LearningPoints.findByIdAndUpdate(req.params.lid, {
        $set: req.body
    }, {
        new: true
    }, function(err, learningPoint){
        if (err) {
           next(err);
       } 
       res.json(learningPoint);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, Verify.verifyAdmin, function(req, res, next){
    LearningPoints.findByIdAndRemove(req.params.lid, function(err, resp){
        Topics.findById(req.params.id, function (err, topic){
            topic.learningPoints.splice(topic.learningPoints.indexOf(req.params.lid),1);
            topic.save(function(err, savedTopic){
                if (err) {
                    next (err);
                }
                res.json(resp);
            });
        });
    });
});

module.exports = topicRouter;
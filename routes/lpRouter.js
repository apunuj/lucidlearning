var express = require('express');
var lpRouter = express.Router();

var LearningPoints = require('../models/learningPoints');

lpRouter.route('/')
.get(function(req, res, next){
    LearningPoints.find({}, function(err, learningPoints) {
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(learningPoints);
    });
})
.post(function(req, res, next){
    LearningPoints.create(req.body, function(err, learningPoint){
        if (err) {
            console.log(err);
            next(err);
        }
        console.log("LP created");
        var id = learningPoint._id;
        res.writeHead(200, {
           'Content-Type': 'text/plain'
        });
        res.end('Added the LP with ID: '+id);
    });
})
.delete(function(req, res, next) {
    LearningPoints.remove({}, function(err, resp){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(resp);
    });
});

lpRouter.route('/:id')
.get(function(req, res, next){
    LearningPoints.findById(req.params.id, function(err, learningPoint){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(learningPoint);
    });
})
.put(function(req, res, next) {
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
.delete(function(req, res, next){
    LearningPoints.findByIdAndRemove(req.params.id, function(err, resp){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(resp);
    });
});

module.exports = lpRouter;

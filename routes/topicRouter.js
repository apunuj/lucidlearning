var express = require('express');
var topicRouter = express.Router();

var Topics = require('../models/topics');

topicRouter.route('/')
.get(function(req, res, next){
    Topics.find({}, function(err, topics) {
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(topics);
    });
})
.post(function(req, res, next){
    Topics.create(req.body, function(err, topic){
        if (err) {
            console.log(err);
            next(err);
        }
        console.log("topic created");
        var id = topic._id;
        res.writeHead(200, {
           'Content-Type': 'text/plain'
        });
        res.end('Added the topic with ID: '+id);
    });
})
.delete(function(req, res, next) {
    Topics.remove({}, function(err, resp){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(resp);
    });
});

topicRouter.route('/:id')
.get(function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(topic);
    });
})
.put(function(req, res, next) {
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
.delete(function(req, res, next){
    Topics.findByIdAndRemove(req.params.id, function(err, resp){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(resp);
    });
});

topicRouter.route('/:id/learningPoints')
.get(function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
       if (err) {
           console.log(err);
           next(err);
       } 
        res.json(topic.learningPoints);
    });
})
.post(function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        topic.learningPoints.push(req.body);
        topic.save(function(err, utopic){
            if (err) {
                console.log(err);
                next(err);
            } 
            console.log('Learning Point added');
            res.json(utopic);
        });
    });
})
.delete(function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        for (var i = (topic.learningPoints.length - 1); i >= 0; i--){
            topic.learningPoints.id(topic.learningPoints[i]._id).remove();
        }
        topic.save(function(err, module){
            if (err) {
                console.log(err);
                next(err);
            } 
            res.writeHead(200, {
                'Content-Type':'text/plain'
            });
            res.end('Deleted all the Learning Points!');
        });
    });
});

topicRouter.route('/:id/learningPoints/:lid')
.get(function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
        }
        res.json(topic.learningPoints.id(req.params.lid));
    });
})
.put(function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        var i = topic.learningPoints.indexOf(topic.learningPoints.id(req.params.lid));
        
        topic.learningPoints.id(req.params.lid).remove();
        topic.learningPoints.splice(i, 0, req.body);
        topic.save(function(err, topic){
            if (err) {
                console.log(err);
                next(err);
            } 
            console.log('Learning Point updated')
            res.json(topic);
        });
    });
})
.delete(function(req, res, next){
    Topics.findById(req.params.id, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        topic.learningPoints.id(req.params.lid).remove();
        topic.save(function(err, resp){
            if (err) {
                console.log(err);
                next(err);
            } 
            res.json(resp);
        });
    });
});

module.exports = topicRouter;
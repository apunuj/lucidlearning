var express = require('express');
var moduleRouter = express.Router();

var async = require('async');

var Modules = require('../models/modules');
var Topics = require('../models/topics');
var LearningPoints = require('../models/learningPoints');

var Verify = require('./verify');

moduleRouter.route('/')
.get(function(req, res, next){
   Modules.find(req.query).populate({
       path: 'topics',
       model: 'Topic',
       populate: {
           path: 'learningPoints',
           model: 'LearningPoint'
       }
   }).exec(function(err, modules){
       if (err) {
           next(err);
       }
       res.json(modules);
   });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.create({name: req.body.name, topics: [], createdBy:req.body.createdBy}, function(err, module){
        if (err) {
            console.log(err);
            next(err);
        }
        else {
            res.json(module);  
        }
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, Verify.verifyAdmin, function(req, res, next) {
    Modules.remove(req.query, function(err, resp){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(resp);
    });
});

moduleRouter.route('/:id')
.get(function(req, res, next){
    Modules.findById(req.params.id).populate({
        path: 'topics',
        model: 'Topic',
        populate: {
            path: 'learningPoints',
            model: 'LearningPoint'
        }
    }).exec(function(err, module){
        if (err) {
            next(err);
        }
        res.json(module);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    /**only for change in module name or reassigning the entire topic array ids for reordering
    */
    Modules.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(module)
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, Verify.verifyAdmin, function(req, res, next){
    Modules.findByIdAndRemove(req.params.id, function(err, resp){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(resp);
    });
});

moduleRouter.route('/:id/topics')
.get(Verify.verifyLearner, function(req, res, next){
    Modules.findById(req.params.id).populate({
        path: 'topics',
        model: 'Topic',
        populate: {
            path: 'learningPoints',
            model: 'LearningPoint'
        }
    }).exec(function(err, module){
        if (err){
            next(err);
        }
        res.json(module.topics);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Topics.create(req.body, function(err, topic){
        if (err){
            next(err);
        }
        Modules.findById(req.params.id, function(err, module){
            if (err) {
            console.log(err);
            next(err);
            } 
            module.topics.push(topic._id);
            module.save(function(err, umodule){
                if (err) {
                    console.log(err);
                    next(err);
                } 
                console.log('Topic added');
                res.json(topic);
            });
        });
    }); 
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
       async.eachSeries(module.topics, function(topic, cb){
           Topics.findByIdAndRemove(topic._id, function(err, resp){
               if (err){
                   next(err);
               }
               res.send("topics deleted");
               cb();
           });
       }, function(err){
           if (err) {
               next (err);
           }
           module.topics = [];
           module.save(function(err, module){
               console.log("Updated module:"+module);
               res.json(resp)
           });
        });
    });
});

moduleRouter.route('/:id/topics/:tid')
.get(Verify.verifyLearner, function(req, res, next){
    Topics.findById(req.params.tid).populate({
        path: 'learningPoints',
        model: 'LearningPoint'
    }).exec(function(err, topics){
        if(err){
            next(err);
        }
        res.json(topics);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Topics.findByIdAndUpdate(req.params.tid, {
        $set: req.body
    }, {
        new: true
    }, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(topic)
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Topics.findByIdAndRemove(req.params.tid, function(err, resp){
        if (err){
            next(err);
        }
        console.log("Topic Removed");
        Modules.findById(req.params.id, function(err, module){
            if (err){
                next(err);
            }
            module.topics.splice(module.topics.indexOf(req.params.tid),1);
            res.json(resp);
        });
    });
});

moduleRouter.route('/:id/topics/:tid/learningPoints')
.get(Verify.verifyLearner, function(req, res, next){
    Topics.findById(req.params.tid).populate({
        path: 'learningPoints',
        model: 'LearningPoint'
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
        if (err){
            next(err);
        }
        Topics.findById(req.params.tid, function(err, topic){
            if (err) {
            console.log(err);
            next(err);
            } 
            topic.learningPoints.push(learningPoint._id);
            topic.save(function(err, utopic){
                if (err) {
                    console.log(err);
                    next(err);
                } 
                console.log('Learning Point added');
                res.json(learningPoint);
            });
        });
    }); 
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, Verify.verifyAdmin, function(req, res, next){
    Topics.findById(req.params.tid, function(err, topic){
        if (err) {
           console.log(err);
           next(err);
       } 
       async.eachSeries(topic.learningPoints, function(learningPoint, cb){
           LearningPoints.findByIdAndRemove(learningPoint._id, function(err, resp){
               if (err){
                   next(err);
               }
               res.send("learning points deleted");
               cb();
           });
       }, function(err){
           if (err) {
               next (err);
           }
           topic.learningPoints = [];
           topic.save(function(err, topic){
               console.log("Updated topic:"+topic);
               res.json(resp);
           });
        });
    });
});

moduleRouter.route('/:id/topics/:tid/learningPoints/:lid')
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
           console.log(err);
           next(err);
       }
       res.json(learningPoint);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    LearningPoints.findByIdAndRemove(req.params.lid, function(err, resp){
        if (err){
            next(err);
        }
        console.log("Learning Point Removed");
        Topics.findById(req.params.tid, function(err, topic){
            if (err){
                next(err);
            }
            topic.learningPoints.splice(topic.learningPoints.indexOf(req.params.lid),1);
            topic.save(function(err, savedTopic){
                res.json(resp);
            })
        });
    });
});

module.exports = moduleRouter;
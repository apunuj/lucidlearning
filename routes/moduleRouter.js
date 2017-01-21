var express = require('express');
var moduleRouter = express.Router();

var async = require('async');

var Modules = require('../models/modules');
var Topics = require('../models/topics');
var LearningPoints = require('../models/learningPoints');

var Verify = require('./verify');

moduleRouter.route('/')
.get(Verify.verifyLearner, function(req, res, next){
    Modules.find(req.query).populate({
        path: 'topics',
    }).exec(function(err, modules){
        if (err) {
            next(err);
        } else {
            async.eachSeries(modules, function(module, cb){
                async.eachSeries(module.topics, function(topic, callback){
                    LearningPoints.populate(topic, {'path':'learningPoints'}, function(err, topic){
                        if (err) {
                            next(err);
                        }
                        callback();
                    });
                }, function(err){
                    cb();
                });
                }, function(err){
                    res.json(modules);
            });
        }
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.create({name: req.body.name, topics: []}, function(err, module){
        if (err) {
            console.log(err);
            next(err);
        }
        else {
            console.log("initial version of module created");
        
            async.eachSeries(req.body.topics, function(topic, outcb) {
                Topics.create({name: topic.name, learningPoints: []}, function(err, newTopic){
                    module.topics.push(newTopic._id);
                    console.log("initial version of topic created");
                    async.eachSeries(topic.learningPoints, function(learningPoint, cb) {
                        LearningPoints.create(learningPoint, function(err, newLearningPoint) {
                            newTopic.learningPoints.push(newLearningPoint._id);
                            console.log("learning Point Created");
                            cb();
                        });
                    }, function (err) {
                        if (err) {
                            next(err);
                        }
                        newTopic.save(function(err, newTopic){
                            console.log(newTopic);
                            
                        });
                        outcb();
                    });  
                });
            }, function(err){
                if (err) {
                    next(err);
                }
                module.save(function(err, module){
                    if (err){
                        console.log(err);
                        next(err);
                    }
                    else {
                        console.log("module created");
                        res.json(module);
                    }
                });
            });     
        }
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    Modules.remove({}, function(err, resp){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(resp);
    });
});

moduleRouter.route('/:id')
.get(Verify.verifyLearner, function(req, res, next){
    Modules.findById(req.params.id).deepPopulate('topics.learningPoints').exec(function(err, module){
        if (err) {
            next(err);
        } else {
            res.json(module);
        }
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
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
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
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
    Modules.findById(req.params.id, function(err, module){
       if (err) {
           console.log(err);
           next(err);
       } 
        res.json(module.topics);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        module.topics.push(req.body);
        module.save(function(err, umodule){
            if (err) {
                console.log(err);
                next(err);
            } 
            console.log('Topic added');
            res.json(umodule);
        });
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        for (var i = (module.topics.length - 1); i >= 0; i--){
            module.topics.id(module.topics[i]._id).remove();
        }
        module.save(function(err, module){
            if (err) {
                console.log(err);
                next(err);
            } 
            res.writeHead(200, {
                'Content-Type':'text/plain'
            });
            res.end('Deleted all the topics!');
        });
    });
});

moduleRouter.route('/:id/topics/:tid')
.get(Verify.verifyLearner, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
        }
        res.json(module.topics.id(req.params.tid));
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        var i = module.topics.indexOf(module.topics.id(req.params.tid));
        
        module.topics.id(req.params.tid).remove();
        module.topics.splice(i, 0, req.body);
        module.save(function(err, module){
            if (err) {
                console.log(err);
                next(err);
            } 
            console.log('Topics updated')
            res.json(module.topics[i]);
        });
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        module.topics.id(req.params.tid).remove();
        module.save(function(err, module){
            if (err) {
                console.log(err);
                next(err);
            } 
            res.json(module);
        });
    });
});

moduleRouter.route('/:id/topics/:tid/learningPoints')
.get(Verify.verifyLearner, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
       if (err) {
           console.log(err);
           next(err);
       }
       res.json(module.topics.id(req.params.tid).learningPoints);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        module.topics.id(req.params.tid).learningPoints.push(req.body);
        module.save(function(err, umodule){
            if (err) {
                console.log(err);
                next(err);
            } 
            console.log('Learning Point added');
            res.json(umodule);
        });
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        for (var i = (module.topics.id(req.params.tid).learningPoints.length - 1); i >= 0; i--){
            module.topics.id(req.params.tid).learningPoints.id(module.topics.id(req.params.tid).learningPoints[i]._id).remove();
        }
        module.save(function(err, module){
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

moduleRouter.route('/:id/topics/:tid/learningPoints/:lid')
.get(Verify.verifyLearner, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
        } 
        res.json(module.topics.id(req.params.tid).learningPoints.id(req.params.lid));
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
       
       var i = module.topics.id(req.params.tid).learningPoints.indexOf(module.topics.id(req.params.tid).learningPoints.id(req.params.lid));
        
        module.topics.id(req.params.tid).learningPoints.id(req.params.lid).remove();
        module.topics.id(req.params.tid).learningPoints.splice(i, 0, req.body);
        module.save(function(err, module){
            if (err) {
                console.log(err);
                next(err);
            } 
            console.log('Learning Point updated')
            res.json(module.topics.id(req.params.tid).learningPoints[i]);
        });
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        module.topics.id(req.params.tid).learningPoints.id(req.params.lid).remove();
        module.save(function(err, module){
            if (err) {
                console.log(err);
                next(err);
            } 
            res.json(module);
        });
    });
});

module.exports = moduleRouter;
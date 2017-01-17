var express = require('express');
var moduleRouter = express.Router();

var Modules = require('../models/modules');

moduleRouter.route('/')
.get(function(req, res, next){
    Modules.find(req.query, function(err, modules) {
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(modules);
    });
})
.post(function(req, res, next){
    Modules.create(req.body, function(err, module){
        if (err) {
            console.log(err);
            next(err);
        }
        else {
            console.log("module created");
            res.json(module);
        }
    });
})
.delete(function(req, res, next) {
    Modules.remove({}, function(err, resp){
        if (err) {
            console.log(err);
            next(err);
        }
        res.json(resp);
    });
});

moduleRouter.route('/:id')
.get(function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(module);
    });
})
.put(function(req, res, next) {
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
.delete(function(req, res, next){
    Modules.findByIdAndRemove(req.params.id, function(err, resp){
        if (err) {
           console.log(err);
           next(err);
       } 
        res.json(resp);
    });
});

moduleRouter.route('/:id/topics')
.get(function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
       if (err) {
           console.log(err);
           next(err);
       } 
        res.json(module.topics);
    });
})
.post(function(req, res, next){
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
.delete(function(req, res, next){
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
.get(function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
        }
        res.json(module.topics.id(req.params.tid));
    });
})
.put(function(req, res, next){
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
.delete(function(req, res, next){
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
.get(function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
       if (err) {
           console.log(err);
           next(err);
       }
       res.json(module.topics.id(req.params.tid).learningPoints);
    });
})
.post(function(req, res, next){
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
.delete(function(req, res, next){
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
.get(function(req, res, next){
    Modules.findById(req.params.id, function(err, module){
        if (err) {
           console.log(err);
           next(err);
        } 
        res.json(module.topics.id(req.params.tid).learningPoints.id(req.params.lid));
    });
})
.put(function(req, res, next){
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
            res.json(module);
        });
    });
})
.delete(function(req, res, next){
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
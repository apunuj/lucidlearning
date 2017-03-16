var express = require('express');
var collectionRouter = express.Router();

var Modules = require('../models/modules');
var Collections = require('../models/collections');
var Verify = require('./verify');

collectionRouter.route('/')
.get(Verify.verifyLearner, function (req, res, next){
    Collections.find(req.query, function(err, collections) {
        if (err) {
            next(err);
        }
        res.json(collections);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
   Collections.create(req.body, function(err, newCollection) {
       if (err) {
           next(err);
       }
       res.json(newCollection);
   });
})

collectionRouter.route('/:id')
.get(Verify.verifyLearner, function(req, res, next) {
    Collections.findById(req.params.id, function (err, collection) {
        if (err) {
            next(err);
        }
        res.json(collection);
    });
})

//only for updating name and createdBy fields
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    Collections.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true}, function(err, ucollection) {
        if (err) {
            next(err);
        }
        res.json(ucollection);
    });
})

.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    Collections.findByIdAndRemove(req.params.id, function(err, response) {
        if (err) {
            next(err);
        }

        res.json(response);
    });
});
//this route is not concerned with creation/deletion of a module, just adding/removing etc it from the collection
collectionRouter.route('/:id/modules')
.post(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    Collections.findById(req.params.id, function(err, collection) {
        collection.modules.push(req.body);
        collections.save(function(err, ucollection) {
            if (err) {
                next(err);
            }
            res.json(ucollection);
        });
    });
});

collectionRouter.route('/:id/modules/:mid')
.put(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    Collections.findById(req.params.id, function(err, collection) {
        for (var index = 0; index < collection.modules.length; index++) {
            if (req.params.mid === collection.modules[index]._id) {
                collections.modules[index] = req.body;
            }
        }

        collection.save(function(err, ucollection) {
            if (err) {
                next(err);
            }
            res.json(ucollection);
        });
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next) {
    Collections.findById(req.params.id, function(err, collection) {
        for (var index = 0; index < collection.modules.length; index++) {
            if (req.params.mid === collection.modules[index]._id) {
                collection.modules.splice(index, 1);
            }
        }

        collection.save(function(err, ucollection) {
            if (err) {
                next (err);
            }

            res.json(ucollection);
        });
    });
});

module.exports = collectionRouter;
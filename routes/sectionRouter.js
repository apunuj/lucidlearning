var express = require('express');
var sectionRouter = express.Router();

var async = require('async');

var Modules = require('../models/modules');
var Sections = require('../models/sections')

var Verify = require('./verify');

sectionRouter.route('/')
.get(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    Sections.find(req.query).populate({
        path: 'modules',
        select: 'name'
    }).exec(function(err, sections){
        if (err){
            next(err);
        }
        res.json(sections);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    Sections.create(req.body, function (err, section){
        if (err){
            next (err);
        }
        res.json(section);
    });
});

sectionRouter.route('/:id')
.get(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    Sections.findById(req.params.id).populate({
        path: 'modules',
        select: 'name'
    }).exec(function(err, section){
        if (err){
            next(err);
        }
        res.json(section);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    Sections.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, section){
        if (err) {
            next (err);
        }
        res.json(section);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    Sections.findByIdAndRemove(req.params.id, function (err, resp){
        if (err){
            next (err);
        }
        res.json(resp);
    });
});

sectionRouter.route('/:id/modules')
.get(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    Sections.findById(req.params.id).populate({
        path: 'modules'
    }).exec(function(err, section){
        if (err){
            next(err);
        }
        res.json(section.modules);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    Sections.findById(req.params.id, function(err, section){
        if (err) {
            next (err);
        }
        section.modules.push(req.body);
        section.save(function(err, savedSection){
            if (err) {
             next (err);
            }
            res.json(savedSection);
        });
    });
});

sectionRouter.route('/:id/modules/:mid')
.delete(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    Sections.findById(req.params.id, function(err, section){
        section.modules.splice(section.modules.indexOf(req.params.mid),1);
        section.save(function(err, savedSection){
            res.json(savedSection);
        });
    });
});

module.exports = sectionRouter;
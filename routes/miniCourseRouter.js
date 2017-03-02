var express = require('express');
var miniCourseRouter = express.Router();

var async = require('async');

var Modules = require('../models/modules');
var MiniCourses = require('../models/miniCourses')


var Verify = require('./verify');

miniCourseRouter.route('/')
.get(Verify.verifyLearner, function (req, res, next){
    console.log(req.query.modules);
    MiniCourses.find(req.query).populate({
        path: 'modules',
        select: 'name'
    }).exec(function(err, miniCourses){
        if (err){
            next(err);
        }
        res.json(miniCourses);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    MiniCourses.create(req.body, function (err, miniCourse){
        if (err){
            next (err);
        }
        res.json(miniCourse);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    MiniCourses.remove(req.query, function(err, resp){
        if (err){
            next(err);
        }
        res.json(resp);
    });
});

miniCourseRouter.route('/:id')
.get(Verify.verifyLearner, function (req, res, next){
    MiniCourses.findById(req.params.id).populate({
        path: 'modules',
        select: 'name'
    }).exec(function(err, miniCourse){
        if (err){
            next(err);
        }
        res.json(miniCourse);
    });
})
.put(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    MiniCourses.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, miniCourse){
        if (err) {
            next (err);
        }
        res.json(miniCourse);
    });
})
.delete(Verify.verifyLearner, Verify.verifyTeacher, function(req, res, next){
    MiniCourses.findByIdAndRemove(req.params.id, function (err, resp){
        if (err){
            next (err);
        }
        res.json(resp);
    });
});

miniCourseRouter.route('/:id/modules')
.get(Verify.verifyLearner, function (req, res, next){
    MiniCourses.findById(req.params.id).populate({
        path: 'modules'
    }).exec(function(err, miniCourse){
        if (err){
            next(err);
        }
        res.json(miniCourse.modules);
    });
})
.post(Verify.verifyLearner, Verify.verifyTeacher, function (req, res, next){
    MiniCourses.findById(req.params.id, function(err, miniCourse){
        if (err) {
            next (err);
        }
        miniCourse.modules.push(req.body);
        miniCourse.save(function(err, savedMiniCourse){
            if (err) {
             next (err);
            }
            res.json(savedMiniCourse);
        });
    });
});

miniCourseRouter.route('/:id/modules/:mid')
.delete(Verify.verifyLearner, function (req, res, next){
    MiniCourses.findById(req.params.id, function(err, miniCourse){
        miniCourse.modules.splice(miniCourse.modules.indexOf(req.params.mid),1);
        miniCourse.save(function(err, savedMiniCourse){
            res.json(savedMiniCourse);
        });
    });
});

module.exports = miniCourseRouter;
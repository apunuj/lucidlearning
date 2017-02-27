var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var miniCourseSchema = new Schema({
    name: {
        type: String
    },
    tags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    requirements: {
        type: String
    },
    learningDeliverables: {
        type: String
    },
    targetAudience: {
        type: String
    },
    learningApproach: {
        type: String
    },
    sections: [{
        type: Schema.Types.ObjectId,
        ref: 'Section'
    }]
}, {timestamps: true});

var MiniCourses = mongoose.model('MiniCourse', miniCourseSchema);

module.exports = MiniCourses;
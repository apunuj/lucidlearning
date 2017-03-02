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
    }
}, {timestamps: true});

var MiniCourses = mongoose.model('MiniCourse', miniCourseSchema);

module.exports = MiniCourses;
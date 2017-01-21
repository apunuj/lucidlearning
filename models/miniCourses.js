var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var miniCourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }]
}, {timestamps: true});

var MiniCourses = mongoose.model('MiniCourse', miniCourseSchema);

module.exports = MiniCourses;
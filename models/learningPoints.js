var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = require('./tags');

var learningPointSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: Tag
    }],
    content: {
        type: String
    }
}, {timestamps: true});

var LearningPoints = mongoose.model('LearningPoint', learningPointSchema);

module.exports = LearningPoints;
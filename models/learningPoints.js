var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var learningPointSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    content: {
        type: String
    },
    createdBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

var LearningPoints = mongoose.model('LearningPoint', learningPointSchema);

module.exports = LearningPoints;
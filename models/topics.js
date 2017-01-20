var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = require('./tags');
var LearningPoint = require('./learningPoints');

var topicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: Tag
    }],
    learningPoints: [{
        type: Schema.Types.ObjectId,
        ref: 'LearningPoint'
    }]
}, {timestamps: true});

var Topics = mongoose.model('Topic', topicSchema);

module.exports = Topics;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema({
    name: {
        type: String
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    learningPoints: [{
        type: Schema.Types.ObjectId,
        ref: 'LearningPoint'
    }],
    createdBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {timestamps: true});

var Topics = mongoose.model('Topic', topicSchema);

module.exports = Topics;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var learningPointSchema = new Schema({
    name: {type: String},
    content: {type: String}
});

var topicSchema = new Schema({
    name: {type: String},
    learningPoints: [learningPointSchema]
});

var Topics = mongoose.model('Topic', topicSchema);

module.exports = Topics;
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

var moduleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    topics: [topicSchema]
}, {timestamps: true});

var Modules = mongoose.model('Module', moduleSchema);

module.exports = Modules;
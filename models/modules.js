var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = require('./tags');
var Topic = require('./topics');

var moduleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: Tag
    }],
    topics: [{
        type: Schema.Types.ObjectId,
        ref: Topic
    }]
}, {timestamps: true});

var Modules = mongoose.model('Module', moduleSchema);

module.exports = Modules;
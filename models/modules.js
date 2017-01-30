var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moduleSchema = new Schema({
    name: {
        type: String
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    topics: [{
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    createdBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

var Modules = mongoose.model('Module', moduleSchema);


module.exports = Modules;
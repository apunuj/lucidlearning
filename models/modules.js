var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var moduleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    topics: [{
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    }]
}, {timestamps: true});

moduleSchema.plugin(deepPopulate);
var Modules = mongoose.model('Module', moduleSchema);


module.exports = Modules;
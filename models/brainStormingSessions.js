var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var brainStormingSessionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tag: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
    brainStormingPoints: [{type: String}]
}, {timestamps: true});

var BrainStormingSessions = mongoose.model('BrainStormingSession', brainStormingSessionSchema);
module.exports = BrainStormingSessions;
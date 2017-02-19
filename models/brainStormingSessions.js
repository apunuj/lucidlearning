var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var brainStormingSessionSchema = new Schema({
    moduleId: {type: Schema.Types.ObjectId},
    points: [{name: String, completed: {type: Boolean, default: false}}]
}, {timestamps: true});

var BrainStormingSessions = mongoose.model('BrainStormingSession', brainStormingSessionSchema);
module.exports = BrainStormingSessions;
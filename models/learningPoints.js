var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var learningPointSchema = new Schema({
    name: {type: String},
    content: {type: String}
});

var LearningPoints = mongoose.model('LearningPoint', learningPointSchema);

module.exports = LearningPoints;
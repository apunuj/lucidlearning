var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectionSchema = new Schema({
    name: {
        type: String
    },
    createdBy: {
       name: String,
       id: Schema.Types.ObjectId
    },
    modules: [{
        name: String,
        id: Schema.Types.ObjectId
    }]
}, {timestamps: true});

var Collections = mongoose.model('Collection', CollectionSchema);

module.exports = Collections;
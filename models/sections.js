var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sectionSchema = new Schema({
    name: {
        type: String
    },
    tags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    }
}, {timestamps: true});

var Sections = mongoose.model('Section', sectionSchema);

module.exports = Sections;
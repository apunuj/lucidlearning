var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moduleCtrlPanelSchema = new Schema({
    module: {
        type:Schema.Types.ObjectId,
        ref: 'Module'
    },
    completed: {
        type: Boolean,
        default: false
    },
    reviewed: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

 var ModuleCtrlPanels = mongoose.model('ModuleCtrlPanel', moduleCtrlPanelSchema);

 module.exports = ModuleCtrlPanels;
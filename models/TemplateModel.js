var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const TemplateSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    htmlFile: {
        type: String,
        default: '',
        required: true
    },
    cssFile: {
        type: String,
        default: ''
    },
    jsFile: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

module.exports = {Template: mongoose.model('template', TemplateSchema)};

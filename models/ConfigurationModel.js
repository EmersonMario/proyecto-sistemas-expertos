var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ConfigurationSchema = new Schema({
    fileFavicon: {
        type: String,
        default: ''
    },
    fileLogo: {
        type: String,
        default: ''
    },
    pageTitle: {
        type: String,
        default: "CMS - Administrador de TYLOX"
    },
    pageDescription: {
        type: String,
        default: ''
    },
    pageKeyWords: {
        type: String,
        default: ''
    }
});

module.exports = {Configuration: mongoose.model('configuration', ConfigurationSchema)};

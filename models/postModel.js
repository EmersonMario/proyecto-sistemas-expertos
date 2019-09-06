var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
});

module.exports = {Post: mongoose.model('post', PostSchema)};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true
    }
});

module.exports = {Category: mongoose.model('category', CategorySchema)};

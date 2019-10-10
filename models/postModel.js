var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    file: {
        type: String,
        default: ''
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    allowComments: {
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = {Post: mongoose.model('post', PostSchema)};

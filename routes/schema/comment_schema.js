// Use mongoose Schema class to declare what is in the documnent
const Schema = require('mongoose').Schema;

// Declare a Schema for comments
exports.CommentSchema = new Schema({
    text: String,
    author: String,
    time: String,
    postId: String
}, {collection: 'comments'});
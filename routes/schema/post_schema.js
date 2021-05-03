// Use mongoose Schema class to declare what is in the documnent
const Schema = require('mongoose').Schema;

exports.PostSchema = new Schema({
    title: String,
    url: String,
    text: String,
    author: String,
    postTime: String,
}, { collection : 'posts' });

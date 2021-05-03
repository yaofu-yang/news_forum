// Use mongoose Schema class to declare what is in the documnent
const Schema = require('mongoose').Schema;

exports.UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: String,
}, { collection : 'users' });
const mongoose = require('mongoose');
const UserSchema = require('../schema/user_schema').UserSchema;

// Mapping PostSchema to PostModel
const UserModel = mongoose.model("User", UserSchema);


// Get all users
function getAllUsers() {
    return UserModel.find().exec();
}

// Finds a particular user by username
function getUserByUsername(username) {
    return UserModel.find({username: username}).exec();
}

// Finds a particular user by id
function getUserById(id) {
    return UserModel.find({_id: id}).exec();
}

// Add a user to the database. 
function insertUser(user) {
    return UserModel.create(user);
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    insertUser,
};
const mongoose = require('mongoose');
const PostSchema = require('../schema/post_schema').PostSchema;

// Mapping PostSchema to PostModel
const PostModel = mongoose.model("Post", PostSchema);

// Will need to sort by from newest to oldest, so reverse order by time
function getAllPosts() {
    return PostModel.find().exec();
}

// Finds a particular post with a postId of passed parameter, id
function getPostById(id) {
    return PostModel.find({_id: id}).exec();
}

// Add a post to the schema. 
function insertPost(post) {
    return PostModel.create(post);
}

// Updates the post indicated by id
function updatePost(id, newPost) {
    PostModel.findOneAndRemove({_id : id}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });
    return PostModel.create(newPost);
}

// Deletes a post based on the postId.
function deletePost(id) {
    return PostModel.findOneAndRemove({_id : id}, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed post: ", docs);
        }
    });
}

module.exports = {
    getAllPosts,
    getPostById,
    insertPost,
    updatePost,
    deletePost,
};


const mongoose = require('mongoose');
const CommentSchema = require('../schema/comment_schema').CommentSchema;

// Mapping CommentSchema to CommentModel
const CommentModel = mongoose.model("Comment", CommentSchema);

// Retrieve all comments associated with the postId
function getCommentsByPost(postId) {
    return CommentModel.find({postId: postId}).exec();
}

// Finds a particular post with a postId of passed parameter, id
function getCommentById(id) {
    return CommentModel.find({_id: id}).exec();
}

// Insert a new comment based on full request body
function insertComment(comment) {
    return CommentModel.create(comment);
}

// Updates the comment indicated by id
function updateComment(id, newComment) {
    CommentModel.findOneAndRemove({_id : id}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });
    return CommentModel.create(newComment);
}

// Remove a comment by its commentId
function deleteComment(id) {
    return CommentModel.findOneAndRemove({_id : id}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });
}

// Delete all comments associated with a postId
function deleteCommentsByPost(postId) {
    return CommentModel.deleteMany({postId: postId})
        .then(function() {console.log("All comments deleted");})
        .catch(function(error){console.log(error);});
}

module.exports = {
    getCommentsByPost,
    getCommentById,
    insertComment,
    updateComment,
    deleteComment,
    deleteCommentsByPost,
};


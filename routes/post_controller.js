const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();

// bcrypt for encryption
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie_middleware = require('./cookie_middleware');

// Todo: Will need to move model to its appropriate package
const PostModel = require('./model/post_model');
const CommentModel = require('./model/comment_model');
const UserModel = require('./model/user_model');


function getTime() {
    let timeStamp= Date.now();
    let currentDate = new Date(timeStamp);
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let hoursString = hours <= 9 ? "0" + hours : hours;
    let minuteString = minutes <= 9 ? "0" + minutes : minutes;

    return month + "/" + date + "/" + year + " " + hoursString + ":" + minuteString;
};

/**
 * Controller logic for posts and comments
 */

// Retrieves full list of posts
router.get('/posts', (req, res) => {
    return PostModel.getAllPosts()
        .then((response) => res.status(200).send(response),
            (error) => res.status(404).send('Error getting all:' + error));
});

// Retrieves a single post by Id
router.get('/posts/:postId', (req, res) => {
    console.log(req.params.postId)
    return PostModel.getPostById(req.params.postId)
        .then((response) => res.status(200).send(response),
        (error) => res.status(404).send('Error Finding post:' + error));
});

// Retrieves all of the comments associated with a post.
router.get('/comments/:postId', (req, res) => {
    return CommentModel.getCommentsByPost(req.params.postId)
        .then((response) => res.status(200).send(response),
            (error) => res.status(404).send('Error finding comments:' + error));
})

// Retrieve a comment by Id
router.get('/comment/:commentId', (req, res) => {
    return CommentModel.getCommentById(req.params.commentId)
        .then((response) => res.status(200).send(response),
            (error) => res.status(404).send('Error Finding comment:' + error));
});

// Creates a new post with attributes in request body
// Req body needs to specify title, url|text, author, time, postId
router.post('/post', cookie_middleware, (req, res) => {
    const newPost = req.body;
    newPost.author = req.username;
    newPost.postTime = getTime();
    console.log(newPost)
    return PostModel.insertPost(newPost)
        .then((response) => res.status(200).send(response),
            (error) => res.status(401).send({message: "Can't create a new post"}));
});

// Creates a new comment for a particular post
// Req body needs to specify text, author, time, postId, commentId
router.post('/comment', cookie_middleware, (req, res) => {
    const newComment = req.body;
    newComment.time = getTime();
    newComment.author = req.username;
    return CommentModel.insertComment(req.body)
    .then((response) => res.status(200).send(response),
        (error) => res.status(404).send('Error updating comment:' + error));
});

// Updating contents of a post; requires full request body
router.put('/post/:postId', (req, res) => {
    return PostModel.updatePost(req.params.postId, req.body)
        .then((response) => res.status(200).send(response))
        .catch(function (error) {
            return res.status(401).send({message: "The username already exits"});
        })
            // (error) => res.status(404).send('Error updating post:' + error));
});

// Updating contents of a comment; requires full request body.
router.put('/comment/:commentId', (req, res) => {
    console.log("updating comment server")
    return CommentModel.updateComment(req.params.commentId, req.body)
        .then((response) => res.status(200).send(response),
            (error) => res.status(404).send('Error updating comment:' + error));
});

// Deleting a post by id. Needs to delete all associated comments as well.
router.delete('/post/:postId', (req, res) => {
    CommentModel.deleteCommentsByPost(req.params.postId);
    console.log("Post ID:" + req.params.postId);
    console.log(req.body);


    return PostModel.deletePost(req.params.postId, req.body)
        .then((response) => res.status(200).send(response),
            (error) => res.status(404).send('Error deleting post:' + error));
});

// Deleting a comment by id
router.delete('/comment/:commentId', cookie_middleware, (req, res) => {
    return CommentModel.deleteComment(req.params.commentId)
    .then((response) => res.status(200).send(response),
        (error) => res.status(404).send('Error deleting comment:' + error));
});


/**
 * Controller logic for users
 */

// Retrieves all users
router.get('/users', (req, res) => {
    return UserModel.getAllUsers()
        .then((response) => res.status(200).send(response),
            (error) => res.status(404).send('Error getting users:' + error));
});


// Creates a new user with encrypted password
router.post('/user/register', (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(404).send({message: "Must include username AND password"});
    }

    // Replaces req body password with encrypted password.
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    return UserModel.insertUser(req.body)
        .then((response) => {
            const token = jwt.sign(response.username, 'salty_salt')
            res.cookie('webdevtoken', token).status(200).send(response);
        }).catch(function (error) {
            return res.status(401).send({message: "The username already exits"});
        })

});

// Checks if the username and password match a user. If so, log them in
// And tracks login status with a cookie.
router.post('/user/login', function (req, res) {
    if(!req.body.username || !req.body.password) {
        return res.status(404).send({message: "Must include username AND password"});
    }

    return UserModel.getUserByUsername(req.body.username)
        .then((user) => {
            if(user.length < 1) {
                console.error("No such user exits")
                return res.status(401).send({message: "No such user exits"})
            }
            if (bcrypt.compareSync(req.body.password, user[0].password)) {
                const token = jwt.sign(user[0].username, 'salty_salt')
                return res.cookie('webdevtoken', token).status(200).send(user);

            } else {
                return res.status(402).send({message: "Password does not match."});
            }
        }),(error) => res.status(404).send('Error: ' + error);
});


// Assesses whether a user is currently logged in.
// Including cookie_middleware inside the request: Runs that logic first
// Do not need to put path params or request body, since pull from cookie.
router.post('/user/loggedIn', cookie_middleware, (req, res) => {
    if (req.username) {
        const username = req.username;
        console.log("Logged in as: " + req.username)
        res.status(200).send({username: username});
    } else {
        res.status(404).send({message: "You are not logged in"});
    }
})

// Clears the cookie which effectively logs user out.
router.post('/user/logout', (req, res) => {
    res.clearCookie('webdevtoken');
    res.sendStatus(200);
})


module.exports = router;
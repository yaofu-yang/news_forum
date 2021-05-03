import React from 'react';
import './index.css';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import NavigationBar from './NavigationBar';
import {Form, ButtonGroup, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';


class PostDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            post: [],
            comments: [],
            comment: "",
            redirect: false,
            redirecturl: "",
            postAuthor: "",
            loggedIn: false,
            username: "",
            error: ""
        }
    }

    componentDidMount(){
        this.props.checkCookie();
        const postId = this.props.match.params.postID;

        // Retrieving Specific Post
        Axios.get('/api/posts/posts/' + postId)
            .then((response) => {
                //If the user type in a post url that got deleted, redirect back to home
                if(response.data.length === 0) {
                    this.setState({
                        redirect: true,
                        redirectUrl: "/",
                    }) 
                } else {
                    this.setState({
                        post: response.data,
                        postAuthor: response.data.author
                    })
                }
                
            })
            .catch(error => console.error(error));
        
        this.retrieveComment();    
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component from redirect back to home above
        this.setState = (state,callback)=>{
            return;
        };
    }

    // Author is checked prior to calling method.
    deletePost(postId) {
        console.log("Attempting to delete post: " + postId);
        Axios.delete('../api/posts/post/' + postId)
            .then((response) => {
                this.setState ({
                    redirect: true,
                    redirectUrl: "/",
                });
                
                console.log("Deleted: " + response);
            })
            .catch(error => "Could not delete post: " + error);
    }

    // Author is checked prior to calling method.
    editPost(postId) {
        console.log("PostID: " + postId);
        this.setState ({
            redirect: true,
            redirecturl: "/editPost/" + postId,
        });
    }

    retrieveComment() {
        let sortedComments = [];
        //Retrieve comments of this post
        const postId = this.props.match.params.postID;
        Axios.get('/api/posts/comments/' + postId)
        .then((response) => {
            sortedComments = response.data;
            sortedComments.sort((comment1, comment2) => (comment1.time > comment2.time) ? 1 : -1);
            this.setState({
                comments: sortedComments,
            })
        })
        .catch(error => console.error(error));    
    }

    async submitComment() {
        // Username/author is already handled by cookie middleware
        const postId = this.props.match.params.postID;
        const newComment = {
            text: this.state.comment,
            postId: postId,
        }
        await Axios.post('/api/posts/comment', newComment)
            .then(response => {
                this.setState({
                    comment: "",
                });
            })
            .catch(error => {this.setState({error: error.response.data.message})});
        this.retrieveComment();
    }

    async deleteComment(commentId) {
        console.log("trying to delete comment")
        await Axios.delete('/api/posts/comment/' + commentId)
        .then((response) => {
            console.log(response);
        })
        .catch(error => console.log("Could not delete comment" + error));
        this.retrieveComment();
    }

    editComment(commentId) {
        this.setState({
            redirect: true,
            redirecturl: "/editComment/" + commentId,
        });
    }

    render () {
        // Redirect to edit post or edit comment.
        const redirect = this.state.redirect;
        const redirecturl = this.state.redirecturl;
        if (redirect) {
            return <Redirect to={redirecturl}/>
        }

        if (this.state.post.length !== 1) {
            return (<div></div>)
        }

        // Prepare posts for rendering.
        const displayPost = this.state.post[0];
        const renderedPost = [];
        if (this.props.username === displayPost.author) {
            renderedPost.push(
                <div className="postDetail" key={"post"}>
                    <div className="header"> <h2> {displayPost.title} </h2> </div>
                    <div className="authorDetail">
                        <div>Author: {displayPost.author}</div>
                        <div> {displayPost.postTime}</div>
                    </div>
                    <div className="postBody"> 
                        <p>{displayPost.text}</p>
                    </div>
                    <div className="btnGroup">
                        <ButtonGroup aria-label="Basic example">
                            <Button variant="outline-info" onClick={() => this.editPost(displayPost._id)}>Edit Post</Button>
                            <Button variant="outline-info" onClick={() => this.deletePost(displayPost._id)}>Delete Post</Button>
                        </ButtonGroup>
                    </div>
                </div>
            )
        } else {
            renderedPost.push(
                <div className="postDetail" key={"post"}>
                    <div className="header"> <h2> {displayPost.title} </h2> </div>
                    <div className="authorDetail">
                        <div>Author: {displayPost.author}</div>
                        <div> {displayPost.postTime}</div>
                    </div>
                    <div className="postBody"> <p>{displayPost.text}</p></div>
                </div>
            )
        }

        // Prepare comments for rendering.
        const renderedComments = [];
        let timeCorner;

        for (let i = 0; i < this.state.comments.length; i++) {
            const comment = this.state.comments[i];
            timeCorner = 
                <div className="rightCorner">
                    <div className="postDetailCornerTime">{comment.time}</div>
                </div>
            if (this.props.username === comment.author) {
                renderedComments.push(
                    <div className="comment" key={i}>
                        <div className="commentAuthor">{comment.author} said:</div>
                        <div className="commentBody">{comment.text}</div>
                        {timeCorner}
                        <ButtonGroup aria-label="Basic example">
                            <Button size="sm" variant="outline-secondary" onClick={() => this.editComment(comment._id)}> Edit Comment</Button>
                            <Button size="sm" variant="outline-secondary" onClick={() => this.deleteComment(comment._id)}> Delete Comment</Button>
                        </ButtonGroup>
                    </div>
                )
            } else {
                renderedComments.push(
                    <div className="comment" key={i}>
                        <div className="commentAuthor">{comment.author} said:</div>
                        <div className="commentBody">{comment.text}</div>
                        {timeCorner}
                    </div>
                )
            }
        }
        if (this.props.username) {
            return (
            
                <div>
                    <NavigationBar loggedIn={this.props.loggedIn} username={this.props.username} logOut={this.props.logOut}/>
                    <div>{renderedPost}</div>
                    <div className="commentHeader" id="commentSection"> <h4> Comment Section </h4></div>
                    <div>{renderedComments}</div>
                    <Form>
                        <Form.Group controlid="formComment">
                            <Form.Label> Leave your opinions here </Form.Label>
                            <Form.Control as="textarea" rows={5} value={this.state.comment} onChange={e => this.setState({comment: e.target.value})}/>
                        </Form.Group>
                        {this.state.error? <div style={{color: "red"}}>{this.state.error}</div>: null}
                        <Button id="sumitComment" variant="info" onClick={() => this.submitComment()}> Submit Comment</Button>
                    </Form>                
                </div>
            )
        } else {
            return (
                <div>
                    <NavigationBar loggedIn={this.props.loggedIn} username={this.props.username} logOut={this.props.logOut}/>
                    <div>{renderedPost}</div>
                    <div className="header" id="commentSection"> <h4> Comment Section </h4></div>
                    <div>{renderedComments}</div>
                    <Form>
                        <Form.Group controlid="formComment">
                            <Form.Label> Leave your opinions here </Form.Label>
                            <Form.Control disabled as="textarea" rows={5} value={this.state.comment} onChange={e => this.setState({comment: e.target.value})}/>
                        </Form.Group>
                        <div style={{color: "red"}}>Log in or Sign up to make a comment</div>
                    </Form>                
                </div>
            )
        }
        
    }
}

export default withRouter(PostDetail);

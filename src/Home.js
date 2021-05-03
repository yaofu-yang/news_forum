import React from 'react';
import './index.css';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import NavigationBar from './NavigationBar';

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            posts: [],
            redirect: false,
            redirectUrl: "",
        }
    }

    componentDidMount() {
        this.props.checkCookie();
        this.getSortedPosts();
    }

    async getSortedPosts() {
        let sortedPosts = [];
        await Axios.get('/api/posts/posts')
        .then((response) => {
            sortedPosts = response.data;
            sortedPosts.sort((post1, post2) => (post1.postTime < post2.postTime) ? 1: -1);
            this.setState({
                posts: sortedPosts,
            })
        })
        .catch(error => console.error(error));
    }

    // Author is checked prior to calling method.
    onClickDelete(postId) {
        Axios.delete('api/posts/post/' + postId)
            .then((response) => {
                console.log("Deleted: " + response);
            })
            .catch(error => "Could not delete post: " + error);
        this.getSortedPosts();
    }

    // Author is checked prior to calling method.
    onClickEdit(postId) {
        this.setState ({
            redirect: true,
            redirectUrl: "/editPost/" + postId,
        });
    }

    viewComments(postId) {
        this.setState( {
            redirect: true,
            redirectUrl: "/dp/" + postId
        })
    }

    render () {
        const redirect = this.state.redirect;
        const url = this.state.redirectUrl;
        if (redirect) {
            return <Redirect to={url}/>;
        }

        const renderedPosts = [];
        for(let i = 0; i < this.state.posts.length; i++){
            const post = this.state.posts[i];
            const link = '/dp/' + post._id;
            const postDetailLink = 
                <h3 ><a className="postTitle" href={link}> {post.title} </a></h3>

            const postUrlLink = 
                <h3><a className="postTitle" href={post.url}> {post.title} - {post.url}</a></h3>

            const authorEditButtons = 
                <p className="linkButton" onClick={() => this.onClickEdit(post._id)}>Edit Post</p>

            const authorDeleteButtons=
                <p className="linkButton" onClick={() => this.onClickDelete(post._id)}>Delete Post</p>
            
            const viewComments =
                <p className="linkButton" onClick={() => this.viewComments(post._id)}>View Comments</p>
            
            const authorDate = 
                <div className="rightCorner">
                    <div className="postCornerName">{post.author}</div>
                    <div className="postCornerTime">{post.postTime}</div>
                </div>

            if (this.props.username === post.author) {
                if (post.url) {  // Redirect to url
                    renderedPosts.push(
                        <div className="post" key={i}>
                            {postUrlLink}
                            {viewComments}
                            {authorEditButtons}
                            {authorDeleteButtons}
                            {authorDate}
                        </div>
                    )
                } else {  // Only text body, redirect to detailed post
                    renderedPosts.push(
                        <div className="post" key={i}>
                            {postDetailLink}
                            {viewComments}
                            {authorEditButtons}
                            {authorDeleteButtons}
                            {authorDate}
                        </div>
                    )
                }
            } else {
                if (post.url) {  // Has url, redirect to url
                    renderedPosts.push(
                        <div className="post" key={i}>
                            {postUrlLink}
                            {viewComments}
                            {authorDate}
                        </div>
                    )
                } else {  // Has text body, redirect to detailed post
                    renderedPosts.push(
                        <div className="post" key={i}>
                            {postDetailLink}
                            {viewComments}
                            {authorDate}
                        </div>
                    )
                }
            }
        }


        return (
            <div>
                <NavigationBar loggedIn={this.props.loggedIn} username={this.props.username} logOut={this.props.logOut}/>
                <div className="header">
                    <h1> Welcome to Salty News </h1>
                </div>
                <div>
                    {renderedPosts}
                </div>
            </div>
        )
        
    }
}
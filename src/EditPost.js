import React from 'react';
import './index.css';
import Axios from 'axios';
import {Redirect} from "react-router-dom";
import NavigationBar from './NavigationBar';
import {Form, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

const initialState = {
    title: "",
    url: "",
    text: "",
    author: "",
    _id: "",
    postTime: "",
    titleError: "",
    bodyError: "",
}

class EditPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const postId = this.props.match.params.postID;

        // Retrieving Specific Post
        Axios.get('/api/posts/posts/' + postId)
            .then((response) => {
                const post = response.data[0];
                this.setState({
                    author: post.author,
                    postTime: post.postTime,
                    _id: postId,
                    title: post.title,
                    text: post.text,
                    url: post.url,
                })
            })
            .catch(error => console.error(error));
    }

    validate = () => {
        let titleError = "";
        let bodyError = "";
        if (!this.state.title) {
            titleError = "Title is required";
        }
        if (this.state.url && this.state.text) {
            bodyError = "Please fill in only the url OR the post body, not both"
        }
        if (titleError || bodyError) {
            this.setState({titleError, bodyError});
            return false;
        }
        return true;
    }

    onClick() {
        const isValid = this.validate();
        if (isValid) {
            this.setState(initialState);
            const newPost = {
                title: this.state.title,
                url: this.state.url,
                text: this.state.text,
                author: this.state.author,
                _id: this.state._id,
                postTime: this.state.postTime,
            }

            Axios.put('/api/posts/post/' + this.state._id, newPost)
                .then(response => {
                    console.log(response)
                    this.setState ({
                        redirect: true,
                        _Id: response.data._id
                    });
                })
                .catch(error => console.error(error))
        } 
    }

    render() {
        // Redirect to post detail if successfully updated.
        const redirect = this.state.redirect;
        const redirectURL = '/dp/' + this.state._Id
        if (redirect) {
            return <Redirect to={redirectURL}/>
        }

        // Displays pre-populated form to edit the post.
        return (
            <div>
                <NavigationBar loggedIn={this.props.loggedIn} username={this.props.username} logOut={this.props.logOut}/>
                <div className="header">
                    <h1> Edit a post </h1>
                </div>
                <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label> Title </Form.Label>
                        <Form.Control type="title" value={this.state.title} onChange={e => this.setState({title: e.target.value})}/>
                        {this.state.titleError? <div style={{color: "red"}}>{this.state.titleError}</div>: null}
                    </Form.Group>
                    <Form.Group controlId="formURL">
                        <Form.Label> URL </Form.Label>
                        <Form.Control type="url" value={this.state.url} onChange={e => this.setState({url: e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="formBody">
                        <Form.Label> Post Text </Form.Label>
                        <Form.Control as="textarea" rows={15} value={this.state.text} onChange={e => this.setState({text: e.target.value})}/>
                        {this.state.bodyError? <div style={{color: "red"}}>{this.state.bodyError}</div>: null}
                    </Form.Group>
                    <Button variant="info" onClick={() => this.onClick()}> Update </Button>
                </Form>
            </div>            
        );
      }
}

export default withRouter(EditPost);
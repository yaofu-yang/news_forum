import React from 'react';
import './index.css';
import Axios from 'axios';
import {Redirect} from "react-router-dom";
import NavigationBar from './NavigationBar';
import {Form, Button} from 'react-bootstrap';
import validator from 'validator';

const initialState = {
    title: "",
    url: "",
    body: "",
    titleError: "",
    bodyError: "",
    urlError: "",
    loginError: "",
    redirect: false,
    newPostId: ""
}

export default class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.props.checkCookie();
    }

    validate = () => {
        let titleError = "";
        let bodyError = "";
        let urlError = "";
        let loginError = "";

        if (!this.state.title) {
            titleError = "Title is required";
        }

        if ((this.state.url && this.state.body) || (!this.state.url && !this.state.body)) {
            bodyError = "Please fill in only the url OR the post body, not both";
        }

        if (this.state.url && !validator.isURL(this.state.url)) {
            urlError = "Please provide a valid url.";
        }

        if (!this.props.loggedIn) {
            loginError = "You must be logged in to create a post.";
        }

        if (titleError || bodyError || urlError || loginError) {
            this.setState({titleError, bodyError, urlError, loginError});
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
                text: this.state.body
            }

            Axios.post('/api/posts/post', newPost)
                .then(response => {
                    console.log(response)
                    this.setState ({
                        redirect: true,
                        newPostId: response.data._id
                    });
                })
                .catch(error => console.error(error))
        } 
    }

    render() {
        const redirect = this.state.redirect;
        const redirectURL = '/dp/' + this.state.newPostId + '/#commentSection'
        if (redirect) {
            return <Redirect to={redirectURL} />
        }
        return (
            <div>
                <NavigationBar loggedIn={this.props.loggedIn} username={this.props.username} logOut={this.props.logOut}/>
                <div className="header">
                    <h1> Create a new post </h1>
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
                        {this.state.urlError? <div style={{color: "red"}}>{this.state.urlError}</div>: null}
                    </Form.Group>
                    <Form.Group id="textBodyForm" controlId="formBody">
                        <Form.Label> Post Text </Form.Label>
                        <Form.Control as="textarea" rows={13} value={this.state.body} onChange={e => this.setState({body: e.target.value})}/>
                        {this.state.bodyError? <div style={{color: "red"}}>{this.state.bodyError}</div>: null}
                    </Form.Group>
                    <Button variant="info" onClick={() => this.onClick()}> Submit Post</Button>
                    {this.state.loginError? <div style={{color: "red"}}>{this.state.loginError}</div>: null}
                </Form>
            </div>
        );
      }
}


import React from 'react';
import './index.css';
import Axios from 'axios';
import NavigationBar from './NavigationBar';
import {Redirect} from "react-router-dom";
import {Form, Button} from 'react-bootstrap';


export default class LogInPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: "",
            redirect: false,
        }
    }

    onSubmit() {
        Axios.post('/api/posts/user/login', this.state)
            .then(response => {
                this.props.checkCookie();
                this.setState ({
                    redirect: true,
                    error: "",
                });
            })
            .catch(error => {this.setState({error: error.response.data.message})});
    }

    render() {
        // Redirect to home page after logging in.
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to='/'/>
        }

        // Display login form
        return (
            <div>
                <NavigationBar loggedIn={this.props.loggedIn} username={this.props.username} logOut={this.props.logOut}/>
                <div className="header">
                    <h1> Log In Here </h1>
                </div>
                <Form>
                    <Form.Group controlId="formUsername">
                        <Form.Label> Username </Form.Label>
                        <Form.Control type="username" value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label> Password </Form.Label>
                        <Form.Control type="username" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
                    </Form.Group>
                    {this.state.error? <div style={{color: "red"}}>{this.state.error}</div>: null}
                    <Button variant="info" onClick={() => this.onSubmit()}> Log In </Button>
                </Form>
            </div>
        );

    }
}
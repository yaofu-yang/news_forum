import React from 'react';
import './index.css';
import Axios from 'axios';
import {Redirect, withRouter} from "react-router-dom";
import NavigationBar from './NavigationBar';
import {Form, Button} from 'react-bootstrap';

const initialState = {
    text: "",
    author: "",
    time: "",
    _id: "",
    postId: "",
    titleError: "",
    bodyError: "",
}

class EditComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const commentId = this.props.match.params.commentId;
        Axios.get('/api/posts/comment/' + commentId)
            .then((response) => {
                const comment = response.data[0];
                this.setState({
                    text: comment.text,
                    author: comment.author,
                    time: comment.time,
                    postId: comment.postId,
                    _id: commentId,
                });
            })
            .catch(error => console.error(error));
    }
    
    updateComment() {
        const newComment = {
            text: this.state.text,
            author: this.state.author,
            time: this.state.time,
            postId: this.state.postId,
            _id: this.state._id,
        }
        Axios.put('/api/posts/comment/' + this.state._id, newComment)
            .then(response => {
                this.setState({
                    redirect: true,
                    redirecturl: '/dp/' + this.state.postId
                });
            })
            .catch(error => console.error(error));
    }

    render() {
        const redirect = this.state.redirect;
        const redirecturl = this.state.redirecturl;
        if (redirect) {
            return <Redirect to={redirecturl}/>
        }
        return (
            <div>
                <NavigationBar loggedIn={this.props.loggedIn} username={this.props.username} logOut={this.props.logOut}/>
                <div className="header">
                    <h1> Edit Comment Here </h1>
                </div>
                <Form>
                    <Form.Group controlid="formComment">
                        <Form.Label> Edit Comment </Form.Label>
                        <Form.Control as="textarea" rows={5} value={this.state.text} onChange={e => this.setState({text: e.target.value})}/>
                    </Form.Group>
                    <Button variant="info" onClick={() => this.updateComment()}> Update Comment</Button>
                </Form> 
            </div>
            
        );
      }
}

export default withRouter(EditComment);
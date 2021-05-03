import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import './index.css';
import PostDetail from './PostDetail';
import CreatePost from './CreatePost';
import LogInPage from './LogInPage';
import SignUp from './SignUp';
import EditPost from './EditPost';
import EditComment from './EditComment';
import Axios from 'axios';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            username: ''
        }
    }
    logout() {
        Axios.post('/api/posts/user/logout')
            .then((response) => {
                this.setState({
                    loggedIn: false,
                    username: '',
                    error: "",})
            })
            .catch(error => console.error(error));
    }

    checkCookie() {
        Axios.post('/api/posts/user/loggedIn')
            .then(response => {
                const status = response.status;
                if(status === 200) {
                    this.setState({
                        loggedIn: true,
                        username: response.data.username,
                        error: "",})
                } else {
                    this.setState({
                        loggedIn: false,
                        error: "error.response.data.message"
                    })
                }
            })
    }

    render() {

        return (
            <div className="App">
                <Switch>
                    <Route exact path="/"> <Home loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()} logOut={() => this.logout()}/> </Route>
                    <Route exact path="/dp/:postID"> <PostDetail {...this.props} loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()} logOut={() => this.logout()}/></Route>
                    <Route exact path="/createPost"> <CreatePost loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()}/></Route>
                    <Route exact path="/editPost/:postID"> <EditPost {...this.props} loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()} logOut={() => this.logout()}/> </Route>
                    <Route exact path="/editComment/:commentId"> <EditComment {...this.props} loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()} logOut={() => this.logout()}/> </Route>
                    <Route exact path="/logIn"> <LogInPage loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()} logOut={() => this.logout()}/></Route>
                    <Route exact path="/signUp"> <SignUp loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()} logOut={() => this.logout()}/></Route>
                    <Route path="*"> <Home loggedIn={this.state.loggedIn} username={this.state.username} checkCookie={() => this.checkCookie()} logOut={() => this.logout()}/> </Route>
                </Switch>
            </div>
        )
    }
}
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export default class NavigationBar extends React.Component {

    render() {
        if(this.props.loggedIn) {
            return (
                <Navbar collapseOnSelect fixed='top' expand='sm' bg="dark" variant="dark">
                    <Navbar.Brand href="/">Salty News</Navbar.Brand>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
                    <Navbar.Collapse id='responsive-navbar-nav'>
                            <Nav className="mr-auto">
                                <Nav.Link href='/'>Home</Nav.Link>
                                <Nav.Link href='/createPost'>Create Post</Nav.Link>
                                <Nav.Link onClick={() => this.props.logOut()}> Log Out</Nav.Link>
                            </Nav>
                            <Navbar.Text>Signed in as: <em>{this.props.username}</em></Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
            )
        } else {
            return (
                <Navbar collapseOnSelect fixed='top' expand='sm' bg="dark" variant="dark">
                    <Navbar.Brand href="/">Hacky News</Navbar.Brand>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
                    <Navbar.Collapse id='responsive-navbar-nav'>
                            <Nav className="mr-auto">
                                <Nav.Link href='/'>Home</Nav.Link>
                                <Nav.Link href='/logIn'>Log In</Nav.Link>
                                <Nav.Link href='/signUp'>Sign Up</Nav.Link>
                            </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )
        }
        
    }
}
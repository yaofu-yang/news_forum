import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import {Container} from 'react-bootstrap';
import App from './App.js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    
    <Container>
        <Router>
            <div>
                <App />
            </div>
        </Router>
    </Container>,
    document.getElementById('root')
)
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Components
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

//Styles
import './styles/style.css';

function App() {
    return (
        <div className="App">
            <header>
                <h3>Homepage</h3>
                <nav>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </nav>
            </header>
        </div>
    );
}

ReactDOM.render(
    <Router>
        <Route path="/" exact component={App} />
        <Route path="/login"  component={Login} />
        <Route path="/signup"  component={SignUp} />
        <Route path="/dashboard"  component={Dashboard} />
    </Router>, document.getElementById('root'));

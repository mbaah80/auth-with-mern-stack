import React from 'react';
import Cookies from 'js-cookie';

const Dashboard = (props) => {
    return (
        <div className="App">
            <header>
                <h3>Dashboard</h3>
                <nav>
                    <span onClick={() => {
                        Cookies.remove('access-token');
                        props.history.push('/');
                    }}>Logout</span>
                </nav>
            </header>
        </div>
    );
}

export default Dashboard;
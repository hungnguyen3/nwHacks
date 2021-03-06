/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import './App.css';
import Login from './pages/Login';
import Landing from './pages/Landing';
import ManageStudents from './pages/ManageStudents';
import AddQuestions from './pages/AddQuestions';
import SendSMS from './pages/SendSMS';
import { useEffect, useState } from 'react';
import Logout from './functions/Logout';
import NavbarContainer from './pages/NavbarContainer';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';

const App: React.FC = () => {
    const [token, setToken] = useState(() => {
        const savedToken = window.localStorage.getItem('token');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return savedToken != null ? JSON.parse(savedToken) : null;
    });

    useEffect(() => {
        if (token == null) {
            window.localStorage.removeItem('token');
        } else {
            window.localStorage.setItem('token', JSON.stringify(token));
        }
    }, [token]);

    return (
        <Router>
            <NavbarContainer />
            <Switch>
                <div
                    className="background"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ zIndex: 1 }}>
                        <Route exact path="/landing" component={Landing} />
                        <Route
                            exact
                            path="/login"
                            render={props => {
                                return token ? (
                                    <Redirect to="/" />
                                ) : (
                                    <Login {...props} setToken={setToken} />
                                );
                            }}
                        />
                        <Route
                            exact
                            path="/students"
                            render={props => {
                                return token ? (
                                    <ManageStudents
                                        {...props}
                                        sessionId={token}
                                    />
                                ) : (
                                    <Redirect to="/landing" />
                                );
                            }}
                        />
                        <Route
                            exact
                            path="/questions"
                            render={props => {
                                return token ? (
                                    <AddQuestions
                                        {...props}
                                        sessionId={token}
                                    />
                                ) : (
                                    <Redirect to="/landing" />
                                );
                            }}
                        />
                        <Route
                            exact
                            path="/sms"
                            render={props => {
                                return token ? (
                                    <SendSMS {...props} sessionId={token} />
                                ) : (
                                    <Redirect to="/landing" />
                                );
                            }}
                        />
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return token ? (
                                    <>
                                        <Logout
                                            sessionId={token}
                                            setToken={setToken}
                                        />
                                    </>
                                ) : (
                                    <Redirect to="/landing" />
                                );
                            }}
                        />
                    </div>
                </div>
            </Switch>
        </Router>
    );
};

export default App;

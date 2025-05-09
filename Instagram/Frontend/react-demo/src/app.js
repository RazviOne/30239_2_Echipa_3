import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Login from './login/login';
import PersonContainer from './person/person-container'
import AdminContainer from './admin/admin-container'

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import ProtectedRoute from "./protected-route";

class App extends React.Component {

    render() {

        return (
            <div className={styles.back}>
                <Router>
                    <div>
                        <NavigationBar />
                        <Switch>

                            <Route
                                exact
                                path='/'
                                render={() => <Login/>}
                            />

                            {/*<ProtectedRoute*/}
                            {/*    exact*/}
                            {/*    path="/admin"*/}
                            {/*    component={AdminContainer}*/}
                            {/*    // adminOnly={true}*/}
                            {/*/>*/}

                            {/*<ProtectedRoute*/}
                            {/*    exact*/}
                            {/*    path="/person"*/}
                            {/*    component={PersonContainer}*/}
                            {/*/>*/}
                            <Route
                                exact
                                path='/person'
                                component={PersonContainer}
                            />

                            <Route
                                exact
                                path='/admin'
                                component={AdminContainer}
                            />

                            {/*Error*/}
                            <Route
                                exact
                                path='/error'
                                render={() => <ErrorPage/>}
                            />

                            <Route render={() =><ErrorPage/>} />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    };
}

export default App

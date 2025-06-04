import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Login from './login/login';
import PersonContainer from './person/person-container'
import AdminContainer from './admin/admin-container'
import Feed from './posts/feed';
import PostDetails from './posts/post-details';

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';

class App extends React.Component {

    render() {

        return (
            <div className={styles.back}>
                <Router>
                    <div>
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

                            <Route 
                                exact 
                                path='/home' 
                                component={Feed} 
                            />

                            <Route 
                                exact 
                                path='/profile' 
                                component={PersonContainer}
                            />
                            
                            <Route
                                exact
                                path="/post/:id"
                                component={PostDetails} 
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

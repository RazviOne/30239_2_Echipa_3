import React from "react";
import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';

const ProtectedRoute = ({ component: Component, adminOnly, ...rest }) => {
    const { user } = useContext(UserContext);

    return (
        <Route
            {...rest}
            render={props =>
                user ? (
                    adminOnly && !user.isAdmin ? (
                        <Redirect to="/person" />
                    ) : (
                        <Component {...props} />
                    )
                ) : (
                    <Redirect to="/" />
                )
            }
        />
    );
};

export default ProtectedRoute;

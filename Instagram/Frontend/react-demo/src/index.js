import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './app'


import 'bootstrap/dist/css/bootstrap.min.css';
import {UserProvider} from "./contexts/UserContext";

ReactDOM.render(
    <UserProvider>
        <App />
    </UserProvider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

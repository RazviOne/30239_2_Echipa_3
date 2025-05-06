import React from 'react';
import { withRouter} from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import BackgroundImg from '../commons/images/future-medicine.jpg';

import {Button, Container, FormGroup, Input, Jumbotron, Label, Alert} from 'reactstrap';
import * as API_USERS from "../admin/api/people-api";

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "1920px",
    backgroundImage: `url(${BackgroundImg})`
};
const textStyle = {color: 'white', };

class Home extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            errorStatus: 0
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserLogin = this.handleUserLogin.bind(this);

        // console.log(`Page loaded.\nUsername: ${this.state.username}\npassword: ${this.state.password}`);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value, errorMessage: '' });
    }

    handleUserLogin(){
        const { username, password } = this.state;
        const { login } = this.context;

        if(username === '' || password === ''){
            this.setState({ errorMessage: 'Please enter both username and password'});
            return;
        }

        // console.log(`Inputs:\nusername: ${username}\npassword: ${password}`);
        API_USERS.authenticateUser(username, password, (result, status, error) => {
            if (result !== null && (status === 200 || status === 202)) {
                // console.log('Authentication successful');

                const userData = {
                    username: username,
                    isAdmin: result.isAdmin
                };
                login(userData);

                if(result.isAdmin){
                    this.props.history.push('/admin');
                }
                else{
                    this.props.history.push('/person');
                }
            } else {
                // console.log('Authentication failed: ', error);
                this.setState(({
                    errorMessage: 'Login failed, Please check your credentials.',
                    errorStatus: status
                }));
            }
        });
    }

    render() {
        const { username, password, errorMessage, isLoading } = this.state;

        return (
            <div>
                <Jumbotron fluid style={backgroundStyle}>
                    <Container fluid>
                        <h1 className="display-3" style={textStyle}>Integrated Medical Monitoring Platform for Home-care assistance</h1>
                        <p className="lead" style={textStyle}> <b>Enabling real time monitoring of patients, remote-assisted care services and
                            smart intake mechanism for prescribed medication.</b> </p>
                        <hr className="my-2"/>
                        <p  style={textStyle}> <b>This assignment represents the first module of the distributed software system "Integrated
                            Medical Monitoring Platform for Home-care assistance that represents the final project
                            for the Distributed Systems course. </b> </p>
                        <p className="lead">
                            <FormGroup id='authentication'>
                                <Label for='usernameField'> Username: </Label>
                                <Input
                                    type='text'
                                    name='username'
                                    id='usernameField'
                                    value={username}
                                    onChange={this.handleInputChange}
                                    placeholder="Enter your username"
                                    disabled={isLoading}
                                />

                                <Label for='passwordField'> Password: </Label>
                                <Input
                                    type='password'
                                    name='password'
                                    id='passwordField'
                                    value={password}
                                    onChange={this.handleInputChange}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />

                                <Button
                                    color="primary"
                                    onClick={(e) => this.handleUserLogin(e)}
                                    disabled={isLoading}
                                >
                                    Login
                                </Button>


                            </FormGroup>
                            {errorMessage && (
                                <Alert color="danger" style={{ marginTop: '10px' }}>
                                    {errorMessage}
                                </Alert>
                            )}
                        </p>
                    </Container>
                </Jumbotron>
            </div>
        )
    };
}

export default withRouter(Home)

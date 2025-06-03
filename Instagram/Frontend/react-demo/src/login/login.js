import React from 'react';
import { withRouter} from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
// import BackgroundImg from '../commons/images/future-medicine.jpg';
import loginLogo from '../commons/images/Instagram_login_Logo.png';
import instagramAppPhone from '../commons/images/instagram_phone_app.png'
import RegisterPersonForm from "./components/register-person-form";
import Notification from "./components/notification";

import {
    Button,
    Container,
    FormGroup,
    Input,
    Alert,
    Card,
    Col,
    Row,
    ModalHeader,
    ModalBody, Modal
} from 'reactstrap';
import * as API_USERS from "../admin/api/people-api";

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "1920px",
    // backgroundImage: `url(${BackgroundImg})`
};
const textStyle = {color: 'white'};

class Login extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.toggleRegisterPersonForm = this.toggleRegisterPersonForm.bind(this);
        this.handleUserSignUp = this.handleUserSignUp.bind(this)
        this.dismissNotification = this.dismissNotification.bind(this);
        this.reload = this.reload.bind(this);

        this.state = {
            showRegisterPersonForm: false,
            collapseForm: false,
            notification: false,
            username: '',
            password: '',
            errorMessage: '',
            errorStatus: 0
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserLogin = this.handleUserLogin.bind(this);

        // alert(`Page loaded.\nUsername: ${this.state.username}\npassword: ${this.state.password}`);
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

        // alert(`Inputs:\nusername: ${username}\npassword: ${password}`);
        API_USERS.authenticateUser(username, password, (result, status, error) => {
            if (result !== null && (status === 200 || status === 202)) {
                // alert('Authentication successful');

                const userData = {
                    idPerson: result.idPerson,
                    name: result.name,
                    username: result.name,
                    userScore: result.userScore,
                    isAdmin: result.isAdmin,
                    isBanned: result.isBanned,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    birthDate: result.birthDate,
                    homeCity: result.homeCity
                };

                login(userData);

                this.props.history.push('/home');
            } else {
                // alert('Authentication failed');
                console.log('Error message:');
                console.log(error);

                this.setState(({
                    errorMessage: 'Login failed, Please check your credentials.',
                    errorStatus: status
                }));
            }
        });
    }

    handleUserSignUp(){
        this.setState({notification: true});

        this.reload();
    }

    dismissNotification(){
        this.setState({
            notification: false
        });
    }

    toggleRegisterPersonForm() {
        this.setState({ showRegisterPersonForm: !this.state.showRegisterPersonForm });
    }

    reload(){
        this.setState({
            showRegisterPersonForm: false,
            collapseForm: false,
            username: '',
            password: '',
        });
    }

    render() {
        const { username, password, errorMessage, isLoading } = this.state;

        return (
            <div>
                <div>
                    {this.state.notification && (<Notification onClose={this.dismissNotification}/>)}
                </div>
                <div>
                    <Row className={"align-items-center" + " justify-content-center"}>
                        <Col sm="3">
                            <Card className="border-white">
                                <img
                                    src={instagramAppPhone}
                                    style={{
                                        scale:"83%"
                                    }}
                                />
                            </Card>
                        </Col>

                        <Col sm="3">
                            <Card style={{
                                width: '20rem',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                textAlign: 'center'
                            }}>
                                <Container fluid>
                                    <img
                                        src={loginLogo}
                                        style={{
                                            marginTop: '2.5rem',
                                            marginBottom: '2.5rem'
                                        }}
                                    />
                                    <div className="lead">
                                        <FormGroup id='authentication'>
                                            <Input
                                                type='text'
                                                name='username'
                                                id='usernameField'
                                                value={username}
                                                onChange={this.handleInputChange}
                                                placeholder="Enter your username here"
                                                disabled={isLoading}
                                            />

                                            <div style={{height:"0.5rem"}}/>

                                            <Input
                                                type='password'
                                                name='password'
                                                id='passwordField'
                                                value={password}
                                                onChange={this.handleInputChange}
                                                placeholder="Enter your password here"
                                                disabled={isLoading}
                                            />

                                            <div style={{height:"1rem"}}/>

                                            <Card style={{width: '91.5%', marginLeft: '4%'}}>
                                                <Row>
                                                    <Button
                                                        color="primary"
                                                        onClick={(e) => this.handleUserLogin(e)}
                                                        disabled={isLoading}
                                                    >
                                                        Log in
                                                    </Button>
                                                </Row>
                                            </Card>

                                        </FormGroup>

                                        {errorMessage && (
                                            <Alert color="danger" style={{ marginTop: '10px' }}>
                                                {errorMessage}
                                            </Alert>
                                        )}
                                    </div>
                                </Container>
                            </Card>

                            <Card style={{
                                width: '20rem',
                                height: '5rem',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginTop: '1rem',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    marginTop: 'auto',
                                    marginBottom: 'auto'
                                }}>

                                    Don't have an account?
                                    <Button
                                        color="link"
                                        onClick={(e) => this.toggleRegisterPersonForm()}
                                        disabled={isLoading}
                                    >
                                        Sign up
                                    </Button>
                                </div>
                            </Card>

                            <Modal
                                isOpen={this.state.showRegisterPersonForm}
                                toggle={this.toggleRegisterPersonForm}
                                className={this.props.className}
                                size="lg"
                            >
                                <ModalHeader toggle={this.toggleRegisterPersonForm}>Register User:</ModalHeader>
                                <ModalBody>
                                    <RegisterPersonForm reloadHandler={this.handleUserSignUp} />
                                </ModalBody>
                            </Modal>

                            <Card style={{
                                width: '20rem',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginTop: '1rem',
                                textAlign: 'center',
                            }}
                                  className={"border-white"}
                            >
                                We don't have an app, we're broke
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div
                    className="copyright"
                    style={{textAlign:"center", marginTop: '5rem'}}
                >
                    <span>
                        © 2025 Instagram from Echipa 3
                    </span>
                </div>
            </div>
        )
    };
}

export default withRouter(Login)
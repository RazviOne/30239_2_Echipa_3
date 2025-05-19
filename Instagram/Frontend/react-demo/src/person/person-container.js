import React from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { Card, CardHeader, Col, Row } from 'reactstrap';
import Feed from '../posts/feed';


import {HOST} from "../commons/hosts";
import * as API_USERS from "./api/person-api";
import * as API_DEVICES from "./api/device-api";
import DeviceTable from "./components/device-table";
import { UserContext } from "../contexts/UserContext";
import Notification from "./components/notification";

class PersonContainer extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.state = {
            personName: '',
            personAddress: '',
            personAge: '',
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            notifications: []
        };

        this.stompClient = null;
        this.stompChatClient = null;
    }

    componentDidMount() {
        // console.log('componentDidMount()');
        // this.protectRoute();
        this.fetchPersons();
        this.connectWebSocket();
        this.connectChatWebSocket();
    }

    componentWillUnmount() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            // console.log('WebSocket connection closed.');
        }
        if (this.stompChatClient) {
            this.stompChatClient.deactivate();
            // console.log('WebSocket connection closed.');
        }
    }

    protectRoute() {
        // console.log('protectRoute()');
        const { user, logout } = this.context;

        if (!user) {
            alert('Please log in to access the User page.');
            logout();
            this.props.history.push('/');
        }
    }

    fetchPersons() {
        // console.log('fetchPersons()');
        const { user } = this.context;

        API_USERS.getPersons((result, status, err) => {
            if (result !== null && status === 200) {
                let usernameId = 0;

                for (const [, value] of Object.entries(result)) {
                    let currentId = 0;
                    for (const [innerKey, innerValue] of Object.entries(value)) {
                        if (innerKey === 'id') currentId = innerValue;
                        if (innerKey === 'username' && innerValue === user.username) usernameId = currentId;
                    }
                }

                API_USERS.getPersonById(usernameId, (result2, status2, error2) => {
                    if (result2 !== null && (status2 === 200 || status2 === 201)) {
                        API_DEVICES.getDevicesByPersonId(usernameId, (result3, status3, error3) => {
                            if (result3 !== null && (status3 === 200 || status3 === 201 || status3 === 202)) {
                                this.setState({
                                    personName: result2.name,
                                    personAddress: result2.address,
                                    personAge: result2.age,
                                    tableData: result3,
                                    isLoaded: true
                                });
                            } else {
                                this.setState({
                                    personName: result2.name,
                                    personAddress: result2.address,
                                    personAge: result2.age,
                                    tableData: [],
                                    isLoaded: false,
                                    errorStatus: status3,
                                    error: error3
                                });
                            }
                        });
                    } else {
                        this.setState({
                            personName: '',
                            personAddress: '',
                            personAge: '',
                            errorStatus: status2,
                            error: error2
                        });
                    }
                });
            } else {
                this.setState({
                    errorStatus: status,
                    error: err
                });
            }
        });
    }

    connectWebSocket() {
        // console.log('connectWebSocket()');

        const { user } = this.context;

        const socket = new SockJS(HOST.measurements_api + '/ws-message');

        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: (frame) => {
                // console.log('Connected to WebSocket:', frame);

                this.stompClient.subscribe('/topic/message', (message) => {
                    const websocketMessage = JSON.parse(message.body);
                    // console.log('Received update:', websocketMessage);
                    // console.log(`Notification: ${websocketMessage.notification}`);

                    const personId = websocketMessage.personId;
                    // console.log(`Person ID: ${personId}, ${typeof(personId)}`);

                    if(personId !== undefined) {
                        API_USERS.getPersonById(personId, (result, status, error) => {
                            if (result !== null && (status === 200 || status === 201)) {
                                // console.log(`Person found: ${result.username}`);
                                if (user.username === result.username) {
                                    const notificationId = Date.now() + Math.random();

                                    this.setState((prevState) => ({
                                        notifications: [...prevState.notifications, {
                                            id: notificationId,
                                            message: websocketMessage.notification
                                        }]
                                    }));

                                    this.reload();
                                }
                            } else {
                                this.setState({
                                    isLoaded: false,
                                    errorStatus: status,
                                    error: error
                                });
                            }
                        });
                    }
                });
            },
            onStompError: (frame) => {
                console.error('WebSocket error:', frame);
            }
        });

        this.stompClient.activate();
    }

    connectChatWebSocket() {
        console.log('connectChatWebSocket()');

        const { user } = this.context;

        const socket = new SockJS(HOST.chat_api + '/ws-chat');

        this.stompChatClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: (frame) => {
                console.log('Connected to Chat WebSocket:', frame);

                this.stompChatClient.subscribe('/topic/message', (message) => {
                    const websocketMessage = JSON.parse(message.body);
                    console.log('Received update:', websocketMessage);


                    const messageType = websocketMessage.type;
                    // console.log(`Message type: ${messageType}, ${typeof(messageType)}`);

                    // const userId = websocketMessage.userId;
                    // console.log(`New message for user ${userId}`);

                    console.log(`Current user id: ${user.id}`);
                    if(messageType === 'MessageReceive') {
                        // Display the message
                        // Pop up the chat box, if it's not shown
                        // Push the message in the chat
                        console.log("New message from admin");
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Chat WebSocket error:', frame);
            }
        });

        this.stompChatClient.activate();
    }

    reload() {
        // console.log('reload()');
        this.setState({ isLoaded: false });
        this.fetchPersons();
    }

    dismissNotification = (id) => {
        this.setState((prevState) => ({
            notifications: prevState.notifications.filter(notification => notification.id !== id)
        }));
    };

    render() {
        // console.log('render()');
        const { user } = this.context;
        return (
            <div>
                <div className="notification-container">
                    {this.state.notifications.map((notification, index) => (
                        <Notification
                            key={notification.id}
                            id={notification.id}
                            message={notification.message}
                            index={index}
                            onClose={this.dismissNotification}
                        />
                    ))}
                </div>
                <CardHeader>
                    <strong> Welcome {user ? user.username : ''} </strong>
                </CardHeader>

                <Card>
                    <Row>
                        <Col>Name: {this.state.personName}</Col>
                    </Row>
                    <Row>
                        <Col>Address: {this.state.personAddress}</Col>
                    </Row>
                    <Row>
                        <Col>Age: {this.state.personAge}</Col>
                    </Row>
                    <br />
                    <Row>
                        <Col><strong>Devices</strong></Col>
                    </Row>
                    <Row>
                        <Col><strong>Postări</strong></Col>
                        </Row>
                        <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            <Feed />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            {this.state.isLoaded && <DeviceTable tableData={this.state.tableData} />}
                            {this.state.errorStatus > 0 && (
                                <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />
                            )}
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

export default PersonContainer;

import React from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import AddPersonForm from "./components/add-person-form";
import DeletePersonForm from "./components/delete-person-form";
import EditPersonForm from "./components/edit-person-form";
import AddPostForm from "./components/add-post-form";
import DeleteDeviceForm from "./components/delete-device-form";
import EditDeviceForm from "./components/edit-device-form";
import AddDeviceLinkForm from "./components/add-deviceLink-form";
import DeleteDeviceLinkForm from "./components/delete-deviceLink-form";
import * as API_PEOPLE from "./api/people-api";
import * as API_POSTS from "./api/posts-api"
import * as API_REACTIONS from "./api/reactions-api"
import PersonTable from "./components/person-table";
import DeviceTable from "./components/device-table";
import DeviceLinkTable from "./components/deviceLink-table";
import { UserContext } from "../contexts/UserContext";
import {HOST} from "../commons/hosts";

class AdminContainer extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.toggleAddPersonForm = this.toggleAddPersonForm.bind(this);
        this.toggleDeletePersonForm = this.toggleDeletePersonForm.bind(this);
        this.toggleEditPersonForm = this.toggleEditPersonForm.bind(this);
        this.toggleAddDeviceForm = this.toggleAddDeviceForm.bind(this);
        this.toggleDeleteDeviceForm = this.toggleDeleteDeviceForm.bind(this);
        this.toggleEditDeviceForm = this.toggleEditDeviceForm.bind(this);
        this.toggleAddDeviceLinkForm = this.toggleAddDeviceLinkForm.bind(this);
        this.toggleDeleteDeviceLinkForm = this.toggleDeleteDeviceLinkForm.bind(this);
        this.reload = this.reload.bind(this);

        this.state = {
            showAddPersonForm: false,
            showDeletePersonForm: false,
            showEditPersonForm: false,
            showAddDeviceForm: false,
            showDeleteDeviceForm: false,
            showEditDeviceForm: false,
            showAddDeviceLinkForm: false,
            showDeleteDeviceLinkForm: false,
            collapseForm: false,
            personTableData: [],
            deviceTableData: [],
            deviceLinkTableData: [],
            personTableIsLoaded: false,
            deviceTableIsLoaded: false,
            deviceLinkTableIsLoaded: false,
            errorStatus: 0,
            error: null,
        };

        this.stompClient = null;
    }

    componentDidMount() {
        this.protectRoute();
        this.fetchPersons();
        this.fetchDevices();
        this.fetchDeviceLinks();
        this.connectChatWebSocket();
    }

    componentWillUnmount() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            console.log('WebSocket connection closed.');
        }
    }

    protectRoute() {
        const { user, logout } = this.context;

        const storedUser = sessionStorage.getItem('user');

        if (user && user.isAdmin) {
            return;
        } else if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            if (!parsedUser.isAdmin) {
                alert('Access denied. Admins only.');
                this.props.history.push('/');
            }
        } else {
            alert('Please log in to access the Admin page.');
            logout();
            this.props.history.push('/');
        }
    }

    fetchPersons() {
        return API_USERS.getPersons((result, status, err) => {
            // console.log(result);
            if (result !== null && status === 200) {
                this.setState({
                    personTableData: result,
                    personTableIsLoaded: true,
                });
            } else {
                this.setState({
                    errorStatus: status,
                    error: err,
                });
            }
        });
    }

    fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {
            // console.log(result);
            if (result !== null && status === 200) {
                this.setState({
                    deviceTableData: result,
                    deviceTableIsLoaded: true,
                });
            } else {
                this.setState({
                    errorStatus: status,
                    error: err,
                });
            }
        });
    }

    fetchDeviceLinks() {
        return API_DEVICELINKS.getDeviceLinks((result, status, err) => {
            // console.log(result);
            if (result !== null && status === 200) {
                this.setState({
                    deviceLinkTableData: result,
                    deviceLinkTableIsLoaded: true,
                });
            } else {
                this.setState({
                    errorStatus: status,
                    error: err,
                });
            }
        });
    }

    toggleAddPersonForm() {
        this.setState({ showAddPersonForm: !this.state.showAddPersonForm });
    }

    toggleDeletePersonForm() {
        this.setState({ showDeletePersonForm: !this.state.showDeletePersonForm });
    }

    toggleEditPersonForm() {
        this.setState({ showEditPersonForm: !this.state.showEditPersonForm });
    }

    toggleAddDeviceForm() {
        this.setState({ showAddDeviceForm: !this.state.showAddDeviceForm });
    }

    toggleDeleteDeviceForm() {
        this.setState({ showDeleteDeviceForm: !this.state.showDeleteDeviceForm });
    }

    toggleEditDeviceForm() {
        this.setState({ showEditDeviceForm: !this.state.showEditDeviceForm });
    }

    toggleAddDeviceLinkForm() {
        this.setState({ showAddDeviceLinkForm: !this.state.showAddDeviceLinkForm });
    }

    toggleDeleteDeviceLinkForm() {
        this.setState({ showDeleteDeviceLinkForm: !this.state.showDeleteDeviceLinkForm });
    }

    connectChatWebSocket() {
        // console.log('connectChatWebSocket()');

        // const { user } = this.context;

        const socket = new SockJS(HOST.chat_api + '/ws-chat');

        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: (frame) => {
                // console.log('Connected to Chat WebSocket:', frame);

                this.stompClient.subscribe('/topic/message', (message) => {
                    const websocketMessage = JSON.parse(message.body);
                    console.log('Received update:', websocketMessage);

                    const messageType = websocketMessage.type;
                    // console.log(`Message type: ${messageType}, ${typeof(messageType)}`);

                    if(messageType === 'MessageSend') {
                        // Display the message
                        // Pop up the chat box, if it's not shown
                        // Push the message in the chat
                        const userId = websocketMessage.userId;
                        console.log(`New message from user ${userId}`);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Chat WebSocket error:', frame);
            }
        });

        this.stompClient.activate();
    }

    reload() {
        this.setState({
            personTableIsLoaded: false,
            deviceTableIsLoaded: false,
            deviceLinkTableIsLoaded: false,
            showAddPersonForm: false,
            showDeletePersonForm: false,
            showEditPersonForm: false,
            showAddDeviceForm: false,
            showDeleteDeviceForm: false,
            showEditDeviceForm: false,
            showAddDeviceLinkForm: false,
            showDeleteDeviceLinkForm: false
        });
        this.fetchPersons();
        this.fetchDevices();
        this.fetchDeviceLinks();
    }

    render() {
        return (
            <div>
                <div className="personDiv">
                    <CardHeader>
                        <strong>Person Management</strong>
                    </CardHeader>

                    <Card>
                        <br />
                        <Row>
                            <Col sm={{ size: '8', offset: 1 }}>
                                <Button color="primary" onClick={this.toggleAddPersonForm}>
                                    Add Person
                                </Button>{' '}
                                <Button color="secondary" onClick={this.toggleEditPersonForm}>
                                    Edit Person
                                </Button>{' '}
                                <Button color="danger" onClick={this.toggleDeletePersonForm}>
                                    Delete Person
                                </Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col sm={{ size: '8', offset: 1 }}>
                                {this.state.personTableIsLoaded && <PersonTable personTableData={this.state.personTableData} />}
                                {this.state.errorStatus > 0 && (
                                    <APIResponseErrorMessage
                                        errorStatus={this.state.errorStatus}
                                        error={this.state.error}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Card>

                    <Modal
                        isOpen={this.state.showAddPersonForm}
                        toggle={this.toggleAddPersonForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleAddPersonForm}>Add Person:</ModalHeader>
                        <ModalBody>
                            <AddPersonForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={this.state.showEditPersonForm}
                        toggle={this.toggleEditPersonForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleEditPersonForm}>Edit Person:</ModalHeader>
                        <ModalBody>
                            <EditPersonForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={this.state.showDeletePersonForm}
                        toggle={this.toggleDeletePersonForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleDeletePersonForm}>Delete Person:</ModalHeader>
                        <ModalBody>
                            <DeletePersonForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>
                </div>

                <div className="deviceDiv">
                    <CardHeader>
                        <strong>Device Management</strong>
                    </CardHeader>

                    <Card>
                        <br />
                        <Row>
                            <Col sm={{ size: '8', offset: 1 }}>
                                <Button color="primary" onClick={this.toggleAddDeviceForm}>
                                    Add Device
                                </Button>{' '}
                                <Button color="secondary" onClick={this.toggleEditDeviceForm}>
                                    Edit Device
                                </Button>{' '}
                                <Button color="danger" onClick={this.toggleDeleteDeviceForm}>
                                    Delete Device
                                </Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col sm={{ size: '8', offset: 1 }}>
                                {this.state.deviceTableIsLoaded && <DeviceTable deviceTableData={this.state.deviceTableData} />}
                                {this.state.errorStatus > 0 && (
                                    <APIResponseErrorMessage
                                        errorStatus={this.state.errorStatus}
                                        error={this.state.error}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Card>

                    <Modal
                        isOpen={this.state.showAddDeviceForm}
                        toggle={this.toggleAddDeviceForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleAddDeviceForm}>Add Device:</ModalHeader>
                        <ModalBody>
                            <AddPostForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={this.state.showEditDeviceForm}
                        toggle={this.toggleEditDeviceForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleEditDeviceForm}>Edit Device:</ModalHeader>
                        <ModalBody>
                            <EditDeviceForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={this.state.showDeleteDeviceForm}
                        toggle={this.toggleDeleteDeviceForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleDeleteDeviceForm}>Delete Device:</ModalHeader>
                        <ModalBody>
                            <DeleteDeviceForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>
                </div>

                <div className="deviceLinkDiv">
                    <CardHeader>
                        <strong>Device Link Management</strong>
                    </CardHeader>

                    <Card>
                        <br />
                        <Row>
                            <Col sm={{ size: '8', offset: 1 }}>
                                <Button color="primary" onClick={this.toggleAddDeviceLinkForm}>
                                    Add Device Link
                                </Button>{' '}
                                <Button color="danger" onClick={this.toggleDeleteDeviceLinkForm}>
                                    Delete Device Link
                                </Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col sm={{ size: '8', offset: 1 }}>
                                {this.state.deviceLinkTableIsLoaded && <DeviceLinkTable deviceLinkTableData={this.state.deviceLinkTableData} />}
                                {this.state.errorStatus > 0 && (
                                    <APIResponseErrorMessage
                                        errorStatus={this.state.errorStatus}
                                        error={this.state.error}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Card>

                    <Modal
                        isOpen={this.state.showAddDeviceLinkForm}
                        toggle={this.toggleAddDeviceLinkForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleAddDeviceLinkForm}>Add Device Link:</ModalHeader>
                        <ModalBody>
                            <AddDeviceLinkForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>

                    <Modal
                        isOpen={this.state.showDeleteDeviceLinkForm}
                        toggle={this.toggleDeleteDeviceLinkForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleDeleteDeviceLinkForm}>Delete Device Link:</ModalHeader>
                        <ModalBody>
                            <DeleteDeviceLinkForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default AdminContainer;
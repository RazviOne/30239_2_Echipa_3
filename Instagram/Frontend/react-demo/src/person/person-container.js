import React from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { Card, CardHeader, Col, Row } from 'reactstrap';
import Feed from '../posts/feed';
import NavigationBar from '../navigation-bar';


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
    }

    componentDidMount() {
        // console.log('componentDidMount()');
        // this.protectRoute();
        // this.fetchPersons();
    }

    componentWillUnmount() {
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

    reload() {
        // console.log('reload()');
        this.setState({ isLoaded: false });
        // this.fetchPersons();
    }

    render() {
        // console.log('render()');
        const { user } = this.context;
        return (
            <>
                <NavigationBar />
                <div>
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
                            <Col><strong>Postări</strong></Col>
                        </Row>
                        {/*<Row>*/}
                        {/*    <Col sm={{ size: '8', offset: 1 }}>*/}
                        {/*        <Feed />*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                    </Card>
                </div>
            </>
        );
    }
}

export default PersonContainer;

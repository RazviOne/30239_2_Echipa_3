import React from 'react';
import { Card, CardHeader, Col, Row } from 'reactstrap';
import NavigationBar from '../navigation-bar';

import { UserContext } from "../contexts/UserContext";

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

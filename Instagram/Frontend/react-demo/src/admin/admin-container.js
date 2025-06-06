import React from 'react';
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
import AddTagForm from "./components/add-tag-form";
import DeleteTagForm from "./components/delete-tag-form";
// import EditTagForm from "./components/edit-tag-form";
import * as API_PEOPLE from "./api/people-api";
import * as API_TAGS from "./api/tags-api"
import PersonTable from "./components/person-table";
import TagTable from "./components/tag-table";
import { UserContext } from "../contexts/UserContext";
import NavigationBar from "../navigation-bar";

class AdminContainer extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.toggleAddPersonForm = this.toggleAddPersonForm.bind(this);
        this.toggleDeletePersonForm = this.toggleDeletePersonForm.bind(this);
        this.toggleEditPersonForm = this.toggleEditPersonForm.bind(this);
        this.toggleAddTagForm = this.toggleAddTagForm.bind(this);
        this.toggleDeleteTagForm = this.toggleDeleteTagForm.bind(this);
        // this.toggleEditTagForm = this.toggleEditTagForm.bind(this);
        this.reload = this.reload.bind(this);

        this.state = {
            showAddPersonForm: false,
            showDeletePersonForm: false,
            showEditPersonForm: false,
            showAddTagForm: false,
            showDeleteTagForm: false,
            // showEditTagForm: false,
            collapseForm: false,
            personTableData: [],
            tagTableData: [],
            personTableIsLoaded: false,
            tagTableIsLoaded: false,
            errorStatus: 0,
            error: null,
        };
    }

    componentDidMount() {
        // this.protectRoute();
        const { user } = this.context;

        console.log(user);
        // console.log("Admin: " + user.isAdmin);

        if(user === null){
            alert('Ai zburat.')
            this.props.history.push('/');
        }
        else {

            if ((!user.isAdmin)) {
                alert("You're not an admin");
                this.props.history.push('/home');
            } else {
                this.fetchPersons();
                this.fetchTags();
            }
        }
    }

    // protectRoute() {
    //     const { user, logout } = this.context;
    //
    //     const storedUser = sessionStorage.getItem('user');
    //
    //     if (user && user.isAdmin) {
    //         return;
    //     } else if (storedUser) {
    //         const parsedUser = JSON.parse(storedUser);
    //
    //         if (!parsedUser.isAdmin) {
    //             alert('Access denied. Admins only.');
    //             this.props.history.push('/');
    //         }
    //     } else {
    //         alert('Please log in to access the Admin page.');
    //         logout();
    //         this.props.history.push('/');
    //     }
    // }

    fetchPersons() {
        return API_PEOPLE.getPersons((result, status, err) => {
            // console.log(result);
            if (result !== null && status === 200) {
                this.setState({
                    personTableData: result,
                    personTableIsLoaded: true,
                });
                // console.log('Person table: ', this.state.personTableData);
            } else {
                this.setState({
                    errorStatus: status,
                    error: err,
                });
            }
        });
    }

    fetchTags() {
        return API_TAGS.getTags((result, status, err) => {
            // console.log(result);
            if (result !== null && status === 200) {
                this.setState({
                    tagTableData: result,
                    tagTableIsLoaded: true,
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

    toggleAddTagForm() {
        this.setState({ showAddTagForm: !this.state.showAddTagForm });
    }

    toggleDeleteTagForm() {
        this.setState({ showDeleteTagForm: !this.state.showDeleteTagForm });
    }

    // toggleEditTagForm() {
    //     this.setState({ showEditTagForm: !this.state.showEditTagForm });
    // }


    reload() {
        this.setState({
            personTableIsLoaded: false,
            tagTableIsLoaded: false,
            showAddPersonForm: false,
            showDeletePersonForm: false,
            showEditPersonForm: false,
            showAddTagForm: false,
            showDeleteTagForm: false,
            // showEditTagForm: false,
        });
        this.fetchPersons();
        this.fetchTags();
    }

    render() {
        return (
            <div>
                <NavigationBar/>
                <div className="personDiv">
                    <CardHeader>
                        <strong>Users Management</strong>
                    </CardHeader>

                    <Card>
                        <br />
                        <Row>
                            <div style={{width: '2rem'}}/>
                            <Col sm={{ size: '8' }}>
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
                            <div style={{width: '1rem'}}/>
                            <Col sm={{ size: '10' }}>
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

                <div className="tagDiv">
                    <CardHeader>
                        <strong>Tags Management</strong>
                    </CardHeader>

                    <Card>
                        <br />
                        <Row>
                            <div style={{width: '2rem'}}/>
                            <Col sm={{ size: '8' }}>
                                <Button color="primary" onClick={this.toggleAddTagForm}>
                                    Add Tag
                                </Button>{' '}
                                {/*<Button color="secondary" onClick={this.toggleEditTagForm}>*/}
                                {/*    Edit Tag*/}
                                {/*</Button>{' '}*/}
                                <Button color="danger" onClick={this.toggleDeleteTagForm}>
                                    Delete Tag
                                </Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <div style={{width: '1rem'}}/>
                            <Col sm={{ size: '5' }}>
                                {this.state.tagTableIsLoaded && <TagTable tagTableData={this.state.tagTableData} />}
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
                        isOpen={this.state.showAddTagForm}
                        toggle={this.toggleAddTagForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleAddTagForm}>Add Tag:</ModalHeader>
                        <ModalBody>
                            <AddTagForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>

                    {/*<Modal*/}
                    {/*    isOpen={this.state.showEditTagForm}*/}
                    {/*    toggle={this.toggleEditTagForm}*/}
                    {/*    className={this.props.className}*/}
                    {/*    size="lg"*/}
                    {/*>*/}
                    {/*    <ModalHeader toggle={this.toggleEditTagForm}>Edit Tag:</ModalHeader>*/}
                    {/*    <ModalBody>*/}
                    {/*        <EditTagForm reloadHandler={this.reload} />*/}
                    {/*    </ModalBody>*/}
                    {/*</Modal>*/}

                    <Modal
                        isOpen={this.state.showDeleteTagForm}
                        toggle={this.toggleDeleteTagForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleDeleteTagForm}>Delete Tag:</ModalHeader>
                        <ModalBody>
                            <DeleteTagForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default AdminContainer;
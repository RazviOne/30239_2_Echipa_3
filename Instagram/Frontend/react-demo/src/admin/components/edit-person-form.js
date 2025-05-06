import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_USERS from "../api/people-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class EditPersonForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                userId:{
                    value: '',
                    placeholder: 'ID of user to be edited...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                username:{
                    value: '',
                    placeholder: 'Cool online identity...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                password: {
                    value: '',
                    placeholder: "Something that you don't forget and is hard to guess...",
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                name: {
                    value: '',
                    placeholder: 'What is your name?...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Str. Primaverii 21...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 10,
                        isRequired: true
                    }
                },
                age: {
                    value: '',
                    placeholder: 'Age...',
                    valid: false,
                    touched: false,
                },
                isAdmin: {
                    value: false,
                    placeholder: 'Are you an admin?',
                    valid: true,
                    touched: false,
                }
            }
        };
    }

    handleChange = event => {

        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        const updatedControls = { ...this.state.formControls };

        const updatedFormElement = { ...updatedControls[name] };

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let control in updatedControls) {
            formIsValid = updatedControls[control].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    fetchPersonById = () => {
        const personId = this.state.formControls.userId.value;
        // console.log(`fetchPersonById(${personId})`);

        if(!personId){
            alert('Please enter a valid user ID.');
            return;
        }

        return API_USERS.getPersonById(personId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully fetched person with id: " + personId);
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        username: { ...prevState.formControls.username, value: result.username, valid: true},
                        password: { ...prevState.formControls.password, value: result.password, valid: true},
                        name: { ...prevState.formControls.name, value: result.name, valid: true},
                        address: { ...prevState.formControls.address, value: result.address, valid: true},
                        age: { ...prevState.formControls.age, value: result.age, valid: true},
                        isAdmin: { ...prevState.formControls.isAdmin, value: result.isAdmin, valid: true},
                    }
                }));
            } else {
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        username: { ...prevState.formControls.username, value: '', valid: false},
                        password: { ...prevState.formControls.password, value: '', valid: false},
                        name: { ...prevState.formControls.name, value: '', valid: false},
                        address: { ...prevState.formControls.address, value: '', valid: false},
                        age: { ...prevState.formControls.age, value: '', valid: false},
                        isAdmin: { ...prevState.formControls.isAdmin, value: false, valid: false},
                    },
                    formIsValid: false,
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    updatePerson(person) {
        return API_USERS.editPerson(person, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully updated person with id: " + person.userId);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit = () => {
        let person = {
            userId: this.state.formControls.userId.value,
            username: this.state.formControls.username.value,
            password: this.state.formControls.password.value,
            name: this.state.formControls.name.value,
            address: this.state.formControls.address.value,
            age: this.state.formControls.age.value,
            isAdmin: this.state.formControls.isAdmin.value
        };

        // console.log(person);
        this.updatePerson(person);
    }

    render() {
        return (
            <div>

                <FormGroup id='userId'>
                    <Label for='userIdField'> ID: </Label>
                    <Input
                        name='userId'
                        id='userIdField'
                        type='number'
                        placeholder={this.state.formControls.userId.placeholder}
                        onChange={this.handleChange}
                        value={this.state.formControls.userId.value}
                        required
                    />

                    <Button onClick={this.fetchPersonById}>
                        Fetch Person
                    </Button>
                </FormGroup>

                <FormGroup id='username'>
                    <Label for='usernameField'> Username: </Label>
                    <Input name='username' id='usernameField' placeholder={this.state.formControls.username.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.username.value}
                           touched={this.state.formControls.username.touched? 1 : 0}
                           valid={this.state.formControls.username.valid}
                           required
                    />
                    {this.state.formControls.username.touched && !this.state.formControls.username.valid &&
                        <div className={"error-message row"}> * Username must have at least 1 characters </div>}
                </FormGroup>

                <FormGroup id='password'>
                    <Label for='passwordField'> Password: </Label>
                    <Input
                        name='password'
                        id='passwordField'
                        type='password'
                        placeholder={this.state.formControls.password.placeholder}
                        onChange={this.handleChange}
                        value={this.state.formControls.password.value}
                        touched={this.state.formControls.password.touched? 1 : 0}
                        valid={this.state.formControls.password.valid}
                        required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                        <div className={"error-message row"}> * Password must have at least 1 characters </div>}
                </FormGroup>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                        <div className={"error-message row"}> * Name must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                </FormGroup>

                <FormGroup id='age'>
                    <Label for='ageField'> Age: </Label>
                    <Input name='age' id='ageField' placeholder={this.state.formControls.age.placeholder}
                           min={0} max={100} type="number"
                           onChange={this.handleChange}
                           value={this.state.formControls.age.value}
                           touched={this.state.formControls.age.touched? 1 : 0}
                           valid={this.state.formControls.age.valid}
                           required
                    />
                </FormGroup>

                <FormGroup id='isAdmin'>
                    <Label for='isAdminField'> Is Admin: </Label>
                    <Input
                        name='isAdmin'
                        id='isAdminField'
                        type="checkbox"
                        checked={this.state.formControls.isAdmin.value}
                        onChange={this.handleChange}
                    >
                    </Input>
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button
                            type={"submit"}
                            disabled={!this.state.formIsValid}
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default EditPersonForm;
import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_PEOPLE from "../api/people-api";
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
                idPerson:{
                    value: '',
                    placeholder: 'ID of the person to be edited...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                name:{
                    value: '',
                    placeholder: 'Your name...',
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
                isAdmin: {
                    value: '',
                    placeholder: 'Are you an admin? (true/false)...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 4,
                        isRequired: true
                    }
                },
                email: {
                    value: '',
                    placeholder: 'Your personal email account...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                phoneNumber: {
                    value: '',
                    placeholder: 'Your personal phone number...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 10,
                        isRequired: true
                    }
                },
                birthDate: {
                    value: '',
                    placeholder: 'The date your were born...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                homeCity: {
                    value: '',
                    placeholder: 'Cluj-Napoca...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
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
        const idPerson = this.state.formControls.idPerson.value;
        console.log(`fetchPersonById(${idPerson})`);

        if(!idPerson){
            alert('Please enter a valid user ID.');
            return;
        }

        return API_PEOPLE.getPersonById(idPerson, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully fetched person with id: " + idPerson);
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        name: { ...prevState.formControls.name, value: result.name, valid: true},
                        username: { ...prevState.formControls.username, value: result.username, valid: true},
                        password: { ...prevState.formControls.password, value: result.password, valid: true},
                        isAdmin: { ...prevState.formControls.isAdmin, value: result.isAdmin, valid: true},
                        isBanned: { ...prevState.formControls.isBanned, value: result.isBanned, valid: true},
                        email: { ...prevState.formControls.email, value: result.email, valid: true},
                        phoneNumber: { ...prevState.formControls.phoneNumber, value: result.phoneNumber, valid: true},
                        birthDate: { ...prevState.formControls.birthDate, value: result.birthDate, valid: true},
                        homeCity: { ...prevState.formControls.homeCity, value: result.homeCity, valid: true},
                    }
                }));
            } else {
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        name: { ...prevState.formControls.name, value: '', valid: false},
                        username: { ...prevState.formControls.username, value: '', valid: false},
                        password: { ...prevState.formControls.password, value: '', valid: false},
                        isAdmin: { ...prevState.formControls.isAdmin, value: '', valid: false},
                        isBanned: { ...prevState.formControls.isBanned, value: '', valid: false},
                        email: { ...prevState.formControls.email, value: '', valid: false},
                        phoneNumber: { ...prevState.formControls.phoneNumber, value: '', valid: false},
                        birthDate: { ...prevState.formControls.birthDate, value: '', valid: false},
                        homeCity: { ...prevState.formControls.homeCity, value: '', valid: false},
                    },
                    formIsValid: false,
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    updatePerson(person) {
        return API_PEOPLE.editPerson(person, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated person with id: " + person.idPerson);
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
            personId: this.state.formControls.personId.value,
            name: this.state.formControls.name.value,
            username: this.state.formControls.username.value,
            password: this.state.formControls.password.value,
            userScore: 0,
            isAdmin: this.state.formControls.isAdmin.value,
            isBanned: this.state.formControls.isBanned.value,
            email: this.state.formControls.email.value,
            phoneNumber: this.state.formControls.phoneNumber.value,
            birthDate: this.state.formControls.birthDate.value,
            homeCity: this.state.formControls.homeCity.value
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
import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_PEOPLE from "../api/people-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class DeletePersonForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                idPerson:{
                    value: '',
                    placeholder: 'ID of the user that you want to delete...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }


    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    removePerson(idPerson) {
        return API_PEOPLE.deletePerson(idPerson, (result, status, error) => {
            if (result !== null && (status === 200 || status === 202)) {
                // console.log("Successfully deleted person:" +
                //     "\nusername: " + result.username +
                //     "\npassword: " + result.password +
                //     "\nname: " + result.name +
                //     "\naddress: " + result.address +
                //     "\nage: " + result.age +
                //     "\nisAdmin: " + result.isAdmin);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        // let personId = this.state.formControls.id.value;
        // console.log(personId);
        this.removePerson(this.state.formControls.idPerson.value);
    }

    render() {
        return (
            <div>

                <FormGroup id='idPerson'>
                    <Label for='idPersonField'> ID Person: </Label>
                    <Input name='idPerson' id='idPersonField' placeholder={this.state.formControls.idPerson.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.idPerson.value}
                           touched={this.state.formControls.idPerson.touched? 1 : 0}
                           valid={this.state.formControls.idPerson.valid}
                           required
                    />
                    {this.state.formControls.idPerson.touched && !this.state.formControls.idPerson.valid &&
                        <div className={"error-message row"}> * ID Person must have at least 1 characters </div>}
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
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

export default DeletePersonForm;
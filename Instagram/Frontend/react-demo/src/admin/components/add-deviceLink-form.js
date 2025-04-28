import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICELINKS from "../api/deviceLink-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class AddDeviceLinkForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                deviceId:{
                    value: '',
                    placeholder: 'The ID for the device you want to register...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                personId: {
                    value: '',
                    placeholder: 'The ID for the person you want to register the device for...',
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

    registerDeviceLink(deviceLink) {
        return API_DEVICELINKS.postDeviceLink(deviceLink, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully inserted deviceLink with id: " + result);
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
        let deviceLink = {
            deviceId: this.state.formControls.deviceId.value,
            personId: this.state.formControls.personId.value,
        };

        // console.log(deviceLink);
        this.registerDeviceLink(deviceLink);
    }

    render() {
        return (
            <div>

                <FormGroup id='deviceId'>
                    <Label for='deviceIdField'> Device ID: </Label>
                    <Input name='deviceId' id='deviceIdField' placeholder={this.state.formControls.deviceId.placeholder}
                           min={0} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.deviceId.value}
                           touched={this.state.formControls.deviceId.touched? 1 : 0}
                           valid={this.state.formControls.deviceId.valid}
                           required
                    />
                    {this.state.formControls.deviceId.touched && !this.state.formControls.deviceId.valid &&
                        <div className={"error-message row"}> * Device ID must have at least 1 characters </div>}
                </FormGroup>

                <FormGroup id='personId'>
                    <Label for='personIdField'> Person ID: </Label>
                    <Input name='personId' id='personIdField' placeholder={this.state.formControls.personId.placeholder}
                           min={0} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.personId.value}
                           touched={this.state.formControls.personId.touched? 1 : 0}
                           valid={this.state.formControls.personId.valid}
                           required
                    />
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}> Submit </Button>
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

export default AddDeviceLinkForm;
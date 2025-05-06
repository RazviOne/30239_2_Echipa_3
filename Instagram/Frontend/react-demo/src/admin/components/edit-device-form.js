import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICE from "../api/posts-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class EditDeviceForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                deviceId:{
                    value: '',
                    placeholder: 'ID of device to be edited...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                description:{
                    value: '',
                    placeholder: 'A description for your device...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: "The location of your device...",
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                mhec: {
                    value: '',
                    placeholder: 'What is the average hourly consumption of this device?...',
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

    fetchDeviceById = () => {
        const deviceId = this.state.formControls.deviceId.value;
        // console.log(`fetchPersonById(${deviceId})`);

        if(!deviceId){
            alert('Please enter a valid device ID.');
            return;
        }

        return API_DEVICE.getDeviceById(deviceId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully fetched device with id: " + deviceId);
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        description: { ...prevState.formControls.description, value: result.description, valid: true},
                        address: { ...prevState.formControls.address, value: result.address, valid: true},
                        mhec: { ...prevState.formControls.mhec, value: result.mhec, valid: true}
                    }
                }));
            } else {
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        description: { ...prevState.formControls.description, value: '', valid: false},
                        address: { ...prevState.formControls.address, value: '', valid: false},
                        mhec: { ...prevState.formControls.mhec, value: '', valid: false}
                    },
                    formIsValid: false,
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    updateDevice(device) {
        return API_DEVICE.editDevice(device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully updated device with id: " + device.deviceId);
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
        let device = {
            deviceId: this.state.formControls.deviceId.value,
            description: this.state.formControls.description.value,
            address: this.state.formControls.address.value,
            mhec: this.state.formControls.mhec.value
        };

        // console.log(device);
        this.updateDevice(device);
    }

    render() {
        return (
            <div>

                <FormGroup id='deviceId'>
                    <Label for='deviceIdField'> ID: </Label>
                    <Input
                        name='deviceId'
                        id='deviceIdField'
                        type='number'
                        placeholder={this.state.formControls.deviceId.placeholder}
                        onChange={this.handleChange}
                        value={this.state.formControls.deviceId.value}
                        required
                    />

                    <Button onClick={this.fetchDeviceById}>
                        Fetch Device
                    </Button>
                </FormGroup>

                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           value={this.state.formControls.description.value}
                           touched={this.state.formControls.description.touched? 1 : 0}
                           valid={this.state.formControls.description.valid}
                           required
                    />
                    {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                        <div className={"error-message row"}> * Description must have at least 1 characters </div>}
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

                <FormGroup id='mhec'>
                    <Label for='mhecField'> Average Hourly Consumption: </Label>
                    <Input name='mhec' id='mhecField' placeholder={this.state.formControls.mhec.placeholder}
                           min={0} type="number"
                           onChange={this.handleChange}
                           value={this.state.formControls.mhec.value}
                           touched={this.state.formControls.mhec.touched? 1 : 0}
                           valid={this.state.formControls.mhec.valid}
                           required
                    />
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

export default EditDeviceForm;
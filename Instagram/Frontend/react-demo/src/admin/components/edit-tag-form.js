import React from 'react';
import validate from "./validators/tag-validators";
import Button from "react-bootstrap/Button";
import * as API_TAGS from "../api/tags-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class EditTagForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                tagId:{
                    value: '',
                    placeholder: 'ID of device to be edited...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                name:{
                    value: '',
                    placeholder: 'The name of the tag...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 2,
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

    fetchTagById = () => {
        const tagId = this.state.formControls.tagId.value;
        // console.log(`fetchTagById(${tagId})`);

        if(!tagId){
            alert('Please enter a valid tag ID.');
            return;
        }

        return API_TAGS.getTagById(tagId, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully fetched tag with id: " + tagId);
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        name: { ...prevState.formControls.name, value: result.name, valid: true},
                    }
                }));
            } else {
                this.setState(prevState => ({
                    formControls: {
                        ...prevState.formControls,
                        name: { ...prevState.formControls.name, value: '', valid: false}
                    },
                    formIsValid: false,
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    updateTag(tag) {
        return API_TAGS.editTag(tag, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully updated tag with id: " + tag.tagId);
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
        let tag = {
            tagId: this.state.formControls.tagId.value,
            name: this.state.formControls.name.value,
        };

        this.updateTag(tag);
    }

    render() {
        return (
            <div>

                <FormGroup id='tagId'>
                    <Label for='tagIdField'> ID: </Label>
                    <Input
                        name='tagId'
                        id='tagIdField'
                        type='number'
                        placeholder={this.state.formControls.tagId.placeholder}
                        onChange={this.handleChange}
                        value={this.state.formControls.tagId.value}
                        required
                    />

                    <Button onClick={this.fetchTagById}>
                        Fetch Tag
                    </Button>
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
                        <div className={"error-message row"}> * Name must start with '#' and have at least 2 characters </div>}
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

export default EditTagForm;
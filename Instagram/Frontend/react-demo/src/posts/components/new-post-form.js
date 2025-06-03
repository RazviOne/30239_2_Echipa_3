import React from 'react';
import validate from "./validators/post-validators";
import Button from "react-bootstrap/Button";
import * as API_POSTS from "../../admin/api/posts-api";
import * as API_TAGS from "../../admin/api/tags-api";
import * as API_POSTTAGS from "../../admin/api/postTags-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label } from 'reactstrap';
import {UserContext} from "../../contexts/UserContext";



class NewPostForm extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            imageSource: null,
            image: null,
            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                title:{
                    value: '',
                    placeholder: 'The title of the post...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                text:{
                    value: '',
                    placeholder: 'Description for the post...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                tags: {
                    value: '',
                    placeholder: "Cool tags for your post...",
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 1,
                        isRequired: true
                    }
                },
                image: {
                    // value: '',
                    // placeholder: "Cool tags for your post...",
                    valid: true,
                    touched: false
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }

    async handleChange(event) {

        const name = event.target.name;
        const isFile = event.target.type === 'file';

        if(isFile){
            const file = event.target.files[0];
            let imageBase64 = null;

            if(file) {
                imageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                this.setState({
                    imageSource: "data:image/png;base64, " + imageBase64,
                    image: imageBase64
                });
            }
        }

        const value = isFile ? 'image' : event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = isFile ? true : validate(value, updatedFormElement.validationRules);
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

    createPostTag(postTag) {
        // console.log("Create new postTag: " + postTag);
        return API_POSTTAGS.postPostTag(postTag, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully registered postTag with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    createTag(tag, idPost) {
        // console.log("Create new tag with name: " + tag.name);
        return API_TAGS.postTag(tag, async(result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully registered tag with id: " + result);
                // console.log("Create new postTag for brand new tag");
                let postTag = {
                    idPost: idPost,
                    idTag: result
                };

                await this.createPostTag(postTag);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    processTags(tagNames, idPost) {
        tagNames.map(tagName => {
            // console.log("Find tag with name: " + tagName);
            API_TAGS.getTagByName(tagName, async(result, status, error) => {
                if (result.idTag !== -1 && (status === 200 || status === 201)) {
                    // console.log(result);
                    // console.log("Create new postTag");
                    let postTag = {
                        idPost: idPost,
                        idTag: result.idTag
                    };

                    await this.createPostTag(postTag);
                } else {
                    // console.log("Create new tag with name: " + tagName);
                    let newTag = {
                        name: "#" + tagName
                    };

                    await this.createTag(newTag, idPost);
                }
            });
        });

    }

    createPost(post) {
        return API_POSTS.postPost(post, async(result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // alert("Successfully registered post with id: " + result);
                let tagNames = this.state.formControls.tags.value.replaceAll("#", "").split(" ");
                await this.processTags(tagNames, result);
                // console.log("Created new tags and attached everything to new post");
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    async handleSubmit() {
        const { user } = this.context;

        let dateCreated = new Date();
        let dateCreatedString =
            dateCreated.getFullYear() +
            "-" +
            (dateCreated.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            dateCreated.getDate().toString().padStart(2, "0") +
            "T" +
            dateCreated.getHours().toString().padStart(2, "0") +
            ":" +
            dateCreated.getMinutes().toString().padStart(2, "0") +
            ":" +
            dateCreated.getSeconds().toString().padStart(2, "0");

        // const file = this.state.formControls.image.value;
        // let imageBase64 = null;
        //
        // if(file) {
        //     imageBase64 = await new Promise((resolve, reject) => {
        //         const reader = new FileReader();
        //         reader.onloadend = () => resolve(reader.result.split(',')[1]);
        //         reader.onerror = reject;
        //         reader.readAsDataURL(file);
        //     });
        // }

        let post = {
            idPerson: user.idPerson,
            idParent: null,
            title: this.state.formControls.title.value,
            text: this.state.formControls.text.value,
            dateCreated: dateCreatedString,
            status: "just posted",
            image: this.state.image,
            totalVotes: 0,
            noMoreComments: false
        };

        await this.createPost(post);

        this.reloadHandler();
    }

    render() {
        return (
            <div>

                <FormGroup id='title'>
                    <Label for='titleField'> Title: </Label>
                    <Input name='title' id='titleField' placeholder={this.state.formControls.title.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.title.value}
                           touched={this.state.formControls.title.touched? 1 : 0}
                           valid={this.state.formControls.title.valid}
                           required
                    />
                    {this.state.formControls.title.touched && !this.state.formControls.title.valid &&
                        <div className={"error-message row"}> * Title must have at least 1 character </div>}
                </FormGroup>

                <FormGroup id='text'>
                    <Label for='textField'> Text: </Label>
                    <Input name='text' id='textField' placeholder={this.state.formControls.text.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.text.value}
                           touched={this.state.formControls.text.touched? 1 : 0}
                           valid={this.state.formControls.text.valid}
                           required
                    />
                    {this.state.formControls.text.touched && !this.state.formControls.text.valid &&
                        <div className={"error-message row"}> * Text must have at least 1 character </div>}
                </FormGroup>

                <FormGroup id='tags'>
                    <Label for='tagsField'> Tags: </Label>
                    <Input name='tags' id='tagsField' placeholder={this.state.formControls.tags.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.tags.value}
                           touched={this.state.formControls.tags.touched? 1 : 0}
                           valid={this.state.formControls.tags.valid}
                           required
                    />
                    {this.state.formControls.tags.touched && !this.state.formControls.tags.valid &&
                        <div className={"error-message row"}> * Tags must have at least 2 characters </div>}
                </FormGroup>

                <FormGroup id='image'>
                    <Label for='imageField'> Image: </Label>
                    <Input name='image' id='imageField' placeholder={this.state.formControls.image.placeholder}
                           type="file"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.image.value}
                           touched={this.state.formControls.image.touched? 1 : 0}
                    />
                </FormGroup>

                {this.state.image && (
                    <img
                        src={this.state.imageSource}
                        alt="Post"
                        style={{
                            maxHeight: '10rem',
                            maxWidth: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}
                    />
                )}

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

export default NewPostForm;
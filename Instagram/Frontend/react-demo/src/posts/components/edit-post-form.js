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
import {postTag} from "../../admin/api/tags-api";



class EditPostForm extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            postId: props.children.postId,
            imageSource: null,
            image: null,
            idPerson: null,
            dateCreated: null,
            totalVotes: null,
            noMoreComments: false,
            oldTags: null,
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
                    value: '',
                    // placeholder: "Cool tags for your post...",
                    valid: true,
                    touched: false
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchPost();
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

    fetchPost(){
        API_POSTS.getPostById(this.state.postId, (result, status, error) => {
            if(result !== null && (status === 200 || status === 201)){
                // console.log('Fetched post with id: ' + this.state.postId)
                // console.log(result);

                API_POSTTAGS.getPostTagByPostId(this.state.postId, async(result2, status2, error2) => {
                    if(result2 !== null && (status2 === 200 || status2 === 201)){
                        // console.log('Fetched postTags with postId: ' + this.state.postId);
                        // console.log(result2);

                        const postTagPromises = result2.map(postTag =>
                            new Promise((resolve) => {
                                API_TAGS.getTagById(postTag.idTag, (result3, status3, error3) => {
                                    // console.log('Fetched tag with id: ' + postTag.idTag);
                                    // console.log(result3);
                                    if(result3 !== null && (status3 === 200 || status3 === 201)){
                                        resolve(result3.name);
                                    }
                                    else{
                                        resolve(null);
                                    }
                                });
                            })
                        );

                        const results = await Promise.all(postTagPromises);
                        const tags = results.filter(tagName => tagName !== null).toString().replaceAll(",", " ");
                        // console.log(tags);

                        this.setState((prevState) => ({
                            imageSource: "data:image/png;base64, " + result.image,
                            image: result.image,
                            idPerson: result.idPerson,
                            dateCreated: result.dateCreated,
                            totalVotes: result.totalVotes,
                            noMoreComments: result.noMoreComments,
                            oldTags: tags,
                            formControls: {
                                title: {...prevState.formControls.title, value: result.title, valid: true},
                                text: {...prevState.formControls.text, value: result.text, valid: true},
                                tags: {...prevState.formControls.tags, value: tags, valid: true},
                                image: {...prevState.formControls.image}
                            },
                            formIsValid: true
                        }));
                    }
                });
            }
        });
    }

    processTags(tagNames) {
        return new Promise((resolve, reject) => {
            let oldTagNames = this.state.oldTags.replaceAll("#", "").split(" ");
            let setCreateTags = new Set(tagNames);
            let setDeleteTags = new Set(oldTagNames);

            tagNames.forEach(tagName => {
                // console.log("Current tag: " + tagName);

                oldTagNames.map(oldTagName => {
                    // console.log("Old tag: " + oldTag);

                    if(tagName === oldTagName){
                        setCreateTags.delete(tagName);
                        setDeleteTags.delete(oldTagName);
                    }
                });
            });

            const promises = [];

            // console.log('Tags and PostTags to be created: ');
            setCreateTags.forEach(tagName => {
                const p = new Promise((res) => {
                    API_TAGS.getTagByName(tagName, (tag, status, error) => {
                        if(tag !== null && tag.idTag !== -1 && (status === 200 || status === 201)){
                            // console.log("Tag exists with id: " + tag.idTag);

                            let newPostTag = { idTag: tag.idTag, idPost: this.state.postId };
                            // console.log("PostTag to be created:");
                            // console.log(newPostTag);
                            API_POSTTAGS.postPostTag(newPostTag, () => {res()});
                        }
                        else{
                            let newTag = { name: "#" + tagName };
                            // console.log("Create new tag:");
                            // console.log(newTag);
                            API_TAGS.postTag(newTag, (tagId, status2, error2) => {
                                if(tagId !== null && (status2 === 200 || status2 === 201)){
                                    let newPostTag = { idTag: tagId, idPost: this.state.postId };
                                    // console.log("PostTag to be created:");
                                    // console.log(newPostTag);
                                    API_POSTTAGS.postPostTag(newPostTag, () => {res()});
                                }
                            });
                        }
                    })
                });

                promises.push(p);
            });

            // console.log('PostTags to be deleted: ');
            setDeleteTags.forEach(tagName => {
                const p = new Promise((res) => {
                    API_TAGS.getTagByName(tagName, (tag, status, error) => {
                        if(tag !== null && (status === 200 || status === 201)){
                            // console.log(tag);

                            API_POSTTAGS.getPostTagByPostId(this.state.postId, (postTags, status2, error2) => {
                                if(postTags !== null && (status2 === 200 || status2 === 201)){
                                    // console.log(postTags);
                                    const deletionPromises = postTags
                                        .filter(postTag => postTag.idTag === tag.idTag)
                                        .map(postTag => new Promise(r => API_POSTTAGS.deletePostTag(postTag.idPostTag, () => {r()})));
                                    Promise.all(deletionPromises).then(() => res());
                                }
                            });
                        }
                    })
                });

                promises.push(p);
            });

            Promise.all(promises).then(() => {
                resolve();
            });
        });
    }

    editPost(post) {
        return new Promise ((resolve, reject) => {API_POSTS.editPost(post, async(result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                // console.log("Successfully updated post with id: " + result);
                let tagNames = this.state.formControls.tags.value.replaceAll("#", "").split(" ");
                await this.processTags(tagNames);
                resolve();
                // console.log("Created new tags and attached everything to new post");
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
                reject(error);
            }
        })});
    }

    async handleSubmit() {
        let post = {
            idPost: this.state.postId,
            idPerson: this.state.idPerson,
            idParent: null,
            title: this.state.formControls.title.value,
            text: this.state.formControls.text.value,
            dateCreated: this.state.dateCreated,
            status: "just posted",
            image: this.state.image,
            totalVotes: this.state.totalVotes,
            noMoreComments: this.state.noMoreComments
        };

        // console.log(post);
        await this.editPost(post);

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
                    <Input name='image' id='imageField'
                           type="file"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.image.value}
                           touched={this.state.formControls.image.touched? 1 : 0}
                           valid={this.state.formControls.image.valid}
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

export default EditPostForm;
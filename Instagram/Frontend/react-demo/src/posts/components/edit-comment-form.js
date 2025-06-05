// src/posts/components/edit-comment-form.js
import React from 'react';
import Button from "react-bootstrap/Button";
import * as API_POSTS from "../../admin/api/posts-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row, FormGroup, Input, Label} from "reactstrap";

class EditCommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            postId: this.props.children.postId,
            post: null,
            imageSource: null,
            image: null,
            text: '',
            formIsValid: false,
            errorStatus: 0,
            error: null
        };

    }

    componentDidMount() {
        this.fetchComment();
    }


    async handleChange(event) {
        const { name, value, type, files } = event.target;

        if (type === 'file') {
            const file = files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                this.setState({
                    image: base64,
                    imageSource: reader.result
                }, this.validateForm);
            };
            reader.readAsDataURL(file);
        } else {
            this.setState({ [name]: value }, this.validateForm);
        }
    }

    validateForm = () => {
        const { text } = this.state;
        this.setState({ formIsValid: text.trim().length > 0 });
    };

    fetchComment() {
    API_POSTS.getPostById(this.state.postId, (result, status) => {
        if (result !== null && (status === 200 || status === 201)) {
            this.setState({
                post: result,
                text: result.text,
                image: result.image,
                imageSource: result.image ? "data:image/png;base64," + result.image : null,
                formIsValid: result.text.trim().length > 0
            });
        } else {
            this.setState({ errorStatus: status, error: "Cannot fetch comment" });
        }
    });
}


    handleSubmit = () => {
        const { post, text, image } = this.state;

        const updatedComment = {
            idPost: post.idPost,
            idPerson: post.idPerson,
            idParent: post.idParent,
            title: post.title || "Updated comment",
            text: text,
            dateCreated: post.dateCreated,
            status: "edited",
            image: image,
            totalVotes: post.totalVotes || 0,
            noMoreComments: post.noMoreComments || false
        };

        API_POSTS.updatePost(post.idPost, updatedComment, (result, status, error) => {
            if ((status === 200 || status === 201) && result.idPost !== -1) {
                this.reloadHandler();
            } else {
                this.setState({ errorStatus: status, error });
            }
        });
    };


    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="text">Comment Text</Label>
                    <Input
                        type="textarea"
                        name="text"
                        id="text"
                        value={this.state.text}
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="image">Image</Label>
                    <Input
                        type="file"
                        name="image"
                        id="image"
                        onChange={(e) => this.handleChange(e)}
                    />
                </FormGroup>

                {this.state.imageSource && (
                    <img
                        src={this.state.imageSource}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '1rem' }}
                    />
                )}

                <Row>
                    <Col sm={{ size: '4', offset: 8 }}>
                        <Button
                            color="primary"
                            onClick={this.handleSubmit}
                            disabled={!this.state.formIsValid}
                        >
                            Update Comment
                        </Button>
                    </Col>
                </Row>

                {this.state.errorStatus > 0 && (
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />
                )}
            </div>
        );
    }
}

export default EditCommentForm;

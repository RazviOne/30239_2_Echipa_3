import React from 'react';
import { Button, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import { UserContext } from '../../contexts/UserContext';
import * as API_POSTS from '../../admin/api/posts-api';

class NewCommentForm extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      image: null,
      imageSource: null,
      formIsValid: false,
    };
  }

  handleChange = async (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file') {
      const file = files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        this.setState({ image: base64, imageSource: reader.result }, this.validateForm);
      };
      reader.readAsDataURL(file);
    } else {
      this.setState({ [name]: value }, this.validateForm);
    }
  };

  validateForm = () => {
    const { text, image } = this.state;
    this.setState({ formIsValid: text.length > 0 && image !== null });
  };

  handleSubmit = async () => {
    const { user } = this.context;
    const { postId, reloadComments } = this.props;

    const now = new Date();
    const dateCreated = now.toISOString().slice(0, 19);

    const comment = {
      idPerson: user.idPerson,
      idParent: postId,
      title: '[Comment]',
      text: this.state.text,
      dateCreated,
      status: 'comment',
      image: this.state.image,
      totalVotes: 0,
      noMoreComments: false
    };

    API_POSTS.postPost(comment, (res, status) => {
      if (status === 200 || status === 201) {
        this.setState({ text: '', image: null, imageSource: null, formIsValid: false });

        API_POSTS.getPostById(postId, (postResult, getStatus) => {
          if (postResult && getStatus === 200 && postResult.status.toLowerCase() === 'just posted') {
            const updatedPost = {
              ...postResult,
              status: 'first reactions'
            };

            API_POSTS.updatePost(postId, updatedPost, (updateRes, updateStatus) => {
              if (updateStatus === 200 || updateStatus === 204) {
                console.log("Status updated to 'first reactions'");
              }
              reloadComments();
            });
          } else {
            reloadComments(); 
          }
        });
      } else {
        alert('Error submitting comment.');
      }
    });
  };

  render() {
    return (
      <div style={{ marginTop: '2rem' }}>
        <h5>New Comment:</h5>

        <FormGroup>
          <Label for='text'>Text</Label>
          <Input
            type='textarea'
            name='text'
            id='text'
            value={this.state.text}
            onChange={this.handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for='image'>Image (required)</Label>
          <Input
            type='file'
            name='image'
            id='image'
            onChange={this.handleChange}
            required
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
              type='submit'
              color='primary'
              disabled={!this.state.formIsValid}
              onClick={this.handleSubmit}
            >
              Submit Comment
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewCommentForm;

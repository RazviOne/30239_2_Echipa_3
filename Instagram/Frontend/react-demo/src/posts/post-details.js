import React from 'react';
import * as API_POSTS from '../admin/api/posts-api';
import * as API_USERS from '../admin/api/people-api';
import * as API_POSTTAGS from '../admin/api/postTags-api'
import * as API_TAGS from '../admin/api/tags-api'
import {Card, CardBody, CardText, Button, Row, Col, ModalHeader, ModalBody, Modal} from 'reactstrap';
import NavigationBar from '../navigation-bar';
import { UserContext } from '../contexts/UserContext';
import DeletePostNotification from "./components/delete-post-notification";
import EditPostForm from "./components/edit-post-form";

class PostDetails extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.handlePostDelete = this.handlePostDelete.bind(this);
        this.dismissDeletePostNotification = this.dismissDeletePostNotification.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.toggleEditPostForm = this.toggleEditPostForm.bind(this);
        this.reload = this.reload.bind(this);

        this.state = {
            postId: null,
            post: null,
            postTags: [],
            username: 'Utilizator necunoscut',
            imageSource: null,
            deleteNotification: false,
            showEditPostForm: false
        }
    }

    async componentDidMount() {
        // this.protectRoute();
        let urlLength = window.location.href.length;
        // console.log(urlLength);
        let postId = parseInt(window.location.href.toString().substring(urlLength - 2));
        // console.log(postId);
        await this.setState({
            postId: postId
        })

        this.fetchPost();
    }

    toggleEditPostForm(){
        this.setState({ showEditPostForm: !this.state.showEditPostForm });
    }

    dismissDeletePostNotification(){
        this.setState({
            deleteNotification: false
        })
    }

    fetchTags(id) {
        return new Promise((resolve, reject) => {
            API_POSTTAGS.getPostTagByPostId(id, (result, status, error) => {
                if (status === 200 && result) {
                    const tagPromises = result.map(result =>
                        new Promise((resTag) => {
                            API_TAGS.getTagById(result.idTag, (tagResult, tagStatus) => {
                                if (tagStatus === 200 && tagResult) {
                                    resTag(tagResult.name);
                                } else {
                                    resTag(null);
                                }
                            });
                        })
                    );

                    Promise.all(tagPromises).then(names => {
                        resolve(names.filter(name => name !== null));
                    });
                } else {
                    resolve([]);
                }
            });
        });
    };

    fetchPost() {
        // console.log("Postarea curenta cu id: " + this.state.postId)
        API_POSTS.getPostById(this.state.postId, (result, status) => {
            if (result !== null && status === 200) {
                // console.log(result);
                this.setState({
                    post: result,
                    imageSource: "data:image/png;base64, " + result.image
                });

                API_USERS.getPersonById(result.idPerson, (res, stat) => {
                    if (res !== null && stat === 200) {
                        this.setState({
                            username: res.username
                        });
                    }
                });

                this.fetchTags(this.state.postId).then((tags) => {
                    if (tags.length !== 0) {
                        this.setState({
                           postTags: tags
                        });
                    }
                });
            }
        });
    }

    deletePost(){
        API_POSTS.deletePost(this.state.postId, () => {});
        this.props.history.push('/home');
    }

    handlePostDelete(){
         this.setState({
             deleteNotification: true
         });
    }

    // const timeAgo = (dateString) => {
    //   const postDate = new Date(dateString);
    //   const now = new Date();
    //   const diffMs = now - postDate;
    //
    //   const diffMinutes = Math.floor(diffMs / (1000 * 60));
    //   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    //   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    //
    //   if (diffMinutes < 1) return 'chiar acum';
    //   if (diffMinutes < 60) return `${diffMinutes}m ago`;
    //   if (diffHours < 24) return `${diffHours}h ago`;
    //   if (diffDays < 7) return `${diffDays}d ago`;
    //   return postDate.toLocaleDateString('ro-RO');
    // };

    reload() {
        this.setState({
            showEditPostForm: false // hide first
        }, () => {
            // reload state AFTER modal is hidden
            this.setState({
                post: null,
                postTags: [],
                username: 'Utilizator necunoscut',
                imageSource: null,
                deleteNotification: false
            });

            this.fetchPost();
        });
    }

    render() {
        const { user } = this.context;

        return (
            <div>
                <NavigationBar/>
                {!this.state.post ? (
                    <div>Se incarca postarea...</div>
                ) : (
                <div>
                    <div>
                        {this.state.deleteNotification && (
                            <DeletePostNotification
                                onClose={this.dismissDeletePostNotification}
                                deletePost={this.deletePost}
                            />
                        )}
                    </div>
                    <div style={{padding: '2rem 20%'}}>
                        <Card>
                            <CardBody>
                                {/* Username și timpul postării */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}>
                                    <div>{this.state.username}</div>
                                    <div style={{fontSize: '0.9rem', color: 'gray'}}>
                                        {new Date(this.state.post.dateCreated).toLocaleString()} • {this.state.post.status || 'fără status'}
                                    </div>
                                </div>


                                {/* Imaginea postării */}
                                {this.state.imageSource && (
                                    <img
                                        src={this.state.imageSource}
                                        alt="Post"
                                        style={{
                                            width: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}
                                    />
                                )}

                                {/* Detalii */}
                                <CardText><strong>Title:</strong> {this.state.post.title}</CardText>
                                <CardText><strong>Description:</strong> {this.state.post.text}</CardText>
                                <CardText>
                                    <strong>Tags:</strong>{' '}
                                    {this.state.postTags.length !== 0 ? this.state.postTags
                                            .sort((a, b) => a.localeCompare(b))
                                            .map((tag, index) => (
                                            <span key={index} style={{
                                                marginRight: '8px',
                                                background: '#eee',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>
                            {tag}
                        </span>
                                        ))
                                        : 'N/A'}
                                </CardText>
                                <CardText><strong>Scor aprecieri:</strong> {this.state.post.totalVotes}</CardText>

                                <Row>
                                    <Col>
                                        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                            <Button color="success" onClick={() => alert('Liked!')}>Like</Button>
                                            <Button color="danger" onClick={() => alert('Disliked!')}>Dislike</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        {this.state.post.idPerson === user.idPerson && (
                                        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end'}}>
                                            <Button color="secondary" onClick={this.toggleEditPostForm}>Edit</Button>
                                            <Button color="danger" onClick={this.handlePostDelete}>Delete</Button>
                                        </div>
                                        )}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Modal
                            isOpen={this.state.showEditPostForm}
                            toggle={this.toggleEditPostForm}
                            className={this.props.className}
                            size="lg"
                        >
                            <ModalHeader toggle={this.toggleEditPostForm}>Edit Post:</ModalHeader>
                            <ModalBody>
                                <EditPostForm children={{postId: this.state.postId}} reloadHandler={this.reload} />
                            </ModalBody>
                        </Modal>
                    </div>
                </div>
                    )}
            </div>
        );
    }
}

export default PostDetails;

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
import * as API_REACTIONS from '../admin/api/reactions-api';
import NewCommentForm from './components/new-comment-form';

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
            showEditPostForm: false,
            comments: [],
            commentReactions: {}

        }
    }

    async componentDidMount() {
        const url = window.location.pathname;
        const segments = url.split('/');
        const postId = parseInt(segments[segments.length - 1]);

        if (!isNaN(postId)) {
            await this.setState({ postId });
            this.fetchPost();
            this.fetchComments();
        } else {
            console.error('ID post invalid:', postId);
        }
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
        if (!this.state.postId) {
            console.error('Post ID invalid.');
            return;
        }

        API_POSTS.getPostById(this.state.postId, (result, status) => {
            if (result !== null && status === 200) {
                this.setState({
                    post: result,
                    imageSource: "data:image/png;base64, " + result.image
                }, () => {
                    this.updateVotesCount();
                });

                API_USERS.getPersonById(result.idPerson, (res, stat) => {
                    if (res !== null && stat === 200) {
                        this.setState({ username: res.username });
                    }
                });

                this.fetchTags(this.state.postId).then((tags) => {
                    if (tags.length !== 0) {
                        this.setState({ postTags: tags });
                    }
                });
            }
        });
    }


    fetchCommentAuthors(comments) {
        const userIds = [...new Set(comments.map(c => c.idPerson))]; // elimină duplicatele

        const promises = userIds.map(id =>
            new Promise(resolve => {
                API_USERS.getPersonById(id, (res, stat) => {
                    if (res !== null && stat === 200) {
                        resolve({ id, username: res.username });
                    } else {
                        resolve({ id, username: "Unknown user" });
                    }
                });
            })
        );

        return Promise.all(promises).then(results => {
            const userMap = {};
            results.forEach(({ id, username }) => {
                userMap[id] = username;
            });
            return userMap;
        });
    }


    fetchCommentReactions(comments) {
        API_REACTIONS.getReactions((allReactions, status) => {
            if (status === 200 && Array.isArray(allReactions)) {
                const reactionMap = {};

                comments.forEach(comment => {
                    const relevant = allReactions.filter(r => r.idPost === comment.idPost);
                    const total = relevant.reduce((acc, r) => acc + (r.isLiked ? 1 : -1), 0);
                    reactionMap[comment.idPost] = total;
                });

                this.setState({ commentReactions: reactionMap });
            }
        });
    }

    handleLikeComment = (commentId, commentAuthorId) => {
        const { user } = this.context;

        if (!user || user.idPerson === commentAuthorId) {
            alert("You can't vote on your own comment.");
            return;
        }

        API_REACTIONS.getReactions((reactions, status) => {
            if (status === 200) {
                const existing = reactions.find(r => r.idPerson === user.idPerson && r.idPost === commentId);

                if (existing && existing.isLiked === true) {
                    API_REACTIONS.deleteReaction(existing.idReaction, () => this.fetchComments());
                } else if (existing) {
                    const payload = { idPerson: user.idPerson, idPost: commentId, isLiked: true };
                    API_REACTIONS.updateReaction(existing.idReaction, payload, () => this.fetchComments());
                } else {
                    const payload = { idPerson: user.idPerson, idPost: commentId, isLiked: true };
                    API_REACTIONS.postReaction(payload, () => this.fetchComments());
                }
            }
        });
    };

    handleDislikeComment = (commentId, commentAuthorId) => {
        const { user } = this.context;

        if (!user || user.idPerson === commentAuthorId) {
            alert("You can't vote on your own comment.");
            return;
        }

        API_REACTIONS.getReactions((reactions, status) => {
            if (status === 200) {
                const existing = reactions.find(r => r.idPerson === user.idPerson && r.idPost === commentId);

                if (existing && existing.isLiked === false) {
                    API_REACTIONS.deleteReaction(existing.idReaction, () => this.fetchComments());
                } else if (existing) {
                    const payload = { idPerson: user.idPerson, idPost: commentId, isLiked: false };
                    API_REACTIONS.updateReaction(existing.idReaction, payload, () => this.fetchComments());
                } else {
                    const payload = { idPerson: user.idPerson, idPost: commentId, isLiked: false };
                    API_REACTIONS.postReaction(payload, () => this.fetchComments());
                }
            }
        });
    };

    fetchComments() {
        API_POSTS.getPosts((result, status) => {
            if (result !== null && status === 200) {
                const comments = result.filter(post => post.idParent === this.state.postId);

                this.fetchCommentAuthors(comments).then(userMap => {
                    const commentsWithUsers = comments.map(comment => ({
                        ...comment,
                        username: userMap[comment.idPerson] || 'Unknown'
                    }));

                    this.setState({ comments: commentsWithUsers }, () => {
                        this.fetchCommentReactions(commentsWithUsers);
                    });
                });
            } else {
                this.setState({ comments: [] });
            }
        });
    }

    deletePost(){
        API_POSTS.deletePost(this.state.postId, () => {});
        this.props.history.push('/home');
    }

    handlePostDelete(){
        this.setState({ deleteNotification: true });
    }

    updateVotesCount() {
        const { postId } = this.state;

        API_REACTIONS.getReactions((allReactions, status) => {
            if (status === 200 && Array.isArray(allReactions)) {
            const relevant = allReactions.filter(r => r.idPost === postId);
            const totalVotes = relevant.reduce((acc, r) => acc + (r.isLiked ? 1 : -1), 0);

            this.setState(prev => ({
                post: {
                ...prev.post,
                totalVotes: totalVotes
                }
            }));
            }
        });
    }

    handleLike = () => {
        const { user } = this.context;
        const { postId, post } = this.state;

        if (!user || !user.idPerson || !post) return;

        if (user.idPerson === post.idPerson) {
            alert("You can't vote on your own post.");
            return;
        }

        API_REACTIONS.getReactions((allReactions, status) => {
            if (status === 200 && Array.isArray(allReactions)) {
                const existing = allReactions.find(
                    r => r.idPerson === user.idPerson && r.idPost === postId
                );

                if (existing && existing.isLiked === true) {
                    API_REACTIONS.deleteReaction(existing.idReaction, () => {
                        // alert("Like removed.");
                        this.fetchPost();
                    });
                } else if (existing) {
                    const payload = {
                        idPerson: user.idPerson,
                        idPost: postId,
                        isLiked: true,
                    };

                    API_REACTIONS.updateReaction(existing.idReaction, payload, () => {
                        alert("Reaction changed to Like.");
                        this.fetchPost();
                    });
                } else {
                    const payload = {
                        idPerson: user.idPerson,
                        idPost: postId,
                        isLiked: true,
                    };

                    API_REACTIONS.postReaction(payload, () => {
                        //   alert("Liked.");
                          this.fetchPost();
                    });
                }
            }
        });
    };


    handleDislike = () => {
        const { user } = this.context;
        const { postId, post } = this.state;

        if (!user || !user.idPerson || !post) return;

        if (user.idPerson === post.idPerson) {
            alert("You can't vote on your own post.");
            return;
        }

        API_REACTIONS.getReactions((allReactions, status) => {
            if (status === 200 && Array.isArray(allReactions)) {
                const existing = allReactions.find(
                    r => r.idPerson === user.idPerson && r.idPost === postId
                );

                if (existing && existing.isLiked === false) {
                    API_REACTIONS.deleteReaction(existing.idReaction, () => {
                        //   alert("Dislike removed.");
                          this.fetchPost();
                    });
                } else if (existing) {
                    const payload = {
                        idPerson: user.idPerson,
                        idPost: postId,
                        isLiked: false,
                    };

                    API_REACTIONS.updateReaction(existing.idReaction, payload, () => {
                        alert("Reaction changed to Dislike.");
                        this.fetchPost();
                    });
                } else {
                    const payload = {
                        idPerson: user.idPerson,
                        idPost: postId,
                        isLiked: false,
                    };

                    API_REACTIONS.postReaction(payload, () => {
                        //   alert("Disliked.");
                        this.fetchPost();
                    });
                }
            }
        });
    };

    handleStopComments = () => {
        const updatedPost = {
            ...this.state.post,
            noMoreComments: true,
            status: "outdated"
        };

        API_POSTS.updatePost(this.state.post.idPost, updatedPost, (result, status, err) => {
            if ((status === 200 || status === 201) && result.idPost !== -1) {
                this.setState({ post: result });
                alert("Comments have been disabled for this post.");
            } else {
                alert("Failed to disable comments.");
            }
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
            showEditPostForm: false
        }, () => {
            this.setState({
                post: null,
                postTags: [],
                username: 'Utilizator necunoscut',
                imageSource: null,
                deleteNotification: false
            });

            this.fetchPost();
            this.fetchComments();
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
                                {/* Autor și data */}
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
                                        {new Date(this.state.post.dateCreated).toLocaleString()} • {this.state.post.status || 'No status'}
                                    </div>
                                </div>

                                {/* Imagine */}
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

                                {/* Conținut */}
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

                                {/* Voturi */}
                                <CardText><strong>Votes:</strong> {this.state.post.totalVotes}</CardText>

                                {/* Like / Dislike */}
                                <Row>
                                    <Col>
                                        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                            <Button color="success" onClick={this.handleLike}>Like</Button>
                                            <Button color="danger" onClick={this.handleDislike}>Dislike</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        {this.state.post.idPerson === user.idPerson && (
                                            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end'}}>
                                                <Button color="secondary" onClick={this.toggleEditPostForm}>Edit</Button>
                                                <Button color="danger" onClick={this.handlePostDelete}>Delete</Button>
                                                {!this.state.post.noMoreComments && (
                                                    <Button color="warning" onClick={this.handleStopComments}>Stop Comments</Button>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </CardBody>

                            {/* Separator și formular comentariu */}
                            <hr style={{margin: '0 1rem'}} />
                            <div style={{padding: '1rem'}}>
                                <h5>Add a comment</h5>
                                {!this.state.post.noMoreComments ? (
                                    <NewCommentForm postId={this.state.postId} reloadComments={this.fetchPost} />
                                    ) : (
                                    <p style={{ marginTop: '1rem', color: 'gray' }}>Comments are disabled for this post.</p>
                                    )}
                            </div>
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
                        {this.state.comments.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <h5>Comments</h5>
                                {this.state.comments
                                .sort((a, b) => (this.state.commentReactions[b.idPost] || 0) - (this.state.commentReactions[a.idPost] || 0))
                                .map((comment) => (

                                    <Card key={comment.idPost} style={{ marginTop: '1rem', padding: '1rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem',
                                            fontWeight: 'bold',
                                            fontSize: '0.95rem'
                                        }}>
                                            <span>{comment.username}</span>
                                            <span style={{ color: 'gray' }}>
                                                {new Date(comment.dateCreated).toLocaleString()} • {comment.status || 'No status'}
                                            </span>
                                        </div>

                                        {comment.image && (
                                            <img
                                                src={`data:image/png;base64, ${comment.image}`}
                                                alt="Comment"
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '300px',
                                                    objectFit: 'cover',
                                                    marginBottom: '1rem',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        )}

                                        <CardText>{comment.text}</CardText>
                                        <CardText>
                                            <strong>Votes:</strong> {this.state.commentReactions[comment.idPost] || 0}
                                        </CardText>

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                            <Button
                                                color="success"
                                                size="sm"
                                                onClick={() => this.handleLikeComment(comment.idPost, comment.idPerson)}
                                            >
                                                Like
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => this.handleDislikeComment(comment.idPost, comment.idPerson)}
                                            >
                                                Dislike
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
                    )}
            </div>
        );
    }
}

export default PostDetails;

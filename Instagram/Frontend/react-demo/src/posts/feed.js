import React from 'react';
import { UserContext } from '../contexts/UserContext';
import * as API_POSTS from '../admin/api/posts-api';
import * as API_USERS from '../admin/api/people-api';
import { calculateUserScores } from '../utils/score-utils';
import * as API_REACTIONS from '../admin/api/reactions-api';

import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    ModalHeader,
    ModalBody,
    Modal,
    Dropdown,
    DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Input
} from 'reactstrap';
// import LogoImg from '../commons/images/Instagram_login_Logo.png';
// import UserImg from '../commons/images/user.png';
import NavigationBar from "../navigation-bar";
// import RegisterPersonForm from "../login/components/register-person-form";
import NewPostForm from "./components/new-post-form";
import * as API_POSTTAGS from "../admin/api/postTags-api";
import * as API_TAGS from "../admin/api/tags-api";
import {post} from "axios";

class Feed extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.toggleNewPostForm = this.toggleNewPostForm.bind(this);
        this.toggleUsernamesDropdown = this.toggleUsernamesDropdown.bind(this);
        this.handleTitleFilter = this.handleTitleFilter.bind(this);
        this.handleTagFilter = this.handleTagFilter.bind(this);
        this.reload = this.reload.bind(this);

        this.state = {
            posts: [],
            usernames: [],
            postTags: [],
            showNewPostForm: false,
            usernamesDropdownIsOpen: false,
            postFilterPersonId: 0,
            titleFilter: '',
            tagFilter: '',
            errorMessage: '',
            errorStatus: 0,
            userScores: {}
        };

        this.showPostsFromUser = this.showPostsFromUser.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    fetchAllPostsAndReactions = () => {
    API_POSTS.getPosts((posts, status1) => {
        if (status1 === 200 && posts) {
            API_REACTIONS.getReactions((reactions, status2) => {
                if (status2 === 200 && reactions) {
                    const scores = calculateUserScores(posts, reactions);
                    this.setState({ userScores: scores });
                }
            });
        }
    });
}


    componentDidMount() {
        // this.protectRoute();
        this.fetchPosts();
        this.fetchUsernames();
        this.fetchAllPostsAndReactions();
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value, errorMessage: '' });
    }

    handleTitleFilter(event) {
        const { name, value } = event.target;
        // console.log("Name: " + name);
        // console.log("Value: " + value);
        this.setState({
            titleFilter: value
        });
    }

    handleTagFilter(event) {
        const { name, value } = event.target;
        console.log("Name: " + name);
        console.log("Value: " + value);
        this.setState({
            tagFilter: value
        });
    }

    toggleNewPostForm() {
        this.setState({ showNewPostForm: !this.state.showNewPostForm });
    }

    toggleUsernamesDropdown(){
        this.setState({ usernamesDropdownIsOpen: !this.state.usernamesDropdownIsOpen });
    }

    showPostsFromUser(e){
        // console.log(e.target.value);
        this.setState({ postFilterPersonId: parseInt(e.target.value) });
        this.reload();
    }

    fetchTags(id) {
        return new Promise((resolve, reject) => {
            API_POSTTAGS.getPostTagByPostId(id, (result, status, error) => {
                if (status === 200 && result) {
                    const tagPromises = result.map(postTag =>
                        new Promise((resTag) => {
                            API_TAGS.getTagById(postTag.idTag, (tagResult, tagStatus) => {
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

    fetchPosts(){
        API_POSTS.getPosts(async (result, status, error) => {
            if (result !== null && status === 200) {
                this.setState({ posts: result });

                const tagPromises = result.map(async (post) => {
                    const tags = await this.fetchTags(post.idPost);
                    return {
                        postId: post.idPost,
                        tags: tags.length > 0 ? tags : ['N/A']
                    };
                });

                const tagResults = await Promise.all(tagPromises);

                const postTags = {};
                tagResults.forEach(({postId, tags}) => {
                    postTags[postId] = tags;
                });

                this.setState({ postTags: postTags });
            } else {
                console.error("Eroare la obținerea postărilor:", error);
            }
        });
    };

    fetchUsernames(){
        API_USERS.getPersons((result, status, error) => {
            if(result !== null && (status === 200 || status === 201)){
                // console.log(result);
                result.forEach(username => {
                    this.setState((prevState) => ({
                        usernames: [...prevState.usernames,
                            {id: username.idPerson, username: username.username}
                        ]
                    }));
                })
            }
        });
    }

    timeAgo(dateString){
        const postDate = new Date(dateString);
        const now = new Date();
        const diffMs = now - postDate;

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return 'chiar acum';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return postDate.toLocaleDateString('ro-RO'); // dacă e mai vechi de o săptămână, afișăm data
    }

    // handleNewPost(){
    //     this.reload();
    // }

    async reload(){
        this.setState({
            posts: [],
            usernames: [],
            showNewPostForm: false,
        });

        await this.fetchPosts();
        await this.fetchUsernames();
    }

    render(){
    return (
            <div>
                <NavigationBar/>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1rem 10%',
                        backgroundColor: '#fafafa',
                        minHeight: '100vh'
                    }}
                >
                    {/* FEED */}
                    <Row>
                        <Col>
                            <Button
                                color="success"
                                onClick={this.toggleNewPostForm}
                            >
                                New Post
                            </Button>
                        </Col>
                        <Col>
                            <Dropdown
                                isOpen={this.state.usernamesDropdownIsOpen}
                                toggle={this.toggleUsernamesDropdown}
                                direction="down"
                            >
                                <DropdownToggle color="primary" caret>Username </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem key="0" value="0" onClick={this.showPostsFromUser}>All Users</DropdownItem>
                                    {Object.values(this.state.usernames)
                                        .sort((a, b) => a.username.localeCompare(b.username))
                                        .map((obj) => (
                                            <DropdownItem key={obj.id} value={obj.id} onClick={this.showPostsFromUser}>{obj.username}</DropdownItem>
                                        ))}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Input name='titleFilter' id='titleFilterField' placeholder="Filter post's title..."
                                   onChange={this.handleTitleFilter}
                                   defaultValue=""
                                   bsSize="sm"
                            />
                        </Col>
                        <Col>
                            <Input name='tagFilter' id='tagFilterField' placeholder="Filter posts by tags..."
                                   onChange={this.handleTagFilter}
                                   defaultValue=""
                                   bsSize="sm"
                            />
                        </Col>
                    </Row>

                    <Modal
                        isOpen={this.state.showNewPostForm}
                        toggle={this.toggleNewPostForm}
                        className={this.props.className}
                        size="lg"
                    >
                        <ModalHeader toggle={this.toggleNewPostForm}>Create Post:</ModalHeader>
                        <ModalBody>
                            <NewPostForm reloadHandler={this.reload} />
                        </ModalBody>
                    </Modal>

                    <div style={{height: "1rem"}}/>

                    {this.state.posts.length === 0 && <p>Nu există postări momentan.</p>}

                    {this.state.posts
                        .filter(post => !post.idParent) 
                        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
                        .filter(post => {
                            if (this.state.postFilterPersonId === 0) return true;
                            return post.idPerson === this.state.postFilterPersonId;
                        })
                        .filter(post => {
                            if(this.state.titleFilter === '') return true;
                            // console.log("Titlu postare: " + post.title.toUpperCase());
                            // console.log("Filtru postare: " + this.state.titleFilter.toUpperCase());
                            return post.title.toUpperCase().includes(this.state.titleFilter.toUpperCase());
                        })
                        .filter(post => {
                            // console.log("Tag filter: " + this.state.tagFilter.toUpperCase());
                            if(this.state.tagFilter === '') return true;
                            if(this.state.postTags[post.idPost] === undefined) return true;

                            for(let i = 0; i < this.state.postTags[post.idPost].length; i++){
                                // console.log('Post: ' + post.title + '\nTag: ' + this.state.postTags[post.idPost][i].toUpperCase());
                                if(this.state.postTags[post.idPost][i].toString().toUpperCase()
                                    .includes(this.state.tagFilter.toString().toUpperCase())) return true;
                            }

                            return false;
                        })
                        .map((post, idx) => {
                            let imageSource = "";
                            if (post.image !== undefined &&
                                post.image !== null) {
                                imageSource = "data:image/png;base64, " + post.image;
                            }

                            return (
                                <Card
                                    key={idx}
                                    onClick={() => window.location.href = `/post/${post.idPost}`}
                                    style={{
                                        marginBottom: '2rem',
                                        padding: '1rem',
                                        maxWidth: '45rem',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <CardBody style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                        <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>
                                            {this.state.usernames.find(username => username.id === post.idPerson)?.username}
                                            <span style={{
                                                color: 'gray',
                                                fontSize: '0.9rem'
                                            }}>
                                                • {this.timeAgo(post.dateCreated)} • Score: {this.state.userScores[post.idPerson] || 0}
                                            </span>
                                        </div>
                                        {imageSource && (
                                            <img
                                                src={imageSource}
                                                alt="Post"
                                                style={{
                                                    maxHeight: '40rem',
                                                    maxWidth: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginBottom: '1rem'
                                                }}
                                            />
                                        )}

                                        <CardTitle tag="h5" style={{marginBottom: '0.5rem'}}>
                                            {post.title}
                                        </CardTitle>
                                        <CardText>{post.text}</CardText>
                                        <CardText>
                                            <strong>Tags:</strong>{' '}
                                            {this.state.postTags[post.idPost] !== undefined && (
                                                this.state.postTags[post.idPost][0] === 'N/A' ? (
                                                    <span key="post.idPost" style={{
                                                        marginRight: '8px',
                                                        background: '#eee',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {this.state.postTags[post.idPost]}
                                                    </span>
                                                ) : (
                                                    this.state.postTags[post.idPost].map((tag, index) => (
                                                        <span key={`${post.idPost}-${index}`} style={{
                                                            marginRight: '8px',
                                                            background: '#eee',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            {tag}
                                                        </span>
                                                    ))
                                                )
                                            )}
                                        </CardText>
                                    </CardBody>
                                </Card>
                            )
                        })}
                </div>
            </div>
        )
    };
}

export default Feed;
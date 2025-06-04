import React from 'react';
import { UserContext } from '../contexts/UserContext';
import * as API_POSTS from '../admin/api/posts-api';
import * as API_USERS from '../admin/api/people-api';
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
    DropdownToggle, DropdownMenu, DropdownItem, Row, Col
} from 'reactstrap';
// import LogoImg from '../commons/images/Instagram_login_Logo.png';
// import UserImg from '../commons/images/user.png';
import NavigationBar from "../navigation-bar";
// import RegisterPersonForm from "../login/components/register-person-form";
import NewPostForm from "./components/new-post-form";

class Feed extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.toggleNewPostForm = this.toggleNewPostForm.bind(this);
        this.toggleUsernamesDropdown = this.toggleUsernamesDropdown.bind(this);
        this.reload = this.reload.bind(this);

        this.state = {
            posts: [],
            usernames: [],
            showNewPostForm: false,
            usernamesDropdownIsOpen: false,
            postFilterPersonId: 0,
            errorMessage: '',
            errorStatus: 0
        };

        this.showPostsFromUser = this.showPostsFromUser.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        // this.protectRoute();
        this.fetchPosts();
        this.fetchUsernames();
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value, errorMessage: '' });
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

    fetchPosts(){
        API_POSTS.getPosts(async(result, status, error) => {
            if (result !== null && status === 200) {
                this.setState({
                    posts: result
                })
            } else {
                console.error("Eroare la obținerea postărilor:", error);
            }
        });
    }

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
                                <DropdownToggle color="primary" caret>Username</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem key="0" value="0" onClick={this.showPostsFromUser}>All Users</DropdownItem>
                                    {Object.values(this.state.usernames)
                                        .sort((a, b) => a.username.localeCompare(b.username)) // Alphabetical sort
                                        .map((obj) => (
                                            <DropdownItem key={obj.id} value={obj.id} onClick={this.showPostsFromUser}>{obj.username}</DropdownItem>
                                        ))}
                                </DropdownMenu>
                            </Dropdown>
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
                        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
                        .filter(post => {
                            if(this.state.postFilterPersonId === 0){
                                return true;
                            }

                            if(post.idPerson === this.state.postFilterPersonId){
                                return true;
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
                                            {this.state.usernames.find(username => username.id === post.idPerson).username}
                                            <span style={{
                                            color: 'gray',
                                            fontSize: '0.9rem'
                                            }}>
                                                • {this.timeAgo(post.dateCreated)}
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
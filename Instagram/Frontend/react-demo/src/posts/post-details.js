import React, { useEffect, useState, useContext  } from 'react';
import { useParams } from 'react-router-dom';
import * as API_POSTS from '../admin/api/posts-api';
import * as API_USERS from '../admin/api/people-api';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import NavigationBar from '../navigation-bar';
import { UserContext } from '../contexts/UserContext';



function PostDetails() {
  const { id } = useParams();  
  const [post, setPost] = useState(null);
  const [username, setUsername] = useState('Utilizator necunoscut');
  const { user } = useContext(UserContext);


  useEffect(() => {
    API_POSTS.getPostById(id, (result, status) => {
      if (result !== null && status === 200) {
        setPost(result);
        API_USERS.getPersonById(result.idPerson, (res, stat) => {
          if (res !== null && stat === 200) {
            setUsername(res.username);
          }
        });
      }
    });
  }, [id]);

  const timeAgo = (dateString) => {
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
    return postDate.toLocaleDateString('ro-RO');
  };

  if (!post) return <p>Se încarcă postarea...</p>;

  const imageSource = post.image ? "data:image/png;base64, " + post.image : "";

  return (
    <>
      <NavigationBar />
      <div style={{ padding: '2rem 20%' }}>
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
                <div>{username}</div>
                <div style={{ fontSize: '0.9rem', color: 'gray' }}>
                    {timeAgo(post.dateCreated)} • {post.status || 'fără status'}
                </div>
            </div>


            {/* Imaginea postării */}
            {imageSource && (
              <img
                src={imageSource}
                alt="Post"
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
            )}

            {/* Detalii */}
            <CardText><strong>Title:</strong> {post.title}</CardText>
            <CardText><strong>Description:</strong> {post.text}</CardText>
            <CardText><strong>Tags:</strong> {post.tag || 'N/A'}</CardText>
            <CardText><strong>Scor aprecieri:</strong> {post.totalVotes}</CardText>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button color="success" onClick={() => alert('Liked!')}>Like</Button>
              <Button color="danger" onClick={() => alert('Disliked!')}>Dislike</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default PostDetails;

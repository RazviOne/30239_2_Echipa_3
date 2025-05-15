import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import * as API_POSTS from '../admin/api/posts-api';
import * as API_USERS from '../admin/api/people-api';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import LogoImg from '../commons/images/Instagram_login_Logo.png';
import UserImg from '../commons/images/user.png';

function Feed() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    API_POSTS.getPosts((result, status, error) => {
      if (result !== null && status === 200) {
        setPosts(result);

        result.forEach(post => {
          const id = post.idPerson;

          if (!usernames[id]) {
            API_USERS.getPersonById(id, (userData, userStatus) => {
              if (userData !== null && userStatus === 200) {
                setUsernames(prev => ({
                  ...prev,
                  [id]: userData.username
                }));
              }
            });
          }
        });
      } else {
        console.error("Eroare la obținerea postărilor:", error);
      }
    });
  }, []);

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
    return postDate.toLocaleDateString('ro-RO'); // dacă e mai vechi de o săptămână, afișăm data
  };
  

  return (
    <div style={{ padding: '1rem 10%', backgroundColor: '#fafafa' }}>
      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #ddd',
        paddingBottom: '1rem'
      }}>
        <img src={LogoImg} alt="Instagram Logo" style={{ height: '50px' }} />
        <img
          src={UserImg}
          alt="Profil"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* FEED */}
      {posts.length === 0 && <p>Nu există postări momentan.</p>}

      {posts.map((post, idx) => (
        <Card key={idx} style={{ marginBottom: '2rem', padding: '1rem' }}>
          <CardBody>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {usernames[post.idPerson] || 'Utilizator necunoscut'} - {timeAgo(post.dateCreated)}
            </div>

            {post.image && (
              <img
                src={post.image}
                alt="Post"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
            )}

            <CardTitle tag="h5" style={{ marginBottom: '0.5rem' }}>
              {post.title}
            </CardTitle>
            <CardText>{post.text}</CardText>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default Feed;

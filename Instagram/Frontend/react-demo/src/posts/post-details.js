import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as API_POSTS from '../admin/api/posts-api';
import * as API_USERS from '../admin/api/people-api';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import NavigationBar from '../navigation-bar';


function PostDetails() {
  const { id } = useParams();  // extrage ID-ul din URL
  const [post, setPost] = useState(null);
  const [username, setUsername] = useState('Utilizator necunoscut');

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

  if (!post) return <p>Se încarcă postarea...</p>;

  let imageSource = "";
  if (post.image) {
    imageSource = "data:image/png;base64, " + post.image;
  }

  return (
    <>
    <NavigationBar />

    <div style={{ padding: '2rem 20%' }}>
      <Card>
        <CardBody>
          <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            {username}
          </div>
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
          <CardTitle tag="h5">{post.title}</CardTitle>
          <CardText>{post.text}</CardText>
        </CardBody>
      </Card>
    </div>
    </>
  );
}

export default PostDetails;

import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import * as API_POSTS from '../../admin/api/posts-api';

function EditPostForm({ children, reloadHandler }) {
  const postId = children.postId;

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    API_POSTS.getPostById(postId, (result, status) => {
      if (result && status === 200) {
        setPost(result);
        setTitle(result.title);
        setText(result.text);
      }
    });
  }, [postId]);

  const handleSubmit = () => {
    const updatedPost = {
      ...post,
      title,
      text
    };

    API_POSTS.updatePost(postId, updatedPost, (res, status) => {
      if ((status === 200 || status === 201) && res.idPost !== -1) {
        reloadHandler();
      } else {
        alert("Failed to update post.");
      }
    });
  };

  if (!post) return <div>Loading post...</div>;

  return (
    <div>
      <FormGroup>
        <Label for="title">Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label for="text">Text</Label>
        <Input
          type="textarea"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </FormGroup>

      <Button color="primary" onClick={handleSubmit}>Save changes</Button>
    </div>
  );
}

export default EditPostForm;

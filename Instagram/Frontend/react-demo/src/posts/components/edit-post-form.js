import React from 'react';

function EditPostForm({ post, onSave }) {
  return (
    <form onSubmit={onSave}>
      <input defaultValue={post.title} />
      <textarea defaultValue={post.text} />
      <button type="submit">Salvează</button>
    </form>
  );
}

export default EditPostForm;

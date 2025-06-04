import React from 'react';

function DeletePostNotification({ onDelete }) {
  return (
    <div>
      <p>Ești sigur că vrei să ștergi această postare?</p>
      <button onClick={onDelete}>Confirmă</button>
    </div>
  );
}

export default DeletePostNotification;

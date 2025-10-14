import React from 'react';
import './DeleteModal.css';  // استخدم الاسم الذي تريده للملف

const DeleteModal = ({ visible, onConfirm, onCancel, message, buttonColor }) => {
  if (!visible) return null;

  return (
    <div className="delete-overlay" onClick={onCancel}>
      <div className="delete-popup" onClick={e => e.stopPropagation()}>
        <p>{message || "Are you sure you want to delete this item?"}</p>
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button 
          onClick={onConfirm} 
          style={buttonColor ? { background: buttonColor } : undefined}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;

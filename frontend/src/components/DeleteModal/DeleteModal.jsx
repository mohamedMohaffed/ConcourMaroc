import React from 'react';
import './DeleteModal.css';  
import Loading from '../Loading/Loading'

const DeleteModal = ({ visible, onConfirm, onCancel, message, buttonColor, confirmText, loading }) => {
  if (!visible) return null;

  return (
    <div className="delete-overlay" onClick={loading ? undefined : onCancel}>
      <div className="delete-popup" onClick={e => e.stopPropagation()}>
        <p>{message || "Are you sure you want to delete this item?"}</p>
        {loading ? (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Loading />
          </div>
        ) : (
          <>
            <button className="btn-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
            <button 
              onClick={onConfirm} 
              style={buttonColor ? { background: buttonColor } : undefined}
              disabled={loading}
            >
              {confirmText || "Delete"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;

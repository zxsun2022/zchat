// src/components/ApiKeyModal.js
import React, { useState } from 'react';
import './ApiKeyModal.css'; 

function ApiKeyModal({ saveApiKey, closeModal }) {
  const [inputKey, setInputKey] = useState('');

  const handleSave = () => {
    if (inputKey.trim()) {
      saveApiKey(inputKey.trim());
      setInputKey('');
    } else {
      alert('Enter your API Key.');
    }
  };

  const handleCancel = () => {
    closeModal();
    setInputKey('');
  };

  return (
    <div className="api-key-modal-overlay">
      <div className="api-key-modal">
        <h2>Enter your API Key.</h2>
        <input
          type="password"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="API Key"
        />
        <div className="modal-actions">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;

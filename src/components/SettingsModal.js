// src/components/SettingsModal.js
import React, { useState } from 'react';
import './SettingsModal.css';

function SettingsModal({
  apiKey,
  setApiKey,
  defaultSystemPrompt,
  setDefaultSystemPrompt,
  defaultParams,
  setDefaultParams,
  closeModal,
}) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [systemPrompt, setSystemPromptLocal] = useState(defaultSystemPrompt);
  const [params, setParamsLocal] = useState(defaultParams);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParamsLocal({
      ...params,
      [name]: parseFloat(value),
    });
  };

  const handleSave = () => {
    if (inputKey.trim() === '') {
      alert('API Key cannot be empty.');
      return;
    }
    setApiKey(inputKey.trim());
    setDefaultSystemPrompt(systemPrompt);
    setDefaultParams(params);
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h2>Settings</h2>
        <div className="modal-section">
          <label>
            <span>API Key:</span>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your API Key"
              aria-label="API Key Input"
            />
          </label>
        </div>
        <div className="modal-section">
          <label>
            <span>Default System Prompt:</span>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPromptLocal(e.target.value)}
              rows="4"
              placeholder="Enter default system prompt"
              aria-label="Default System Prompt"
            />
          </label>
        </div>
        <div className="modal-section">
          <h3>Default Parameters</h3>
          <label>
            <span>Temperature:</span>
            <input
              type="number"
              name="temperature"
              value={params.temperature}
              step="0.1"
              min="0"
              max="2"
              onChange={handleParamChange}
              aria-label="Temperature Input"
            />
          </label>
          <label>
            <span>Top P:</span>
            <input
              type="number"
              name="top_p"
              value={params.top_p}
              step="0.1"
              min="0"
              max="1"
              onChange={handleParamChange}
              aria-label="Top P Input"
            />
          </label>
          <label>
            <span>Top K:</span>
            <input
              type="number"
              name="top_k"
              value={params.top_k}
              min="0"
              onChange={handleParamChange}
              aria-label="Top K Input"
            />
          </label>
          <label>
            <span>Repetition Penalty:</span>
            <input
              type="number"
              name="repetitionPenalty"
              value={params.repetitionPenalty}
              step="0.1"
              min="0"
              max="2"
              onChange={handleParamChange}
              aria-label="Repetition Penalty Input"
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="save-button" onClick={handleSave} aria-label="Save Settings">
            Save
          </button>
          <button className="cancel-button" onClick={handleCancel} aria-label="Cancel Settings">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;

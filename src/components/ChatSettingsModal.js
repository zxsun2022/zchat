// src/components/ChatSettingsModal.js
import React, { useState } from 'react';
import './ChatSettingsModal.css'; 

function ChatSettingsModal({ chat, updateChat, deleteChat, closeModal }) {
    const [title, setTitle] = useState(chat.title);
    const [systemPrompt, setSystemPrompt] = useState(chat.systemPrompt);
    const [params, setParams] = useState(chat.params);

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setParams({
            ...params,
            [name]: parseFloat(value),
        });
    };

    const saveSettings = () => {
        const updatedChat = { ...chat, title, systemPrompt, params };
        updateChat(updatedChat);
        closeModal();
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
        if (confirmDelete) {
            deleteChat(chat.id);
            closeModal();
        }
    };

    return (
        <div className="settings-modal-overlay">
            <div className="settings-modal">
                <div className="modal-header">
                    <h2>Chat Settings</h2>
                    <button className="close-button" onClick={closeModal}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <label>
                        <span>Title:</span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>System Prompt:</span>
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows="4"
                        />
                    </label>
                    <div className="params-section">
                        <h3>Parameters</h3>
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
                            />
                        </label>
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="save-button" onClick={saveSettings}>Save</button>
                    <button className="cancel-button" onClick={closeModal}>Cancel</button>
                    <button className="delete-button" onClick={handleDelete}>
                        Delete Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatSettingsModal;

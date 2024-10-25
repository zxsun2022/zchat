// src/App.js
import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import SettingsModal from './components/ChatSettingsModal';
import ApiKeyModal from './components/ApiKeyModal'; 
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [chats, setChats] = useState(JSON.parse(localStorage.getItem('chats')) || []);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
      setShowApiKeyModal(false);
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const addNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      systemPrompt: '',
      params: {
        temperature: 1,
        top_p: 1,
        top_k: 50,
        repetitionPenalty: 1,
      },
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (id) => {
    setChats(chats.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const updateChat = (updatedChat) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
  };

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>ZChat</h1>
        </div>
        <ChatList
          chats={chats}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          addNewChat={addNewChat}
        />
        <button
          className="modify-api-key-button"
          onClick={() => setShowApiKeyModal(true)}
        >
          Edit API Key
        </button>
      </div>

      <div className="main-content">
        {currentChat ? (
          <ChatWindow
            apiKey={apiKey}
            chat={currentChat}
            updateChat={updateChat}
            deleteChat={deleteChat}
          />
        ) : (
          <div className="no-chat-selected">Start chatting.</div>
        )}
        {showSettings && currentChat && (
          <SettingsModal
            chat={currentChat}
            updateChat={updateChat}
            deleteChat={deleteChat}
            closeModal={() => setShowSettings(false)}
          />
        )}
        {showApiKeyModal && (
          <ApiKeyModal
            saveApiKey={(key) => {
              setApiKey(key);
            }}
            closeModal={() => setShowApiKeyModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;

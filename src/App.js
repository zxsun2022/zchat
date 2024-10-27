// src/App.js
import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ApiKeyModal from './components/ApiKeyModal'; 
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [chats, setChats] = useState(JSON.parse(localStorage.getItem('chats')) || []);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);
  
  // State to handle mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatList, setShowChatList] = useState(!isMobile);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
      setShowApiKeyModal(false);
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // Handler to update isMobile based on window width
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowChatList(true); // Always show chat list on desktop
      } else {
        setShowChatList(currentChatId === null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentChatId]);

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
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const deleteChat = (id) => {
    setChats(chats.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
      if (isMobile) {
        setShowChatList(true);
      }
    }
  };

  const updateChat = (updatedChat) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
  };

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const handleChatSelect = (id) => {
    setCurrentChatId(id);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setCurrentChatId(null);
  };

  return (
    <div className="app">
      {/* Sidebar: Chat List */}
      {(showChatList || !isMobile) && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>ZChat</h1>
          </div>
          <ChatList
            chats={chats}
            currentChatId={currentChatId}
            setCurrentChatId={handleChatSelect}
            addNewChat={addNewChat}
          />
          <button
            className="modify-api-key-button"
            onClick={() => setShowApiKeyModal(true)}
          >
            Edit API Key
          </button>
        </div>
      )}

      {/* Main Content: Chat Window or Start Chatting */}
      {(currentChat && ((!isMobile) || (isMobile && !showChatList))) && (
        <div className="main-content">
          <ChatWindow
            apiKey={apiKey}
            chat={currentChat}
            updateChat={updateChat}
            deleteChat={deleteChat}
            isMobile={isMobile}
            onBack={handleBackToList}
          />
        </div>
      )}

      {/* Start Chatting Message on Desktop when no chat is selected */}
      {(!currentChat && !isMobile) && (
        <div className="main-content no-chat-selected">
          Start chatting.
        </div>
      )}

      {/* Modals */}
      {showApiKeyModal && (
        <ApiKeyModal
          saveApiKey={(key) => {
            setApiKey(key);
          }}
          closeModal={() => setShowApiKeyModal(false)}
        />
      )}
    </div>
  );
}

export default App;

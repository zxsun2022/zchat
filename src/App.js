// src/App.js
import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ApiKeyModal from './components/ApiKeyModal'; 
import './App.css';

function App() {
  // Safely retrieve API Key from localStorage
  const getStoredApiKey = () => {
    try {
      return localStorage.getItem('apiKey') || '';
    } catch (e) {
      console.error('Failed to retrieve apiKey from localStorage:', e);
      return '';
    }
  };

  // Safely retrieve chats from localStorage
  const getStoredChats = () => {
    try {
      const stored = localStorage.getItem('chats');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse chats from localStorage:', e);
      return [];
    }
  };

  // Retrieve stored state from localStorage
  const getStoredState = () => {
    try {
      const storedState = localStorage.getItem('appState');
      return storedState ? JSON.parse(storedState) : {};
    } catch (e) {
      console.error('Failed to parse appState from localStorage:', e);
      return {};
    }
  };

  const storedState = getStoredState();

  // Initialize state variables
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [chats, setChats] = useState(getStoredChats());
  const [currentChatId, setCurrentChatId] = useState(
    storedState.currentChatId !== undefined ? storedState.currentChatId : null
  );
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);

  // Handle mobile view state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatList, setShowChatList] = useState(
    storedState.showChatList !== undefined ? storedState.showChatList : true
  );

  // Save state to localStorage
  useEffect(() => {
    try {
      const appState = {
        currentChatId,
        showChatList,
      };
      localStorage.setItem('appState', JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save appState to localStorage:', e);
    }
  }, [currentChatId, showChatList]);

  // Save apiKey and chats to localStorage
  useEffect(() => {
    if (apiKey) {
      try {
        localStorage.setItem('apiKey', apiKey);
        setShowApiKeyModal(false);
      } catch (e) {
        console.error('Failed to save apiKey to localStorage:', e);
      }
    }
  }, [apiKey]);

  useEffect(() => {
    try {
      localStorage.setItem('chats', JSON.stringify(chats));
    } catch (e) {
      console.error('Failed to save chats to localStorage:', e);
    }
  }, [chats]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Do not change showChatList here
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      const remainingChats = chats.filter((chat) => chat.id !== id);
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
      if (isMobile && remainingChats.length === 0) {
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
    setCurrentChatId(null);
    setShowChatList(true);
  };

  useEffect(() => {
    console.log('currentChatId:', currentChatId);
    console.log('isMobile:', isMobile);
    console.log('showChatList:', showChatList);
    console.log('currentChat:', currentChat);
  }, [currentChatId, isMobile, showChatList, currentChat]);

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

      {/* Start Chatting Message on Mobile when no chat is selected and chat list is shown */}
      {(!currentChat && isMobile && showChatList) && (
        <div className="main-content no-chat-selected">
          Start chatting.
        </div>
      )}

      {/* Fallback UI on Mobile when no chat is selected and chat list is hidden */}
      {(!currentChat && isMobile && !showChatList) && (
        <div className="main-content no-chat-selected">
          No chat selected. Please start a new chat.
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

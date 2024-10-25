// src/components/ChatList.js
import React from 'react';
import './ChatList.css'; 

function ChatList({ chats, currentChatId, setCurrentChatId, addNewChat }) {
  return (
    <div className="chat-list">
      <button className="new-chat-button" onClick={addNewChat}>New Chat</button>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={chat.id === currentChatId ? 'active' : ''}
            onClick={() => setCurrentChatId(chat.id)}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;

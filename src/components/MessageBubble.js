// src/components/MessageBubble.js
import React, { useState } from 'react';
import './MessageBubble.css'; 

function MessageBubble({ message }) {
  console.log('Rendering message:', message); 
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`message-bubble ${message.sender === 'user' ? 'user' : 'ai'}`}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="message-content">
        {message.text}
        <div className="timestamp">{message.timestamp}</div>
      </div>
      {showMenu && (
        <div className="message-menu">
          {/* more functions here in the future */}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;

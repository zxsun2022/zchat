// src/components/ChatWindow.js
import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { chatWithCohere } from '../cohere';
import ChatSettingsModal from './ChatSettingsModal';
import './ChatWindow.css'; 

function ChatWindow({ apiKey, chat, updateChat, deleteChat, isMobile, onBack }) {
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const chatRef = useRef(chat);

    useEffect(() => {
        chatRef.current = chat;
    }, [chat]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage.trim(),
            sender: 'user',
            timestamp: new Date().toLocaleString(),
        };

        const aiMessage = {
            id: Date.now() + 1,
            text: '',
            sender: 'ai',
            timestamp: new Date().toLocaleString(),
        };

        const updatedChat = { ...chat, messages: [...chat.messages, userMessage, aiMessage] };
        updateChat(updatedChat);
        setInputMessage('');
        setLoading(true);

        try {
            const chatHistory = updatedChat.messages
                .filter((msg) => msg.text && msg.text.trim() !== '')
                .map((msg) => ({
                    message: msg.text,
                    user_name: msg.sender === 'user' ? 'User' : 'Assistant',
                }));

            const handleNewText = (newText) => {
                console.log('Received new text from AI:', newText);
                const latestChat = { ...chatRef.current };
                const latestMessages = [...latestChat.messages];
                const lastMessage = { ...latestMessages[latestMessages.length - 1] };
                lastMessage.text += newText;
                latestMessages[latestMessages.length - 1] = lastMessage;
                updateChat({ ...latestChat, messages: latestMessages });
            };

            await chatWithCohere(
                apiKey,
                userMessage.text,
                chatHistory,
                chat.params,
                chat.systemPrompt,
                handleNewText
            );

        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                {isMobile && (
                    <button className="back-button" onClick={onBack}>
                        &#8592; Back
                    </button>
                )}
                <h2>{chat.title}</h2>
                <button className="settings-button" onClick={() => setShowSettings(true)}>
                    Settings
                </button>
            </div>
            <div className="messages">
                {chat.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {loading && <div className="loading-indicator">Loading...</div>}
            </div>
            <div className="input-area">
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} disabled={loading}>
                    Send
                </button>
            </div>
            {showSettings && (
                <ChatSettingsModal
                    chat={chat}
                    updateChat={updateChat}
                    deleteChat={deleteChat}
                    closeModal={() => setShowSettings(false)}
                />
            )}
        </div>
    );
}

export default ChatWindow;

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatPage.css';

const SOCKET_SERVER = 'http://localhost:5000';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [sender, setSender] = useState('User');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      fetchMessages();
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.close();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${SOCKET_SERVER}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !messageText.includes('image')) return;

    const messageData = {
      text: messageText,
      sender: sender || 'Anonymous',
      image: null
    };

    if (socket) {
      socket.emit('send_message', messageData);
      setMessageText('');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${SOCKET_SERVER}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      const messageData = {
        text: '',
        sender: sender || 'Anonymous',
        image: data.imageUrl
      };

      if (socket) {
        socket.emit('send_message', messageData);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>💬 Chat Room</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="sender-input"
        />
      </div>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === sender ? 'sent' : 'received'}`}>
            <strong>{msg.sender}</strong>
            {msg.text && <p>{msg.text}</p>}
            {msg.image && <img src={msg.image} alt="chat" />}
            <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message... (Enter to send)"
          rows="3"
        />
        <div className="button-group">
          <button onClick={handleSendMessage} disabled={loading}>
            📤 Send
          </button>
          <label htmlFor="image-input" className="upload-btn">
            🖼️ Image
          </label>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

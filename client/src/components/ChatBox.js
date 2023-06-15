import React, { useState } from 'react';
import socket from '../services/socket';

const ChatBox = ({ chatMessages }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('chatMessage', message);
      setMessage('');
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div>
      <div>
        {chatMessages.map((chatMessage, index) => (
          <div key={index}>{chatMessage}</div>
        ))}
      </div>
      <input type="text" value={message} onChange={handleInputChange} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
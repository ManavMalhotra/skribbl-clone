import React, { useEffect, useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import ChatBox from './components/ChatBox';
import socket from './services/socket';

const App = () => {
  const [drawingData, setDrawingData] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    // Listen for drawing update event
    socket.on('drawingUpdate', (data) => {
      setDrawingData((prevData) => [...prevData, data]);
    });

    // Listen for chat message event
    socket.on('chatMessage', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for player joined event
    socket.on('playerJoined', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Listen for player left event
    socket.on('playerLeft', (playerName) => {
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player !== playerName));
    });

    // Listen for game start event
    socket.on('gameStart', () => {
      setIsGameStarted(true);
    });

    return () => {
      // Clean up socket listeners
      socket.off('drawingUpdate');
      socket.off('chatMessage');
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('gameStart');
    };
  }, []);

  const handleDrawingUpdate = (data) => {
    // Emit socket.io event for drawing update
    socket.emit('drawingUpdate', data);
  };

  const handleSendMessage = (message) => {
    // Emit socket.io event for chat message
    socket.emit('chatMessage', message);
  };

  const handleJoinGame = () => {
    // Emit socket.io event to join the game room
    const playerName = prompt('Enter your name');
    const roomId = prompt('Enter the room ID');
    socket.emit('joinRoom', { roomId, playerName });
  };

  return (
    <div>
      {isGameStarted ? (
        <div>
          <h2>Game Started!</h2>
          <p>Players: {players.join(', ')}</p>
        </div>
      ) : (
        <div>
          <h2>Waiting for players...</h2>
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      )}
      <DrawingCanvas drawingData={drawingData} onDrawingUpdate={handleDrawingUpdate} />
      <ChatBox chatMessages={chatMessages} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default App;

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const sampleRoute = require('./routes/sampleRoute');
const sampleController = require('./controllers/sampleController');
const Game = require('./models/Game');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*'
  }
});

// Use the sample route
app.use('/api', sampleRoute);

// Route handling
app.get('/api/sample', sampleController.getSampleData);


// Connect to MongoDB
//todo later: use environment variable for the connection string

// mongoose
//   .connect('mongodb://localhost/skribbl-clone', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('Failed to connect to MongoDB:', error);
//     process.exit(1);
//   });

// Start the server
const port = process.env.PORT || 8000;

io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);

  // Listen for drawing update event
  socket.on('drawingUpdate', (data) => {
    // Broadcast the drawing data to all connected clients in the same room
    io.to(data.roomId).emit('drawingUpdate', data);
  });

  // Listen for chat message event
  socket.on('chatMessage', (data) => {
    // Broadcast the chat message to all connected clients in the same room
    io.to(data.roomId).emit('chatMessage', data.message);
  });

  // Join a game room
  socket.on('joinRoom', (data) => {
    const { roomId, playerName } = data;

    // Join the room
    socket.join(roomId);

    // Add player to the game
    Game.addPlayer(roomId, playerName);

    // Notify all players in the room about the new player
    io.to(roomId).emit('playerJoined', Game.getPlayers(roomId));

    // Check if the game can start and notify players
    if (Game.canGameStart(roomId)) {
      io.to(roomId).emit('gameStart');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    console.log(socket.id);

    // Remove player from the game
    const { roomId } = socket;
    const playerName = Game.removePlayer(roomId, socket.id);

    // Notify all players in the room about the disconnected player
    io.to(roomId).emit('playerLeft', playerName);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const app = require('./app');  // Import the Express app
const http = require('http');  // Required for socket.io
const { Server } = require('socket.io');  // Import Socket.io
require('dotenv').config();  // Load environment variables

const PORT = process.env.PORT || 5000;  // Use the port from the .env file or default to 5000

// Create an HTTP server to use with Socket.io
const server = http.createServer(app);

// Setup Socket.io with the server
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins for development purposes
  },
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle incoming messages from clients
  socket.on('sendMessage', (messageData) => {
    console.log('Message received:', messageData);

    // Broadcast the message to all connected clients
    io.emit('receiveMessage', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

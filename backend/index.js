const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { createServer } = require("http");
const { Server } = require("socket.io");

const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server and attach socket.io to it
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Frontend's URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Swagger setup
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount the API routes
app.use("/api", apiRoutes);

// Socket.IO setup
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Event: User joins a conversation room
  socket.on("joinConversation", (conversationId) => {
    try {
      if (!conversationId) {
        console.error(`Invalid conversationId received: ${conversationId}`);
        return;
      }
      console.log(`User joined conversation room: conversation_${conversationId}`);
      socket.join(`conversation_${conversationId}`);
    } catch (error) {
      console.error(`Error joining conversation room: ${error.message}`);
    }
  });

  // Event: Send message
  socket.on("sendMessage", (message) => {
    try {
      const { conversationId } = message;
      if (!conversationId || !message) {
        console.error(`Invalid message or conversationId: ${JSON.stringify(message)}`);
        return;
      }
      console.log(`Message sent in conversation_${conversationId}:`, message);

      // Emit the message to all clients in the conversation room
      io.to(`conversation_${conversationId}`).emit("receiveMessage", message);
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
    }
  });

  // Event: Video call signaling
  socket.on("videoCallSignal", ({ room, signal }) => {
    try {
      if (!room || !signal) {
        console.error(`Invalid video call signal data: room=${room}, signal=${signal}`);
        return;
      }
      console.log(`Video call signal received for room ${room}:`, signal);

      // Forward the signal to the other users in the room
      socket.to(room).emit("videoCallSignal", signal);
    } catch (error) {
      console.error(`Error handling video call signal: ${error.message}`);
    }
  });

  // Event: Start video call
  socket.on("startVideoCall", (room) => {
    try {
      if (!room) {
        console.error(`Invalid room for starting video call: ${room}`);
        return;
      }
      console.log(`Starting video call in room: ${room}`);

      // Notify other users in the room to start the video call
      socket.to(room).emit("startVideoCall");
    } catch (error) {
      console.error(`Error starting video call: ${error.message}`);
    }
  });

  // Event: Disconnect
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});


// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

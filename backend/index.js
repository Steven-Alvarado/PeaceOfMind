const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { createServer } = require("http");
const { Server } = require("socket.io");
const db = require("./config/db")
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

// Serve static profile pic files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


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

  socket.on("sendMessage", async (message) => {
    try {
      // Normalize and validate fields
      const {
        conversationId = message.conversation_id,
        senderId = message.sender_id,
        receiverId = message.receiver_id,
        messageContent = message.message_content,
      } = message;
  
      if (!conversationId || !messageContent) {
        console.error(`Invalid message data: ${JSON.stringify(message)}`);
        return;
      }
  
      // Insert the message into the database
      const insertedMessage = await db.query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_content) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [conversationId, senderId, receiverId, messageContent]
      );
  
      const dbMessage = insertedMessage.rows[0];
  
      if (!dbMessage) {
        console.error("Failed to insert message into database");
        return;
      }
  
      console.log(`Message sent in conversation_${conversationId}:`, dbMessage);
  
      // Emit the message with `sent_at` to all clients in the room
      io.to(`conversation_${conversationId}`).emit("receiveMessage", dbMessage);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  });
  
  
  socket.on("videoCallSignal", ({ conversationId, signal }) => {
    const room = `conversation_${conversationId}`;
    if (!room || !signal) {
      socket.emit("error", "Invalid video call signal data");
      return;
    }
    socket.to(room).emit("videoCallSignal", signal);
  });
  
  socket.on("sendIceCandidate", ({ conversationId, candidate }) => {
    const room = `conversation_${conversationId}`;
    if (!candidate) {
      console.error(`Invalid ICE candidate data: ${candidate}`);
      return;
    }
    socket.to(room).emit("receiveIceCandidate", candidate);
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

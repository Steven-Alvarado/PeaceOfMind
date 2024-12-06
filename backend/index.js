const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { createServer } = require("http");
const { Server } = require("socket.io");
const db = require("./config/db");
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

  // User joins a conversation room
  socket.on("joinConversation", (conversationId) => {
    if (!conversationId) {
      console.error("Invalid conversationId received.");
      return;
    }
    console.log(`User joined conversation room: conversation_${conversationId}`);
    socket.join(`conversation_${conversationId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async (message) => {
    const { conversationId, senderId, receiverId, messageContent } = message;
  
    if (!conversationId || !messageContent) {
      console.error("Invalid message data.");
      return;
    }
  
    try {
      // Save the message in the database
      const insertedMessage = await db.query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_content) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [conversationId, senderId, receiverId, messageContent]
      );
  
      const dbMessage = insertedMessage.rows[0];
      if (dbMessage) {
        console.log(`Message sent in conversation_${conversationId}:`, dbMessage);
  
        // Emit message only to the relevant room
        io.to(`conversation_${conversationId}`).emit("receiveMessage", dbMessage);
      }
    } catch (error) {
      console.error("Error processing message:", error.message);
    }
  });
  

  // Video call signaling (offer/answer exchange)
  socket.on("videoCallSignal", ({ conversationId, signal }) => {
    if (!signal || !conversationId) {
      console.error("Invalid signal data.");
      return;
    }
    const room = `conversation_${conversationId}`;
    console.log(`Broadcasting video call signal for room ${room}:`, signal);
    socket.to(room).emit("receiveSignal", signal);
  });

  // Handle ICE candidate exchange
  socket.on("sendIceCandidate", ({ conversationId, candidate }) => {
    const room = `conversation_${conversationId}`;
    if (!candidate || !conversationId) {
      console.error("Invalid ICE candidate data.");
      return;
    }
    console.log(`Broadcasting ICE candidate for room ${room}:`, candidate);
    socket.to(room).emit("receiveIceCandidate", candidate);
  });

  // Handle SDP signaling for offer/answer
  socket.on("sendSignal", ({ roomId, type, data }) => {
    if (!roomId || !type || !data) {
      console.error("Invalid signaling data.");
      return;
    }
    console.log(`Broadcasting ${type} for room ${roomId}:`, data);
    socket.to(roomId).emit("receiveSignal", { type, data });
  });

  // Join video room
  socket.on("joinVideoRoom", ({ roomId, userId }, callback) => {
    if (!roomId || !userId) {
      console.error("Invalid room or user data.");
      callback({ success: false, error: "Invalid room or user data." });
      return;
    }
    console.log(`User ${userId} joined video room: ${roomId}`);
    socket.join(roomId);
    callback({ success: true });
  });

  // Notify other users in the room to start video call
  socket.on("startVideoCall", (conversationId) => {
    if (!conversationId) {
      console.error("Invalid conversationId for video call.");
      return;
    }
    const room = `conversation_${conversationId}`;
    console.log(`Starting video call in room: ${room}.`);
    socket.to(room).emit("startVideoCall");
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

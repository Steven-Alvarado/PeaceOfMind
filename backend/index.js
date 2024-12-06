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

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Create HTTP server and attach Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());

// Swagger setup
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount API routes
app.use("/api", apiRoutes);

// Socket.IO setup
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("joinConversation", (conversationId) => {
    if (!conversationId) return;
    console.log(`User joined conversation_${conversationId}`);
    socket.join(`conversation_${conversationId}`);
  });

  socket.on("sendMessage", async (message) => {
    const { conversationId, senderId, receiverId, messageContent } = message;
    if (!conversationId || !messageContent) return;

    try {
      const result = await db.query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_content)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [conversationId, senderId, receiverId, messageContent]
      );
      const dbMessage = result.rows[0];
      io.to(`conversation_${conversationId}`).emit("receiveMessage", dbMessage);
    } catch (error) {
      console.error("Error processing message:", error);
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://0.0.0.0:${PORT}/api-docs`);
});


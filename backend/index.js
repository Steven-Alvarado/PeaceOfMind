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

// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a conversation room
  socket.on("joinConversation", (conversationId) => {
    console.log(`User joined conversation room: conversation_${conversationId}`);
    socket.join(`conversation_${conversationId}`);
  });

  // Messaging feature
  socket.on("sendMessage", (message) => {
    console.log("Message sent:", message);
    io.to(`conversation_${message.conversationId}`).emit("receiveMessage", message);
  });

  // Handle video call signaling
  socket.on("videoCallSignal", ({ room, signal }) => {
    console.log(`Video call signal in room ${room}:`, signal);
    socket.to(room).emit("videoCallSignal", signal); // Forward signal to the other user
  });

  // Handle initiating a video call
  socket.on("startVideoCall", (room) => {
    console.log(`Starting video call in room: ${room}`);
    socket.to(room).emit("startVideoCall");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

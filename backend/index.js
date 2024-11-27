const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { createServer } = require("http"); // Import for creating the HTTP server
const { Server } = require("socket.io"); // Import for socket.io

const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server and attach socket.io to it
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Frontend's URL
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend's URL
  })
);
app.use(express.json());

const swaggerDocument = YAML.load("./swagger.yaml");

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount the API routes
app.use("/api", apiRoutes);

// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for joinConversation event
  socket.on("joinConversation", (conversationId) => {
    console.log(`User joined conversation room: conversation_${conversationId}`);
    socket.join(`conversation_${conversationId}`);
  });

  // Listen for sendMessage event and emit receiveMessage to the room
  socket.on("sendMessage", (message) => {
    console.log("Message sent:", message);
    io.to(`conversation_${message.conversationId}`).emit("receiveMessage", message);
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
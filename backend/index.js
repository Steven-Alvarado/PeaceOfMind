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
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
const app = express();
const PORT = process.env.PORT || 5000;
const winston = require('winston');
const rateLimit = require('express-rate-limit');

// Create an HTTP server and attach socket.io to it
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL , 
    methods: ["GET", "POST"]
  },
});

if (!process.env.DATABASE_URL) {
  throw new Error('Missing required environment variables');
}

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use(limiter);

// logger for railway parsing
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Attach `io` to the app for use in other parts of the application
app.set("io", io);

// Serve static profile pic files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Swagger setup
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount the API routes
app.use("/api", apiRoutes);

// Socket.IO setup
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // User joins their student-specific room
  socket.on("joinStudentRoom", (studentId) => {
    if (!studentId) {
      console.error("Invalid studentId received.");
      return;
    }
    console.log(`Student ${studentId} joined their room.`);
    socket.join(`student_${studentId}`);
  });

  socket.on("joinTherapistRoom", (therapistId) => {
    if (!therapistId) {
      console.error("Invalid therapistId received.");
      return;
    }
    console.log(`Therapist joined room: therapist_${therapistId}`);
    socket.join(`therapist_${therapistId}`);
  });


  // Emit relationship updates to students
  socket.on("relationship-updated", ({ studentId, status }) => {
    if (!studentId || !status) {
      console.error("Invalid relationship update data.");
      return;
    }
    console.log(`Relationship update for student ${studentId}: ${status}`);
    io.to(`student_${studentId}`).emit("relationship-changed", { status });
  });


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

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.end(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
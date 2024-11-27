const express = require("express");
const {
  createConversation,
  getConversationsByUser,
  getConversationDetails,
} = require("../controllers/conversationsController");

const router = express.Router();

// Conversation Routes
router.post("/create", createConversation); // Create a new conversation
router.get("/:userId", getConversationsByUser); // Get all conversations for a user
router.get("/details/:conversationId", getConversationDetails); // Get details of a specific conversation

module.exports = router;
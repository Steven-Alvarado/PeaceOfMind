const express = require("express");
const {
  createMessage,
  getMessagesByConversation,
  markMessageAsRead,
  getUnreadMessagesCount,
} = require("../controllers/messagesController");

const router = express.Router();


router.post("/send", createMessage); // Send a new message
router.get("/:conversationId", getMessagesByConversation); // Get messages for a conversation
router.put("/:messageId/read", markMessageAsRead); // Mark a message as read
router.get("/:userId/unread", getUnreadMessagesCount); // Get unread messages count for a user

module.exports = router;

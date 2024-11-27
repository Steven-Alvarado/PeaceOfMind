const {
  createMessageModel,
  getMessagesByConversationModel,
  markMessageAsReadModel,
  getUnreadMessagesCountModel,
} = require("../models/messagesModel");

// Send a new message
const createMessage = async (req, res) => {
  const { conversation_id, sender_id, receiver_id, message_content } = req.body;

  if (!conversation_id || !sender_id || !receiver_id || !message_content) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const message = await createMessageModel(conversation_id, sender_id, receiver_id, message_content);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
};

// Get messages for a specific conversation
const getMessagesByConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await getMessagesByConversationModel(conversationId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};

// Mark a message as read
const markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const result = await markMessageAsReadModel(messageId);
    if (!result) {
      return res.status(404).json({ error: "Message not found." });
    }
    res.status(200).json({ message: "Message marked as read." });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Failed to mark message as read." });
  }
};

// Get unread messages count for a user
const getUnreadMessagesCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const count = await getUnreadMessagesCountModel(userId);
    res.status(200).json({ unread_count: count });
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: "Failed to fetch unread messages count." });
  }
};

module.exports = {
  createMessage,
  getMessagesByConversation,
  markMessageAsRead,
  getUnreadMessagesCount,
};

const { createMessage, getMessagesByConversationId, markMessageAsRead } = require('../models/messagesModel');

// Send a new message within a conversation
const sendMessage = async (req, res) => {
  const { conversationId, senderId, receiverId, messageContent } = req.body;

  if (!conversationId || !senderId || !receiverId || !messageContent) {
    return res.status(400).json({ error: "All fields are required: conversationId, senderId, receiverId, messageContent" });
  }

  try {
    const newMessage = await createMessage(conversationId, senderId, receiverId, messageContent);
    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Retrieve all messages within a conversation
const getMessages = async (req, res) => {
  const { id } = req.params;

  try {
    const messages = await getMessagesByConversationId(id);
    res.status(200).json({ data: messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

// Mark a message as read
const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMessage = await markMessageAsRead(id);
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message marked as read", data: updatedMessage });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
};

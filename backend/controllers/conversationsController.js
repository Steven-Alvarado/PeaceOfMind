const { createConversation, getConversationById, findConversation } = require('../models/conversationsModel');

// Start a new conversation
const startConversation = async (req, res) => {
  const { studentId, therapistId } = req.body;

  // Validation
  if (!studentId || !therapistId) {
    return res.status(400).json({ error: "Both studentId and therapistId are required." });
  }

  try {
    // Check if a conversation already exists
    const existingConversation = await findConversation(studentId, therapistId);
    if (existingConversation) {
      return res.status(409).json({ message: "Conversation already exists." });
    }

    // Create a new conversation
    const conversation = await createConversation(studentId, therapistId);
    res.status(201).json({ message: "Conversation started", conversation });
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ error: "Failed to start conversation" });
  }
};

// Retrieve a specific conversation
const getConversation = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await getConversationById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ conversation });
  } catch (error) {
    console.error("Error retrieving conversation:", error);
    res.status(500).json({ error: "Failed to retrieve conversation" });
  }
};

module.exports = {
  startConversation,
  getConversation,
};

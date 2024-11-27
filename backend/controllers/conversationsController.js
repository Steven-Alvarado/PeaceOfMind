const {
  createConversationModel,
  getConversationsByUserModel,
  getConversationDetailsModel,
} = require("../models/conversationsModel");

// Create a new conversation
const createConversation = async (req, res) => {
  const { student_id, therapist_id } = req.body;

  if (!student_id || !therapist_id) {
    return res.status(400).json({ error: "Student ID and Therapist ID are required." });
  }

  try {
    const conversation = await createConversationModel(student_id, therapist_id);

    if (conversation) {
      return res.status(201).json({ message: "Conversation created or updated.", conversation });
    } else {
      return res.status(409).json({ error: "Conversation already exists." });
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation." });
  }
};


// Get all conversations for a user
const getConversationsByUser = async (req, res) => {
  const { userId } = req.params; // User ID from route parameter
  const { role } = req.query; 

  if (!["student", "therapist"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'student' or 'therapist'." });
  }

  try {
    const conversations = await getConversationsByUserModel(userId, role);
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations." });
  }
};


// Get details of a specific conversation
const getConversationDetails = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await getConversationDetailsModel(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation details:", error);
    res.status(500).json({ error: "Failed to fetch conversation details." });
  }
};

module.exports = {
  createConversation,
  getConversationsByUser,
  getConversationDetails,
};

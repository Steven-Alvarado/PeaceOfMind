// userController.js
const {
  getAllUsers,
  getUserById,
  getUserAuditHistory,
  getEmailById,
} = require("../models/usersModel");

// Fetch all users
const fetchAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Retrieve a specific user by ID
const fetchUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Retrieve audit history for a specific user
const fetchUserAudit = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const auditHistory = await getUserAuditHistory(userId);
    if (auditHistory.length === 0) {
      return res
        .status(404)
        .json({ error: "No audit history found for this user" });
    }
    res.status(200).json(auditHistory);
  } catch (error) {
    console.error("Error retrieving user audit history:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

const fetchUserEmail = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const email = await getEmailById(userId);
    if (email.length === 0) {
      return res.status(404).json({ error: "No email found for this user" });
    }
    res.status(200).json(email);
  } catch (error) {
    console.error("Error retrieving user email: ", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  fetchAllUsers,
  fetchUserById,
  fetchUserAudit,
  fetchUserEmail,
};

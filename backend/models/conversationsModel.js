// conversationModel.js
const pool = require('../config/db');

// Start a new conversation between student and therapist
const createConversation = async (studentId, therapistId) => {
  const result = await pool.query(
    `INSERT INTO conversations (student_id, therapist_id) 
     VALUES ($1, $2) RETURNING *`,
    [studentId, therapistId]
  );
  return result.rows[0];
};

// Retrieve a specific conversation by ID
const getConversationById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM conversations WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Check if a conversation already exists between a student and therapist
const findConversation = async (studentId, therapistId) => {
  const result = await pool.query(
    `SELECT * FROM conversations WHERE student_id = $1 AND therapist_id = $2`,
    [studentId, therapistId]
  );
  return result.rows[0];
};

module.exports = {
  createConversation,
  getConversationById,
  findConversation,
};

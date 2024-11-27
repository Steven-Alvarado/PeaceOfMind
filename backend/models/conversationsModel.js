const pool = require("../config/db");

// Create a new conversation
const createConversationModel = async (student_id, therapist_id) => {
  try {
    // Validate relationship
    const relationship = await pool.query(
      `SELECT * FROM student_therapist_relationships
       WHERE student_id = $1 AND current_therapist_id = $2`,
      [student_id, therapist_id]
    );

    if (relationship.rows.length === 0) {
      throw new Error("No active relationship exists between the student and therapist.");
    }

    // Create or update the conversation
    const result = await pool.query(
      `INSERT INTO conversations (student_id, therapist_id, created_at, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (student_id, therapist_id) DO UPDATE
       SET updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [student_id, therapist_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in createConversationModel:", error);
    throw error;
  }
};

// Get all conversations for a user
const getConversationsByUserModel = async (userId, role) => {
  let query;
  let params = [userId];

  if (role === "student") {
    query = `
      SELECT c.*, 
             u.first_name AS therapist_first_name, 
             u.last_name AS therapist_last_name, 
             t.specialization 
      FROM conversations c
      INNER JOIN therapists t ON c.therapist_id = t.id
      INNER JOIN users u ON t.user_id = u.id
      WHERE c.student_id = $1
      ORDER BY c.updated_at DESC
    `;
  } else if (role === "therapist") {
    query = `
      SELECT c.*, 
             u.first_name AS student_first_name, 
             u.last_name AS student_last_name 
      FROM conversations c
      INNER JOIN users u ON c.student_id = u.id
      WHERE c.therapist_id = $1
      ORDER BY c.updated_at DESC
    `;
  } else {
    throw new Error("Invalid role specified. Must be 'student' or 'therapist'.");
  }

  const result = await pool.query(query, params);
  return result.rows;
};


// Get details of a specific conversation
const getConversationDetailsModel = async (conversationId) => {
  const result = await pool.query(
    `SELECT * FROM conversations WHERE id = $1`,
    [conversationId]
  );
  return result.rows[0];
};

module.exports = {
  createConversationModel,
  getConversationsByUserModel,
  getConversationDetailsModel,
};

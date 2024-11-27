const pool = require("../config/db");

// Send a new message
const createMessageModel = async (conversation_id, sender_id, receiver_id, message_content) => {
  const result = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_content) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [conversation_id, sender_id, receiver_id, message_content]
  );

  await pool.query(
    `UPDATE conversations 
     SET updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1`,
    [conversation_id]
  );

  return result.rows[0];
};

// Get messages for a specific conversation
const getMessagesByConversationModel = async (conversationId) => {
  const result = await pool.query(
    `SELECT * FROM messages 
     WHERE conversation_id = $1 
     ORDER BY sent_at ASC`,
    [conversationId]
  );
  return result.rows;
};

// Mark a message as read
const markMessageAsReadModel = async (messageId) => {
  const result = await pool.query(
    `UPDATE messages 
     SET is_read = TRUE 
     WHERE id = $1 
     RETURNING *`,
    [messageId]
  );
  return result.rows[0];
};

// Get unread messages count for a user
const getUnreadMessagesCountModel = async (userId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS unread_count 
     FROM messages 
     WHERE receiver_id = $1 AND is_read = FALSE`,
    [userId]
  );
  return parseInt(result.rows[0].unread_count, 10);
};

module.exports = {
  createMessageModel,
  getMessagesByConversationModel,
  markMessageAsReadModel,
  getUnreadMessagesCountModel,
};

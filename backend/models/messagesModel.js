const pool = require('../config/db');

// Send a new message
const createMessage = async (conversationId, senderId, receiverId, messageContent) => {
  const result = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_content) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [conversationId, senderId, receiverId, messageContent]
  );
  return result.rows[0];
};

// Retrieve all messages within a conversation
const getMessagesByConversationId = async (conversationId) => {
  const result = await pool.query(
    `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY sent_at`,
    [conversationId]
  );
  return result.rows;
};

// Mark a message as read
const markMessageAsRead = async (messageId) => {
  const result = await pool.query(
    `UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *`,
    [messageId]
  );
  return result.rows[0];
};

module.exports = {
  createMessage,
  getMessagesByConversationId,
  markMessageAsRead,
};

const pool = require("../config/db");

// Retrieve all users
const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
};

// Retrieve a specific user by ID
const getUserById = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

// Retrieve audit history for a specific user
const getUserAuditHistory = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM users_audit WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

const getEmailById = async (userId) => {
  const result = await pool.query(`SELECT auth.email FROM auth WHERE id = $1`, [
    userId,
  ]);
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserAuditHistory,
  getEmailById,
};

const pool = require('../config/db');

// Retrieve all users
const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
};

// Retrieve a specific user by ID
const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.gender, 
        u.role, 
        u.created_at, 
        u.updated_at, 
        a.email 
     FROM users u
     LEFT JOIN auth a ON u.id = a.user_id
     WHERE u.id = $1`,
    [id]
  );
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

module.exports = {
  getAllUsers,
  getUserById, 
  getUserAuditHistory
};

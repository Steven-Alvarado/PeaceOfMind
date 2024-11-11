const pool = require('../config/db'); // Pool instance for PostgreSQL


// Create a new user in the auth table
const createUser = async (email, passwordHash, role) => {
  const userResult = await pool.query(
    `INSERT INTO users (role) VALUES ($1) RETURNING id`, 
    [role]
  );
  const userId = userResult.rows[0].id;

  const authResult = await pool.query(
    `INSERT INTO auth (email, password_hash, user_id) VALUES ($1, $2, $3) RETURNING email, user_id`,
    [email, passwordHash, userId]
  );

  return {userId, email: authResult.rows[0].email };
};


// Find a user by email in the auth table
const findUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM auth WHERE email = $1`, [email]);
  return result.rows[0];
};

// Find a user by user_id in the users table
const findUserById = async (userId) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
  return result.rows[0];
};


module.exports = { createUser, findUserByEmail, findUserById };

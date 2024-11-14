const pool = require('../config/db'); // Pool instance for PostgreSQL


// Create a new user in the auth table
const createUser = async (email, passwordHash, role, firstName, lastName, gender) => {
  const userResult = await pool.query(
    `INSERT INTO users (role, first_name, last_name, gender) 
     VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, gender, role`, 
    [role, firstName, lastName, gender]
  );
  const userId = userResult.rows[0].id;

  const authResult = await pool.query(
    `INSERT INTO auth (email, password_hash, user_id) VALUES ($1, $2, $3) RETURNING email, user_id`,
    [email, passwordHash, userId]
  );
  return {
    id: userId,
    first_name: userResult.rows[0].first_name,
    last_name: userResult.rows[0].last_name,
    gender: userResult.rows[0].gender,
    role: userResult.rows[0].role,
    email: authResult.rows[0].email
  };
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

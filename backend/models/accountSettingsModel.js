const bcrypt = require('bcrypt');
const pool = require('../config/db');

const updateUserAccountSettings = async (id, first_name, last_name, email, password) => {
  try {
    // Check for duplicate email if email is being updated
    if (email) {
      const emailCheck = await pool.query(
        `SELECT id FROM auth WHERE email = $1 AND user_id != $2`,
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        throw new Error(`Email ${email} is already in use.`);
      }
    }

    // Update `users` table if first_name or last_name is provided
    const userFields = [];
    const userValues = [];
    let index = 1;

    if (first_name) {
      userFields.push(`first_name = $${index++}`);
      userValues.push(first_name);
    }
    if (last_name) {
      userFields.push(`last_name = $${index++}`);
      userValues.push(last_name);
    }
    userValues.push(id); // Add user ID to parameters

    if (userFields.length > 0) {
      const userQuery = `
        UPDATE users
        SET ${userFields.join(', ')}, updated_at = NOW()
        WHERE id = $${index}
      `;
      await pool.query(userQuery, userValues);
    }

    // Update `auth` table if email or password is provided
    if (email || password) {
      const authFields = [];
      const authValues = [];
      let hashedPassword = null;

      if (email) {
        authFields.push(`email = $${authValues.length + 1}`);
        authValues.push(email);
      }
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        authFields.push(`password_hash = $${authValues.length + 1}`);
        authValues.push(hashedPassword);
      }

      authValues.push(id); // Add user ID to parameters

      const authQuery = `
        UPDATE auth
        SET ${authFields.join(', ')}, updated_at = NOW()
        WHERE user_id = $${authValues.length}
      `;
      await pool.query(authQuery, authValues);
    }

    // Return the updated user details
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, a.email, u.updated_at
       FROM users u
       LEFT JOIN auth a ON u.id = a.user_id
       WHERE u.id = $1`,
      [id]
    );

    return result.rows[0] || null; // Return updated user details or null
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

module.exports = { updateUserAccountSettings };

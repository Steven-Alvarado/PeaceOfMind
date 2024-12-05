const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Make sure this import is present at the top

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


const updateTherapistAccountSettings = async (id, first_name, last_name, email, password, experience_years, monthly_rate) => {
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

    // Update `therapists` table if experience_years or monthly_rate is provided
    const therapistFields = [];
    const therapistValues = [];
    if (experience_years) {
      therapistFields.push(`experience_years = $${therapistValues.length + 1}`);
      therapistValues.push(experience_years);
    }
    if (monthly_rate) {
      therapistFields.push(`monthly_rate = $${therapistValues.length + 1}`);
      therapistValues.push(monthly_rate);
    }

    if (therapistFields.length > 0) {
      therapistValues.push(id); // Add user ID to parameters
      const therapistQuery = `
        UPDATE therapists
        SET ${therapistFields.join(', ')}, updated_at = NOW()
        WHERE user_id = $${therapistValues.length}
      `;
      await pool.query(therapistQuery, therapistValues);
    }

    // Return the updated therapist details
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, a.email, t.experience_years, t.monthly_rate, u.updated_at
       FROM users u
       LEFT JOIN auth a ON u.id = a.user_id
       LEFT JOIN therapists t ON u.id = t.user_id
       WHERE u.id = $1`,
      [id]
    );

    return result.rows[0] || null; // Return updated user details or null
  } catch (error) {
    console.error('Error updating therapist:', error);
    throw error;
  }
};



const deleteTherapist = async (therapistId) => {
  try {
    const query = `DELETE FROM therapists WHERE id = $1 RETURNING *`; // Update column name as per schema
    const result = await pool.query(query, [therapistId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting therapist:", error);
    throw new Error("Error deleting therapist.");
  }
};

const deleteUser = async (studentId) => {
  const query = `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows[0];
};


 module.exports = { updateUserAccountSettings, updateTherapistAccountSettings,deleteTherapist, deleteUser};

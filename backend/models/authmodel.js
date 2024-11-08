const pool = require('../config/db'); // Pool instance for PostgreSQL

//Check therapist license is valid in verified_license table
const isLicenseVerified = async (licenseNumber) => {
  const result = await pool.query(
    `SELECT 1 FROM verified_licenses WHERE license_number = $1`,
    [licenseNumber]
  );
  return result.rowCount > 0;
}

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

const createTherapist = async(userId, licenseNumber, specialization, experienceYears, monthlyRate) => {
  const therapistResult = await pool.query(
    `INSERT INTO therapists (user_id, license_number, specialization, experience_years, monthly_rate, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
     [userId, licenseNumber, specialization, experienceYears, monthlyRate]
  );
  return therapistResult.rows[0];
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
//Find a therapist by id in therapist table
const findTherapistById = async (therapistId) => {
    const query = `
        SELECT t.*, a.email
        FROM therapists t
        INNER JOIN users u ON t.user_id = u.id
        INNER JOIN auth a ON u.id = a.user_id
        WHERE t.id = $1;
    `;
    const result = await pool.query(query, [therapistId]);
    return result.rows[0];
};
//Get the availabe therapist using availability in therapist table
const getAvilableTherapists = async() =>{
    const query = `
        SELECT t.*, a.email
        FROM therapists t
        INNER JOIN users u ON t.user_id = u.id
        INNER JOIN auth a ON u.id = a.user_id
        WHERE t.availability = true;
    `;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    createUser,
    createTherapist,
    findUserByEmail,
    findUserById,
    isLicenseVerified,
    findTherapistById,
    getAvilableTherapists
};

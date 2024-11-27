const pool = require("../config/db");

const createTherapist = async (
  userId,
  licenseNumber,
  specialization,
  experienceYears,
  monthlyRate
) => {
  try {
    const therapistResult = await pool.query(
      `INSERT INTO therapists (user_id, license_number, specialization, experience_years, monthly_rate, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [userId, licenseNumber, specialization, experienceYears, monthlyRate]
    );
    return therapistResult.rows[0];
  } catch (error) {
    console.error("Error creating therapist:", error);
    throw new Error("Could not create therapist");
  }
};

// Find a therapist by id in the therapist table
const findTherapistById = async (therapistId) => {
  try {
    const query = `
            SELECT t.*, a.email
            FROM therapists t
            INNER JOIN users u ON t.user_id = u.id
            INNER JOIN auth a ON u.id = a.user_id
            WHERE t.id = $1;
        `;
    const result = await pool.query(query, [therapistId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding therapist by ID:", error);
    throw new Error("Could not find therapist");
  }
};

// Get the available therapists using availability in the therapist table
const getAvailableTherapists = async () => {
  try {
    const query = `
            SELECT t.*, a.email, u.first_name, u.last_name, u.gender
            FROM therapists t
            INNER JOIN users u ON t.user_id = u.id
            INNER JOIN auth a ON u.id = a.user_id
            WHERE t.availability = true;
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching available therapists:", error);
    throw new Error("Could not fetch available therapists");
  }
};

// Check if the therapist's license is valid in the verified_licenses table
const isLicenseVerified = async (licenseNumber) => {
  try {
    const result = await pool.query(
      `SELECT 1 FROM verified_licenses WHERE license_number = $1`,
      [licenseNumber]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error verifying license:", error);
    throw new Error("Could not verify license");
  }
};

module.exports = {
  createTherapist,
  findTherapistById,
  getAvailableTherapists,
  isLicenseVerified,
};

const pool = require('../config/db');

const createTherapist = async(userId, licenseNumber, specialization, experienceYears, monthlyRate) => {
    const therapistResult = await pool.query(
      `INSERT INTO therapists (user_id, license_number, specialization, experience_years, monthly_rate, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
       [userId, licenseNumber, specialization, experienceYears, monthlyRate]
    );
    return therapistResult.rows[0];
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

//Check therapist license is valid in verified_license table
const isLicenseVerified = async (licenseNumber) => {
    const result = await pool.query(
      `SELECT 1 FROM verified_licenses WHERE license_number = $1`,
      [licenseNumber]
    );
    return result.rowCount > 0;
};

module.exports = { 
    createTherapist, 
    findTherapistById, 
    getAvilableTherapists, 
    isLicenseVerified 
};
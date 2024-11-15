const pool = require('../config/db');

// Create a new survey response
const createSurveyResponse = async (userId, content) => {
    const result = await pool.query(
        `INSERT INTO surveys (student_id, document_content, survey_date, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW(), NOW()) RETURNING id, document_content, survey_date, created_at`,
        [userId, content]
    );
    return result.rows[0];
};

// Retrieve a specific survey response by ID
const getSurveyById = async (id) => {
    const result = await pool.query(`SELECT * FROM surveys WHERE id = $1`, [id]);
    return result.rows[0];
};

// Update a survey response by ID
const updateSurveyResponse = async (id, content) => {
    const result = await pool.query(
        `UPDATE surveys SET document_content = $1, updated_at = NOW() 
         WHERE id = $2 RETURNING id, document_content, updated_at`,
        [content, id]
    );
    return result.rows[0];
};

module.exports = { createSurveyResponse, getSurveyById, updateSurveyResponse };

const pool = require('../config/db');

// Create a survey response
const createSurveyResponse = async (userId, content) => {
    const documentResult = await pool.query(
        `INSERT INTO documents (user_id, document_type, document_content, created_at, updated_at)
         VALUES ($1, 'survey', $2, NOW(), NOW()) RETURNING id`,
        [userId, content]
    );

    const surveyResult = await pool.query(
        `INSERT INTO surveys (student_id, document_id, survey_date, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW(), NOW()) RETURNING id, survey_date, created_at`,
        [userId, documentResult.rows[0].id]
    );

    return { ...surveyResult.rows[0], document_id: documentResult.rows[0].id };
};

// Update a survey response
const updateSurveyResponse = async (surveyId, content) => {
    const documentResult = await pool.query(
        `UPDATE documents SET document_content = $1, updated_at = NOW()
         WHERE id = (SELECT document_id FROM surveys WHERE id = $2) RETURNING id`,
        [content, surveyId]
    );

    const surveyResult = await pool.query(
        `UPDATE surveys SET updated_at = NOW() WHERE id = $1 RETURNING id, updated_at`,
        [surveyId]
    );

    return { ...surveyResult.rows[0], document_id: documentResult.rows[0].id };
};

// Get a survey response by surveyId
const getSurveyById = async (surveyId) => {
    const result = await pool.query(
        `SELECT s.id, d.document_content, s.survey_date, s.created_at, s.updated_at
         FROM surveys s
         INNER JOIN documents d ON s.document_id = d.id
         WHERE s.id = $1`,
        [surveyId]
    );

    return result.rows[0];
};

// Get all surveys by userId
const getSurveysByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT s.id, d.document_content, s.survey_date, s.created_at, s.updated_at
         FROM surveys s
         INNER JOIN documents d ON s.document_id = d.id
         WHERE s.student_id = $1`,
        [userId]
    );

    return result.rows;
};

module.exports = { createSurveyResponse, updateSurveyResponse, getSurveyById, getSurveysByUserId };
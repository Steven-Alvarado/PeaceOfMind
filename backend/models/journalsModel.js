const pool = require('../config/db');

// Create a journal entry
const createJournalEntry = async (userId, mood, content) => {
    const documentResult = await pool.query(
        `INSERT INTO documents (user_id, document_type, document_content, created_at, updated_at)
         VALUES ($1, 'journal_entry', $2, NOW(), NOW()) RETURNING id`,
        [userId, content]
    );

    const journalResult = await pool.query(
        `INSERT INTO journals (student_id, mood, document_id, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, mood, created_at`,
        [userId, mood, documentResult.rows[0].id]
    );

    return { ...journalResult.rows[0], document_id: documentResult.rows[0].id };
};

// Update a journal entry
const updateJournalEntry = async (journalId, mood, content) => {
    const documentResult = await pool.query(
        `UPDATE documents SET document_content = $1, updated_at = NOW()
         WHERE id = (SELECT document_id FROM journals WHERE id = $2) RETURNING id`,
        [content, journalId]
    );

    const journalResult = await pool.query(
        `UPDATE journals SET mood = $1, updated_at = NOW() WHERE id = $2 RETURNING id, mood, updated_at`,
        [mood, journalId]
    );

    return { ...journalResult.rows[0], document_id: documentResult.rows[0].id };
};

// Get a journal entry by journalId
const getJournalById = async (journalId) => {
    const result = await pool.query(
        `SELECT j.id, j.mood, d.document_content, j.created_at, j.updated_at
         FROM journals j
         INNER JOIN documents d ON j.document_id = d.id
         WHERE j.id = $1`,
        [journalId]
    );

    return result.rows[0];
};

// Get all journals by userId
const getJournalsByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT j.id, j.mood, d.document_content, j.created_at, j.updated_at
         FROM journals j
         INNER JOIN documents d ON j.document_id = d.id
         WHERE j.student_id = $1`,
        [userId]
    );

    return result.rows;
};

module.exports = { createJournalEntry, updateJournalEntry, getJournalById, getJournalsByUserId };


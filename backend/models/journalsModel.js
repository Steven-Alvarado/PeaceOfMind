const pool = require('../config/db');

// Create a new journal entry
const createJournalEntry = async (userId, mood, content) => {
    const result = await pool.query(
        `INSERT INTO journals (student_id, mood, document_content, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, mood, document_content, created_at`,
        [userId, mood, content]
    );
    return result.rows[0];
};

// Retrieve a specific journal entry by ID
const getJournalEntryById = async (id) => {
    const result = await pool.query(`SELECT * FROM journals WHERE id = $1`, [id]);
    return result.rows[0];
};

// Update a journal entry by ID
const updateJournalEntry = async (id, mood, content) => {
    const result = await pool.query(
        `UPDATE journals SET mood = $1, document_content = $2, updated_at = NOW() 
         WHERE id = $3 RETURNING id, mood, document_content, updated_at`,
        [mood, content, id]
    );
    return result.rows[0];
};


module.exports = { createJournalEntry, getJournalEntryById,updateJournalEntry };

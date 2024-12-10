const pool = require('../config/db');

const createDocument = async (user_id, document_type, document_content) => {
    const documentResult = await pool.query(
        `INSERT INTO documents (user_id, document_type, document_content)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, document_type, document_content, created_at`,
         [user_id, document_type, document_content]
    );
    return documentResult.rows[0]; 
};

const getDocumentById = async (id) => {
    const result = await pool.query(
        `SELECT id, user_id, document_type, document_content, created_at, updated_at 
         FROM documents 
         WHERE id = $1`,
         [id]
    );
    return result.rows[0]; 
};

const getAllDocumentsForUser = async (userId) => {
    const documentsResult = await pool.query(
        `SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return documentsResult.rows;
};

const updateDocumentById = async (id, document_type, document_content) => {
    try {
         const existingDocument = await pool.query(
            `SELECT id, user_id, document_type, document_content
             FROM documents
             WHERE id = $1`,
            [id]
        );

         if (existingDocument.rows.length === 0) {
            return null;  
        }

        const { user_id, document_type: oldType, document_content: oldContent } = existingDocument.rows[0];

         
        const result = await pool.query(
            `UPDATE documents
             SET document_type = $1, document_content = $2, updated_at = NOW()
             WHERE id = $3
             RETURNING id, user_id, document_type, document_content, created_at, updated_at`,
            [document_type, document_content, id]
        );

        const updatedDocument = result.rows[0];

         await pool.query(
            `INSERT INTO documents_audit (document_id, user_id, action, old_content, new_content, action_timestamp)
             VALUES ($1, $2, 'UPDATE', $3, $4, NOW())`,
            [id, user_id, JSON.stringify({ document_type: oldType, document_content: oldContent }), JSON.stringify({ document_type, document_content })]
        );

        return updatedDocument;
    } catch (error) {
        console.error('Error updating document:', error);
        throw error; 
    }
};
const getAuditHistoryByUserId = async (userId) => {
    try {
        const auditHistoryResult = await pool.query(
            `SELECT audit_id, document_id, user_id, action, old_content, new_content, action_timestamp
             FROM documents_audit
             WHERE user_id = $1
             ORDER BY action_timestamp DESC`,
            [userId]
        );
        return auditHistoryResult.rows;
    } catch (error) {
        console.error('Error retrieving audit history:', error);
        throw error;
    }
};

const hasWeeklySurveyForCurrentWeek = async (userId) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday
        endOfWeek.setHours(23, 59, 59, 999);

        const result = await pool.query(
            `SELECT 1 FROM documents
             WHERE user_id = $1
             AND document_type = 'weekly_survey'
             AND created_at BETWEEN $2 AND $3`,
            [userId, startOfWeek, endOfWeek]
        );

        return result.rows.length > 0; // Return true if a survey exists
    } catch (error) {
        console.error("Error checking weekly survey:", error);
        throw error;
    }
};


module.exports = {createDocument, getDocumentById, getAllDocumentsForUser, updateDocumentById, getAuditHistoryByUserId, hasWeeklySurveyForCurrentWeek};

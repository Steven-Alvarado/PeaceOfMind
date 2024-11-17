const pool = require('../config/db'); 
const {createDocument, getDocumentById, getAllDocumentsForUser, updateDocumentById, getAuditHistoryByUserId} = require('../models/documentsModel');

const docCreated = async (req, res) => {
    const { user_id, document_type, document_content } = req.body;

    try {
        const document = await createDocument(user_id, document_type, document_content);
        res.status(201).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the document' });
    }
};

const checkDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const document = await getDocumentById(id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the document' });
    }
};

const checkGetDocForUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const documents = await getAllDocumentsForUser(userId);
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving documents' });
    }
};

const updateDocument = async (req, res) => {
    const { id } = req.params;   
    const { document_type, document_content } = req.body;  

    try {
        const updatedDocument = await updateDocumentById(id, document_type, document_content);

        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the document' });
    }
};

const checkDocumentAuditHistory = async (req, res) => {
    const { id } = req.params;   
    try {
    
        const auditHistory = await getAuditHistoryByUserId(id);

        if (auditHistory.length === 0) {
            return res.status(404).json({ error: 'No audit history found for this user' });
        }

        res.status(200).json(auditHistory);  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the document audit history' });
    }
};



module.exports = { docCreated, checkDocument, checkGetDocForUser, updateDocument, checkDocumentAuditHistory};

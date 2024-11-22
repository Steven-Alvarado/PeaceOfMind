const express = require('express');
const {docCreated, checkDocument, checkGetDocForUser, updateDocument, checkDocumentAuditHistory} =  require('../controllers/documentsController');

const router = express.Router();

router.post('/createDocument', docCreated); //Create a new document
router.get('/:id', checkDocument);  //Retrieve a specific document.
router.get('/users/:userId/documents', checkGetDocForUser);  // Retrieve all documents for a user
router.put('/:id', updateDocument); //Update an existing document.
router.get('/audit/user/:id', checkDocumentAuditHistory);  // Get audit history for a user

module.exports = router;
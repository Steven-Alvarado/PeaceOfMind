// conversationRoutes.js
const express = require('express');
const router = express.Router();
const { startConversation, getConversation } = require('../controllers/conversationsController');


router.post('/newConversation', startConversation); // Start a new conversation
router.get('/:id', getConversation); // Get conversation by ID

module.exports = router;

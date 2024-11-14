const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead } = require('../controllers/messagesController');


router.post('/send', sendMessage); // Send a new message within a conversation
router.get('/conversations/:id/allMessages', getMessages); // Retrieve all in a conversation
router.put('/:id', markAsRead); // Mark a message as read

module.exports = router;

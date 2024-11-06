const express = require('express');
const { register, login, logout, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register); // Register a new user
router.post('/login', login); // Log in an existing user
router.post('/logout', authenticateToken, logout); // Log out the current user
router.get('/me', authenticateToken, getProfile); // Fetch the current user’s profile

module.exports = router;

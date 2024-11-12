const express = require('express');
const { registerTherapist, getTherapistDetails, listAvailableTherapists} = require('../controllers/therapistController');
const {authenticateToken} = require('../middleware/authMiddleware');
const router = express.Router();

//Following ticket 3 API endpoints
router.post('/', authenticateToken, registerTherapist);
router.get('/available', authenticateToken, listAvailableTherapists);
router.get('/:id', authenticateToken, getTherapistDetails);

module.exports = router;
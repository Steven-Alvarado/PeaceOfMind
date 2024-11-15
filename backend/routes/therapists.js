const express = require('express');
const { registerTherapist, getTherapistDetails, listAvailableTherapists } = require('../controllers/therapistController');
const router = express.Router();


router.post('/register', registerTherapist); // Register new therapist
router.get('/available', listAvailableTherapists); // Get available therapists
router.get('/:id', getTherapistDetails); // Get therapist by id

module.exports = router;

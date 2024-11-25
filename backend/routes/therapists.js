const express = require('express');
const { registerTherapist, getTherapistDetails, getTherapistDetailsByUserId, listAvailableTherapists ,  } = require('../controllers/therapistController');
const router = express.Router();


router.post('/register', registerTherapist); // Register new therapist
router.get('/available', listAvailableTherapists); // Get available therapists
router.get('/:id', getTherapistDetails); // Get therapist by id
router.get('/user/:id', getTherapistDetailsByUserId ) //get therapist by userid 
module.exports = router;

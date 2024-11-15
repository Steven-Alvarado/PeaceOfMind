const express = require('express');
const { createSurvey, updateSurvey, getSurvey, getSurveys } = require('../controllers/surveyController');
const router = express.Router();


router.post('/', createSurvey); // Create a new survey response
router.put('/:id', updateSurvey);// Update a survey response
router.get('/:id', getSurvey); // Get a specific survey response by ID
router.get('/user/:userId', getSurveys);// Get all survey responses by userId

module.exports = router;


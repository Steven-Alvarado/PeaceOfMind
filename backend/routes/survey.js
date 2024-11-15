const express = require('express');
const { submitSurvey, getSurvey, updateSurvey } = require('../controllers/surveyController');
const router = express.Router();

router.post('/', submitSurvey);
router.get('/:id', getSurvey);
router.put('/:id', updateSurvey);

module.exports = router;

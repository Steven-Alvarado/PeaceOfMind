const express = require('express');
const router = express.Router();
const { submitReview, fetchAllReviews, fetchReviewsByTherapist} = require('../controllers/reviewsController');


router.post('/submitReview', submitReview); // Submit a new review
router.get('/', fetchAllReviews); // Get all reviews
router.get('/:id', fetchReviewsByTherapist); // Get all reviews by therapist id

module.exports = router;

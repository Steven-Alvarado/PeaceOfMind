// reviewController.js
const { createReview, getAllReviews , getReviewsByTherapistId} = require('../models/reviewsModel');

// Submit a new review for a therapist
const submitReview = async (req, res) => {
  const { student_id, therapist_id, rating, review_text } = req.body;

  // Validate required fields
  if (!student_id || !therapist_id || !rating || !review_text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate rating
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid rating. Must be a number between 1 and 5" });
  }

  try {
    const newReview = await createReview(student_id, therapist_id, rating, review_text);
    res.status(201).json({ message: "Review successfully submitted", data: newReview });
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Get all reviews
const fetchAllReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Get reviews for a specific therapist
const fetchReviewsByTherapist = async (req, res) => {
  const therapistId = parseInt(req.params.id, 10);
  if (isNaN(therapistId)) {
    return res.status(400).json({ error: "Invalid therapist ID" });
  }

  try {
    const reviews = await getReviewsByTherapistId(therapistId);
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this therapist" });
    }
    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Error retrieving therapist reviews:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  submitReview,
  fetchAllReviews,
  fetchReviewsByTherapist
};

const pool = require("../config/db");

// Submit a new review for a therapist
const createReview = async (studentId, therapistId, rating, reviewText) => {
  const result = await pool.query(
    `INSERT INTO therapist_reviews (student_id, therapist_id, rating, review_text, created_at, updated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
    [studentId, therapistId, rating, reviewText]
  );
  return result.rows[0];
};

// Fetch all reviews
const getAllReviews = async () => {
  const result = await pool.query(`
    SELECT 
      therapist_reviews.*, 
      users.first_name, 
      users.last_name 
    FROM therapist_reviews
    LEFT JOIN users ON therapist_reviews.student_id = users.id
    ORDER BY therapist_reviews.created_at DESC
  `);
  return result.rows;
};

// Fetch all reviews for a specific therapist
const getReviewsByTherapistId = async (therapistId) => {
  const result = await pool.query(
    `SELECT * FROM therapist_reviews WHERE therapist_id = $1 ORDER BY created_at DESC`,
    [therapistId]
  );
  return result.rows;
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByTherapistId,
};

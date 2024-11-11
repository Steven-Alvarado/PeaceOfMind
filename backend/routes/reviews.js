const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Database

// Route to submit a new review to therapists_review table
// Tested on Postman using string "http://localhost:5000/api/reviews"
// Tested on Postman using body { student_id: , therapist_id, rating: , review_text: }
router.post("/", async (req, res) => {
  const { student_id, therapist_id, rating, review_text } = req.body;

  // Checks for required fields
  if (!student_id || !therapist_id || !rating || !review_text) {
    return res.status(400).json({ error: "Missing fields required" });
  }

  // Checks if rating is a number
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ error: "Invalid rating value. Must be number between 1 and 5" });
  }

  // Executes INSERT query to therapist_reviews
  try {
    await pool.query(
      `INSERT INTO therapist_reviews (student_id, therapist_id, rating, review_text, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [student_id, therapist_id, rating, review_text]
    );
    res.json({ message: "Review successfully submitted" });
  } catch (err) {
    console.error("Error posting review:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;

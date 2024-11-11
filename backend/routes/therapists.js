const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Route to retrieve all reviews for a specific therapist
// Tested on Postman using string "http://localhost:5000/api/therapists/1/reviews"
router.get("/:id/reviews", async (req, res) => {
  const therapist_id = parseInt(req.params.id, 10);

  // Checks if input therapist_id is a number
  if (isNaN(therapist_id)) {
    return res.status(400).json({ error: "Invalid therapist ID value" });
  }

  // Executes SELECT query from therapist_reviews table
  try {
    const result = await pool.query(
      "SELECT * FROM therapist_reviews WHERE therapist_id = $1",
      [therapist_id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for this therapist" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving therapist reviews:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Route to retrieve therapist appointments
// Returns all appointments in order of most recent to least recent
// Tested on Postman with request "http://localhost:5000/api/therapists/1/appointments"
router.get("/:id/appointments", async (req, res) => {
  const therapist_id = parseInt(req.params.id, 10);

  // Checks if input therapist_id is a valid number
  if (isNaN(therapist_id)) {
    return res.status(400).json({ error: "Invalid therapist ID value" });
  }

  // Executes SELECT query for appointments table
  // Returns all appointments for therapist_id entered, filter based on status in frontend
  try {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE therapist_id = $1 ORDER BY id DESC",
      [therapist_id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No appointments found for this therapist" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving therapist appointments:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;

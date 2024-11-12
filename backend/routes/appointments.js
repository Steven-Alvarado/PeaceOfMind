const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Route to schedule new appointment to appointments table
// Tested on Postman with string "http://localhost:5000/api/appointments"
// Tested on Postman with body { student_id: , therapist_id: , appointment_date: , status: , notes: }
router.post("/", async (req, res) => {
  const { student_id, therapist_id, appointment_date, status, notes } =
    req.body;

  // Checks body for required fields
  if (!student_id || !therapist_id || !appointment_date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Checks status field for valid input
  const statusCheck = ["confirmed", "pending", "canceled", "completed"];
  if (!statusCheck.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  // Checks appointment_date for valid input
  const dateCheck = Date.parse(appointment_date);
  if (isNaN(dateCheck)) {
    return res.status(400).json({ error: "Invalid appointment date format" });
  }

  try {
    // Executes insert query to database
    await pool.query(
      `INSERT INTO appointments (student_id, therapist_id, appointment_date, status, notes, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [student_id, therapist_id, appointment_date, status, notes]
    );
    res.json({ message: "Appointment succesfully recorded" });
  } catch (err) {
    console.error("Error recording appointment:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Route to retrieve details of specific appointment
// Tested on Postman with string "http://localhost:5000/api/appointments/1"
router.get("/:id", async (req, res) => {
  // Checks input id is valid integer
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  // Executes query
  try {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving appointment:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Route to update status of specific appointment
// Tested on Postman with string "http://localhost:5000/api/appointments/4"
router.put("/:id", async (req, res) => {
  const { status } = req.body;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  if (!status) {
    return res.status(400).json({ error: "Status update required" });
  }

  const statusCheck = ["confirmed", "pending", "canceled", "completed"];
  if (!statusCheck.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updateStatus = await pool.query(
      `UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [status, id]
    );
    if (updateStatus.rowCount === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment status successfully updated" });
  } catch (err) {
    console.error("Error updating appointment status", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;

const pool = require('../config/db');

// Schedule a new appointment
const createAppointment = async (studentId, therapistId, appointmentDate, status, notes) => {
  const result = await pool.query(
    `INSERT INTO appointments (student_id, therapist_id, appointment_date, status, notes, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
    [studentId, therapistId, appointmentDate, status, notes]
  );
  return result.rows[0];
};

// Retrieve details of a specific appointment by ID
const getAppointmentById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM appointments WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update the status of a specific appointment
const updateAppointmentStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

module.exports = {
  createAppointment,
  getAppointmentById,
  updateAppointmentStatus,
};

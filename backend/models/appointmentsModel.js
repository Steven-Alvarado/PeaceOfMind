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

// Retrieve appointments for a specific student
const getAppointmentsByStudent = async (studentId) => {
  const result = await pool.query(
   `SELECT a.*, u.first_name AS therapist_first_name, u.last_name AS therapist_last_name
     FROM appointments a
     JOIN therapists t ON a.therapist_id = t.id
     JOIN users u ON t.user_id = u.id
     WHERE a.student_id = $1`,
    [studentId]
  );
  return result.rows;
};

// Retrieve appointments for a specific therapist
const getAppointmentsByTherapist = async (therapistId) => {
  const result = await pool.query(
    `SELECT a.*, u.first_name AS student_first_name, u.last_name AS student_last_name
     FROM appointments a
     JOIN users u ON a.student_id = u.id
     WHERE a.therapist_id = $1`,
    [therapistId]
  );
  return result.rows;
};

// Update the status of a specific appointment
const updateAppointmentStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

// Delete an appointment by ID
const deleteAppointment = async (id) => {
  const result = await pool.query(
    `DELETE FROM appointments WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getAppointmentsByStudent,
  getAppointmentsByTherapist,
  updateAppointmentStatus,
  deleteAppointment,
};

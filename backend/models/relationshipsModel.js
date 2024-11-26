const pool = require('../config/db');

// Create a new student-therapist relationship
const createRelationship = async (studentId, therapistId) => {
  const result = await pool.query(
    `INSERT INTO student_therapist_relationships 
    (student_id, current_therapist_id, status) 
    VALUES ($1, $2, 'active') 
    ON CONFLICT (student_id) DO UPDATE 
    SET current_therapist_id = $2, 
        status = 'active', 
        updated_at = CURRENT_TIMESTAMP
    RETURNING *`,
    [studentId, therapistId]
  );
  return result.rows[0];
};

// Find existing relationship for a student
const findRelationship = async (studentId) => {
  const result = await pool.query(
    `SELECT 
      str.*,
      student.first_name AS student_first_name,
      student.last_name AS student_last_name,
      current_therapist.first_name AS current_therapist_first_name,
      current_therapist.last_name AS current_therapist_last_name,
      requested_therapist.first_name AS requested_therapist_first_name,
      requested_therapist.last_name AS requested_therapist_last_name
    FROM student_therapist_relationships str
    LEFT JOIN users student ON str.student_id = student.id
    LEFT JOIN therapists current_t ON str.current_therapist_id = current_t.id
    LEFT JOIN users current_therapist ON current_t.user_id = current_therapist.id
    LEFT JOIN therapists requested_t ON str.requested_therapist_id = requested_t.id
    LEFT JOIN users requested_therapist ON requested_t.user_id = requested_therapist.id
    WHERE str.student_id = $1`,
    [studentId]
  );
  return result.rows[0];
};

// Request a therapist switch
const requestTherapistSwitch = async (studentId, requestedTherapistId) => {
  const result = await pool.query(
    `UPDATE student_therapist_relationships 
    SET requested_therapist_id = $2, 
        status = 'pending', 
        updated_at = CURRENT_TIMESTAMP
    WHERE student_id = $1
    RETURNING *`,
    [studentId, requestedTherapistId]
  );
  return result.rows[0];
};

// Approve a therapist switch
const approveTherapistSwitch = async (studentId) => {
  const result = await pool.query(
    `UPDATE student_therapist_relationships 
    SET current_therapist_id = requested_therapist_id, 
        requested_therapist_id = NULL, 
        status = 'switched', 
        updated_at = CURRENT_TIMESTAMP
    WHERE student_id = $1
    RETURNING *`,
    [studentId]
  );
  return result.rows[0];
};

// Get all relationships
const getAllRelationships = async () => {
  const result = await pool.query(
    `SELECT 
      str.*,
      student.first_name AS student_first_name,
      student.last_name AS student_last_name,
      current_therapist.first_name AS current_therapist_first_name,
      current_therapist.last_name AS current_therapist_last_name,
      requested_therapist.first_name AS requested_therapist_first_name,
      requested_therapist.last_name AS requested_therapist_last_name
    FROM student_therapist_relationships str
    LEFT JOIN users student ON str.student_id = student.id
    LEFT JOIN therapists current_t ON str.current_therapist_id = current_t.id
    LEFT JOIN users current_therapist ON current_t.user_id = current_therapist.id
    LEFT JOIN therapists requested_t ON str.requested_therapist_id = requested_t.id
    LEFT JOIN users requested_therapist ON requested_t.user_id = requested_therapist.id`
  );
  return result.rows;
};

// Get relationships by therapist ID
const getRelationshipsByTherapistId = async (therapistId) => {
  const result = await pool.query(
    `SELECT 
      str.*,
      student.first_name AS student_first_name,
      student.last_name AS student_last_name,
      current_therapist.first_name AS current_therapist_first_name,
      current_therapist.last_name AS current_therapist_last_name
    FROM student_therapist_relationships str
    LEFT JOIN users student ON str.student_id = student.id
    LEFT JOIN therapists current_t ON str.current_therapist_id = current_t.id
    LEFT JOIN users current_therapist ON current_t.user_id = current_therapist.id
    WHERE str.current_therapist_id = $1 OR str.requested_therapist_id = $1`,
    [therapistId]
  );
  return result.rows;
};

// End relationship (remove current therapist)
const endRelationship = async (studentId) => {
  const result = await pool.query(
    `UPDATE student_therapist_relationships 
    SET current_therapist_id = NULL, 
        requested_therapist_id = NULL, 
        status = 'active', 
        updated_at = CURRENT_TIMESTAMP
    WHERE student_id = $1
    RETURNING *`,
    [studentId]
  );
  return result.rows[0];
};

module.exports = {
  createRelationship,
  findRelationship,
  requestTherapistSwitch,
  approveTherapistSwitch,
  getAllRelationships,
  getRelationshipsByTherapistId,
  endRelationship
};
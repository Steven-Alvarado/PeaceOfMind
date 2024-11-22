const db = require("../config/db");

// Fetch all therapists assigned to a specific student
exports.getTherapistsForStudent = async (studentId) => {
  const query = `
    SELECT 
      u.id AS therapist_id,
      u.first_name,
      u.last_name,
      a.email, -- Fetch email from the auth table
      t.specialization,
      t.experience_years
    FROM conversations c
    JOIN therapists t ON c.therapist_id = t.id
    JOIN users u ON t.user_id = u.id
    JOIN auth a ON u.id = a.user_id -- Join with the auth table for email
    WHERE c.student_id = $1;
  `;
  const { rows } = await db.query(query, [studentId]);
  return rows;
};

// Fetch all students assigned to a specific therapist
exports.getStudentsForTherapist = async (therapistId) => {
  const query = `
    SELECT 
      u.id AS student_id,
      u.first_name,
      u.last_name,
      a.email -- Fetch email from the auth table
    FROM conversations c
    JOIN users u ON c.student_id = u.id
    JOIN auth a ON u.id = a.user_id -- Join with the auth table for email
    WHERE c.therapist_id = $1;
  `;
  const { rows } = await db.query(query, [therapistId]);
  return rows;
};

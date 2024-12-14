const pool = require('../config/db');

// Get all invoices with detailed information
const getAllInvoices = async () => {
  const result = await pool.query(
    `SELECT 
      inv.*,
      student.first_name AS student_first_name,
      student.last_name AS student_last_name,
      therapist.first_name AS therapist_first_name,
      therapist.last_name AS therapist_last_name
    FROM invoices inv
    LEFT JOIN users student ON inv.student_id = student.id
    LEFT JOIN therapists t ON inv.therapist_id = t.id
    LEFT JOIN users therapist ON t.user_id = therapist.id
    ORDER BY inv.created_at DESC`
  );
  return result.rows;
};

// Get invoices for a specific student
const getInvoicesByStudentId = async (studentId) => {
  const result = await pool.query(
    `SELECT 
      inv.*,
      therapist.first_name AS therapist_first_name,
      therapist.last_name AS therapist_last_name
    FROM invoices inv
    LEFT JOIN therapists t ON inv.therapist_id = t.id
    LEFT JOIN users therapist ON t.user_id = therapist.id
    WHERE inv.student_id = $1
    ORDER BY inv.created_at DESC`,
    [studentId]
  );
  return result.rows;
};

// Get a specific invoice by ID
const getInvoiceById = async (invoiceId) => {
  const result = await pool.query(
    `SELECT 
      inv.*,
      student.first_name AS student_first_name,
      student.last_name AS student_last_name,
      therapist.first_name AS therapist_first_name,
      therapist.last_name AS therapist_last_name
    FROM invoices inv
    LEFT JOIN users student ON inv.student_id = student.id
    LEFT JOIN therapists t ON inv.therapist_id = t.id
    LEFT JOIN users therapist ON t.user_id = therapist.id
    WHERE inv.id = $1`,
    [invoiceId]
  );
  return result.rows[0];
};

// Create a new invoice
const createInvoice = async (studentId, therapistId, amountDue, dueDate) => {
  const result = await pool.query(
    `INSERT INTO invoices 
    (student_id, therapist_id, amount_due, due_date, status) 
    VALUES ($1, $2, $3, $4, 'unpaid') 
    RETURNING *`,
    [studentId, therapistId, amountDue, dueDate]
  );
  return result.rows[0];
};

// Pay an invoice
const payInvoice = async (invoiceId, amountPaid) => {
  const result = await pool.query(
    `UPDATE invoices 
    SET amount_paid = amount_paid + $2, 
        status = CASE 
          WHEN amount_paid + $2 >= amount_due THEN 'paid'
          WHEN amount_paid + $2 > 0 THEN 'partial'
          ELSE 'unpaid'
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *`,
    [invoiceId, amountPaid]
  );
  return result.rows[0];
};

// Update invoice details
const updateInvoice = async (invoiceId, updateData) => {
  const { therapistId, amountDue, dueDate, status } = updateData;
  
  const updateQuery = `
    UPDATE invoices 
    SET 
      ${therapistId ? 'therapist_id = $2,' : ''}
      ${amountDue !== undefined ? 'amount_due = $3,' : ''}
      ${dueDate ? 'due_date = $4,' : ''}
      ${status ? 'status = $5,' : ''}
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;

  // Construct dynamic query parameters
  const params = [
    invoiceId,
    ...(therapistId ? [therapistId] : []),
    ...(amountDue !== undefined ? [amountDue] : []),
    ...(dueDate ? [dueDate] : []),
    ...(status ? [status] : [])
  ];

  const result = await pool.query(updateQuery, params);
  return result.rows[0];
};

// Delete an invoice
const deleteInvoice = async (invoiceId) => {
  const result = await pool.query(
    `DELETE FROM invoices WHERE id = $1 RETURNING *`,
    [invoiceId]
  );
  return result.rows[0];
};

// Get invoice by therapist id
const getInvoicesByTherapistId = async (therapistId) => {
  const result = await pool.query(
      `SELECT 
          inv.*,
          student.first_name AS student_first_name,
          student.last_name AS student_last_name
      FROM invoices inv
      LEFT JOIN users student ON inv.student_id = student.id
      WHERE inv.therapist_id = $1
      ORDER BY inv.created_at DESC`,
      [therapistId]
  );
  return result.rows;
};

module.exports = {
  getAllInvoices,
  getInvoicesByStudentId,
  getInvoiceById,
  createInvoice,
  payInvoice,
  updateInvoice,
  getInvoicesByTherapistId,
  deleteInvoice
};
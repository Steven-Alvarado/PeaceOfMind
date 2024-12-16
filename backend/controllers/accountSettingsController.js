const bcrypt = require('bcrypt');
const { updateUserAccountSettings, updateTherapistAccountSettings, deleteUser , getTherapistRelationships } = require('../models/accountSettingsModel');

const { getAllInvoices, getInvoicesByStudentId } = require('../models/invoicesModel');
const pool = require('../config/db'); 
 
const updateUser = async (req, res) => {
  const { userid } = req.params;
  const { first_name, last_name, email, password } = req.body;

  try {
    const updatedUser = await updateUserAccountSettings(userid, first_name, last_name, email, password);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};


const updateTherapist = async (req, res) => {
  const { userid } = req.params;
  const { first_name, last_name, email, password, experience_years, monthly_rate } = req.body;

  try {
    const updatedTherapist = await updateTherapistAccountSettings(userid, first_name, last_name, email, password, experience_years, monthly_rate);

    if (!updatedTherapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    res.status(200).json({ message: 'Therapist updated successfully', therapist: updatedTherapist });
  } catch (error) {
    console.error('Error updating therapist:', error);
    res.status(500).json({ error: 'An error occurred while updating the therapist' });
  }
};

const handleDeleteUserAndTherapist = async (req, res) => {
  const { therapistId, studentId } = req.params;

  // Validate inputs
  if (!therapistId || !studentId) {
    return res.status(400).json({ error: "Therapist ID and Student ID are required." });
  }

  try {
    // Check for active relationships
    const relationships = await getTherapistRelationships(therapistId); 
    const activeRelationships = relationships.filter(
      (relationship) => relationship.status === "active"
    );

    if (activeRelationships.length > 0) {
      return res.status(400).json({
        error: "Therapist cannot be deleted because there are active relationships with students.",
      });
    }

    // Check for unpaid invoices
    const invoices = await getAllInvoices(); 
    const unpaidInvoices = invoices.filter(
      (invoice) => invoice.therapist_id === parseInt(therapistId) && invoice.status !== "paid"
    );

    if (unpaidInvoices.length > 0) {
      return res.status(400).json({
        error: "Therapist cannot be deleted because there are unpaid invoices.",
      });
    }

    // Delete therapist record from therapists table
    await pool.query(`DELETE FROM therapists WHERE user_id = $1`, [therapistId]);

    // Delete auth record
    await pool.query(`DELETE FROM auth WHERE user_id = $1`, [therapistId]);

    // Delete user record from users table
    const deletedUser = await deleteUser(studentId);

    return res.status(200).json({
      message: "Therapist and user deleted successfully.",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user and therapist:", error);
    return res.status(500).json({ error: "Failed to delete user and therapist." });
  }
};




const handleDeleteStudent = async (req, res) => {
  const { studentId } = req.params;

  // Validate student ID
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    // Retrieve all invoices for the student
    const invoices = await getInvoicesByStudentId(studentId);

    // Check if there are unpaid invoices
    const unpaidInvoices = invoices.filter(invoice => invoice.status !== 'paid');

    if (unpaidInvoices.length > 0) {
      return res.status(400).json({
        error: "Student cannot delete their account because there are unpaid invoices with their therapists.",
        unpaidInvoices,
      });
    }

    // Proceed with deleting the student account
    const deletedUser = await deleteUser(studentId); // Assuming a deleteUser function in your user model

    if (!deletedUser) {
      return res.status(404).json({ error: "Student not found or already deleted" });
    }

    res.status(200).json({
      message: "Student account deleted successfully",
      student: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student account" });
  }
};

module.exports = { updateUser,handleDeleteUserAndTherapist,handleDeleteStudent, updateTherapist};

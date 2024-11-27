const {
  createAppointment,
  getAppointmentById,
  getAppointmentsByStudent,
  getAppointmentsByTherapist,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../models/appointmentsModel');

// Utility for validating status
const validStatus = ["confirmed", "pending", "canceled", "completed"];

// Schedule a new appointment
const scheduleAppointment = async (req, res) => {
  const { student_id, therapist_id, appointment_date, status, notes } = req.body;

  if (!student_id || !therapist_id || !appointment_date || !status) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  if (!validStatus.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status value" });
  }

  if (isNaN(Date.parse(appointment_date))) {
    return res.status(400).json({ success: false, error: "Invalid appointment date format" });
  }

  try {
    const newAppointment = await createAppointment(
      student_id,
      therapist_id,
      appointment_date,
      status,
      notes
    );
    res.status(201).json({ success: true, message: "Appointment successfully recorded", data: newAppointment });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    res.status(500).json({ success: false, error: "Database query failed" });
  }
};

// Retrieve details of a specific appointment
const getAppointment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "Invalid appointment ID" });
  }

  try {
    const appointment = await getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: "Appointment not found" });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({ success: false, error: "Database query failed" });
  }
};

// Update the status of a specific appointment
const updateAppointment = async (req, res) => {
  const { status } = req.body;
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "Invalid appointment ID" });
  }

  if (!status) {
    return res.status(400).json({ success: false, error: "Status update required" });
  }

  if (!validStatus.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status value" });
  }

  try {
    const updatedAppointment = await updateAppointmentStatus(id, status);
    if (!updatedAppointment) {
      return res.status(404).json({ success: false, error: "Appointment not found" });
    }
    res.status(200).json({ success: true, message: "Appointment status successfully updated", data: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ success: false, error: "Database query failed" });
  }
};

// Get all appointments for a student
const getStudentAppointments = async (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  if (isNaN(studentId)) {
    return res.status(400).json({ success: false, error: "Invalid student ID" });
  }

  try {
    const appointments = await getAppointmentsByStudent(studentId);
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error retrieving student appointments:", error);
    res.status(500).json({ success: false, error: "Failed to retrieve appointments" });
  }
};

// Get all appointments for a therapist
const getTherapistAppointments = async (req, res) => {
  const therapistId = parseInt(req.params.therapistId, 10);
  if (isNaN(therapistId)) {
    return res.status(400).json({ success: false, error: "Invalid therapist ID" });
  }

  try {
    const appointments = await getAppointmentsByTherapist(therapistId);
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error retrieving therapist appointments:", error);
    res.status(500).json({ success: false, error: "Failed to retrieve appointments" });
  }
};

// Delete appointment
const cancelAppointment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "Invalid appointment ID" });
  }

  try {
    const deletedAppointment = await deleteAppointment(id);
    if (!deletedAppointment) {
      return res.status(404).json({ success: false, error: "Appointment not found" });
    }
    res.status(200).json({ success: true, data: deletedAppointment });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ success: false, error: "Failed to delete appointment" });
  }
};

module.exports = {
  scheduleAppointment,
  getAppointment,
  getStudentAppointments,
  getTherapistAppointments,
  updateAppointment,
  cancelAppointment,
};

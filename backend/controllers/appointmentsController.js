const { createAppointment, getAppointmentById, updateAppointmentStatus } = require('../models/appointmentsModel');

// Schedule a new appointment
const scheduleAppointment = async (req, res) => {
  const { student_id, therapist_id, appointment_date, status, notes } = req.body;

  if (!student_id || !therapist_id || !appointment_date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const statusCheck = ["confirmed", "pending", "canceled", "completed"];
  if (!statusCheck.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  if (isNaN(Date.parse(appointment_date))) {
    return res.status(400).json({ error: "Invalid appointment date format" });
  }

  try {
    const newAppointment = await createAppointment(student_id, therapist_id, appointment_date, status, notes);
    res.status(201).json({ message: "Appointment successfully recorded", data: newAppointment });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Retrieve details of a specific appointment
const getAppointment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  try {
    const appointment = await getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Update the status of a specific appointment
const updateAppointment = async (req, res) => {
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
    const updatedAppointment = await updateAppointmentStatus(id, status);
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment status successfully updated", data: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  scheduleAppointment,
  getAppointment,
  updateAppointment,
};

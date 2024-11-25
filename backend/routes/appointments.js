const express = require('express');
const router = express.Router();
const { scheduleAppointment, getAppointment, updateAppointment, getStudentAppointments, getTherapistAppointments, cancelAppointment } = require('../controllers/appointmentsController');


router.post('/schedule', scheduleAppointment); // Schedule a new appointment
router.get('/student/:studentId', getStudentAppointments); // Get appointments by student id
router.get('/therapist/:therapistId', getTherapistAppointments); // Get appointments by therapist id
router.get('/:id', getAppointment); // Retrieve details of an appointment
router.put('/:id', updateAppointment); // Update status of appointment 
router.delete('/:id', cancelAppointment); // Delete or cancel appointment

module.exports = router;

const express = require('express');
const router = express.Router();
const { scheduleAppointment, getAppointment, updateAppointment } = require('../controllers/appointmentsController');

router.post('/schedule', scheduleAppointment); // Schedule a new appointment
router.get('/:id', getAppointment); // Retrieve details of an appointment
router.put('/:id', updateAppointment); // Update status of appointment

module.exports = router;

const express = require('express');
const { getAppointments, updateAppointmentStatus, bookAppointment, patientAppointments, getAttendedPatients } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const router = express.Router();


router.post("/appointment", auth, bookAppointment); // ?tab=today|upcoming|past
router.get("/appointments", auth, getAppointments); // ?tab=today|upcoming|past
router.put("/appointments/:id/status", auth, updateAppointmentStatus); // confirm/cancel
router.get("/appointments/patient", auth, patientAppointments); // Patient's own appointments
router.get("/appointments/attended-patients", auth, getAttendedPatients); // Doctor's attended patients

module.exports = router; 
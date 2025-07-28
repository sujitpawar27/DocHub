const Appointment = require("../models/Appointment");
const User = require("../models/User");
const path = require("path");
const DoctorSlot = require("../models/DoctorSlot");

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, time, type, notes } = req.body;
    
    // Validate required fields
    if (!doctorId || !date || !time || !type || !patientId) {
      return res.status(400).json({ message: "Doctor ID, date, time, and type are required" });
    }

    // Optionally: Validate type value
    const validTypes = ['video', 'inperson'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid appointment type" });
    }

    // Find the slot in DoctorSlot
    const slot = await DoctorSlot.findOne({
      doctorId,
      datetime: new Date(date),
      type,
    });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found for the selected date/time' });
    }
    if (!slot.available) {
      return res.status(409).json({ message: 'Slot already booked' });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      patient: req.user.userId,
      date: new Date(date),
      time: time,
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'You have already booked this slot' });
    }

    // Mark slot as unavailable (booked)
    slot.available = false;
    await slot.save();

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: req.user.userId,
      date: new Date(date),
      time,
      type,
      notes,
      status: 'pending', 
    });
    console.log('bookAppointment', appointment);

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAppointments = async (req, res) => {
    try {
      const { tab } = req.query;
      let filter = { doctor: req.user.userId };
      const now = new Date();
      if (tab === "today") {
        const start = new Date(now.setHours(0, 0, 0, 0));
        const end = new Date(now.setHours(23, 59, 59, 999));
        filter.date = { $gte: start, $lte: end };
      } else if (tab === "upcoming") {
        filter.date = { $gt: new Date() };
      } else if (tab === "past") {
        filter.date = { $lt: new Date() };
      }
      const appointments = await Appointment.find(filter)
        .populate("patient", "fullName avatarUrl")
        .sort({ date: 1 });
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.updateAppointmentStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const filter = { _id: req.params.id };
      if (req.user.role === 'doctor') {
        filter.doctor = req.user.userId;
      } else if (req.user.role === 'patient') {
        filter.patient = req.user.userId;
      } else {
        return res.status(403).json({ message: "Unauthorized" });
      }
            
      const appointment = await Appointment.findOneAndUpdate(
        filter,
        { status },
        { new: true }
      );
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      console.log("appointment",appointment);
      
      res.json(appointment);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

// Fetch appointments for a patient (by logged-in user)
exports.patientAppointments = async (req, res) => {
  try {
    const { tab } = req.query;
    let filter = { patient: req.user.userId };
    const now = new Date();
    if (tab === "today") {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      filter.date = { $gte: start, $lte: end };
    } else if (tab === "upcoming") {
      filter.date = { $gt: new Date() };
    } else if (tab === "past") {
      filter.date = { $lt: new Date() };
    }
    const appointments = await Appointment.find(filter)
      .populate("doctor", "fullName specialization avatarUrl")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get patients attended by doctor (status: confirmed)
exports.getAttendedPatients = async (req, res) => {
  try {
    // Find all confirmed appointments for this doctor
    const confirmedAppointments = await Appointment.find({
      doctor: req.user.userId,
      status: 'confirmed',
    }).sort({ date: -1 });

    // Map to store patient info and stats
    const patientMap = new Map();

    for (const appt of confirmedAppointments) {
      const pid = appt.patient.toString();
      if (!patientMap.has(pid)) {
        patientMap.set(pid, {
          patientId: pid,
          lastConsultation: appt.date,
          visits: 1,
        });
      } else {
        const entry = patientMap.get(pid);
        entry.visits += 1;
        // Update lastConsultation if this appointment is newer
        if (appt.date > entry.lastConsultation) {
          entry.lastConsultation = appt.date;
        }
      }
    }

    // Fetch patient details
    const patientIds = Array.from(patientMap.keys());
    const patients = await User.find({ _id: { $in: patientIds }, role: 'patient' })
      .select('fullName avatarUrl email phone gender age');

    // Merge stats into patient info
    const result = patients.map((p) => {
      const stats = patientMap.get(p._id.toString());
      return {
        id: p._id,
        name: p.fullName,
        avatar: p.avatarUrl || null,
        email: p.email,
        phone: p.phone,
        gender: p.gender,
        age: p.age,
        lastConsultation: stats.lastConsultation,
        visits: stats.visits,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
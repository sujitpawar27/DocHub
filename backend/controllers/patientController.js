const User = require("../models/User");
const path = require("path");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get health history: all appointments and prescriptions for the logged-in patient, grouped by doctor
exports.getHealthHistory = async (req, res) => {
  try {
    const patientId = req.user.userId;

    // Fetch all appointments for this patient
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "fullName specialization avatarUrl")
      .sort({ date: -1 });

    // Fetch all prescriptions for this patient
    const prescriptions = await Prescription.find({ patientId })
      .populate("doctor", "fullName specialization avatarUrl")
      .sort({ date: -1 });

    // Group by doctor
    const grouped = {};
    appointments.forEach(appt => {
      const docId = appt.doctor?._id?.toString() || "unknown";
      if (!grouped[docId]) {
        grouped[docId] = {
          doctor: appt.doctor,
          appointments: [],
          prescriptions: [],
        };
      }
      grouped[docId].appointments.push(appt);
    });
    prescriptions.forEach(rx => {
      const docId = rx.doctor?._id?.toString() || "unknown";
      if (!grouped[docId]) {
        grouped[docId] = {
          doctor: rx.doctor,
          appointments: [],
          prescriptions: [],
        };
      }
      grouped[docId].prescriptions.push(rx);
    });

    // Convert grouped object to array for easier frontend use
    const result = Object.values(grouped).sort((a, b) => {
      // Sort by most recent appointment or prescription
      const aDate = [
        ...(a.appointments.map(x => x.date)),
        ...(a.prescriptions.map(x => x.date)),
      ].sort().reverse()[0];
      const bDate = [
        ...(b.appointments.map(x => x.date)),
        ...(b.prescriptions.map(x => x.date)),
      ].sort().reverse()[0];
      return new Date(bDate) - new Date(aDate);
    });

    res.json({ groupedByDoctor: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a prescription by its ID for the logged-in patient
exports.getPrescriptionById = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const appointmentid = req.params.id; // assuming route is /prescription/appointment/:id
   console.log("getPrescriptionById",req);

    const prescription = await Prescription.findOne({ appointmentid, patientId })
      .populate("doctor", "fullName specialization avatarUrl")
      .populate("patientId", "fullName age gender");

    if (!prescription) {
      return res.status(404).json({ message: "No prescription found for this appointment." });
    }

    res.json(prescription);
  } catch (err) {
    console.error("getPrescriptionByAppointmentId error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


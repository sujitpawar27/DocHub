const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const path = require("path");
const { log } = require("util");
const slotController = require("./slotController"); // Import slotController
// Add models as needed

// Get doctor profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.role !== "doctor")
      return res.status(404).json({ message: "Doctor not found" });
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
    if (!updatedUser || updatedUser.role !== "doctor")
      return res.status(404).json({ message: "Doctor not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDoctorAvailability = async (req, res) => {
  const doctorId = req.params.id;
  const { isAvailable } = req.body;

  try {
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isAvailable = isAvailable;
    await doctor.save();

    return res.status(200).json({
      message: `Doctor availability updated to ${isAvailable}`,
      doctorId: doctor._id,
      isAvailable: doctor.isAvailable,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "doctor")
      return res.status(404).json({ message: "Doctor not found" });
    await user.save();
    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const { search = "", sort = "newest" } = req.query;
    // Find all patients who have appointments with this doctor
    const patientIds = await Appointment.find({
      doctor: req.user.userId,
    }).distinct("patient");
    let query = { _id: { $in: patientIds }, role: "patient" };
    if (search) {
      query.fullName = { $regex: search, $options: "i" };
    }
    let patientsQuery = User.find(query).select(
      "fullName avatarUrl email phone gender age"
    );
    if (sort === "newest")
      patientsQuery = patientsQuery.sort({ createdAt: -1 });
    else if (sort === "oldest")
      patientsQuery = patientsQuery.sort({ createdAt: 1 });
    // For "most" visits, sort after fetching
    let patients = await patientsQuery.exec();
    if (sort === "most") {
      // Count visits for each patient
      const visits = await Appointment.aggregate([
        { $match: { doctor: req.user.userId } },
        { $group: { _id: "$patient", count: { $sum: 1 } } },
      ]);
      const visitsMap = Object.fromEntries(
        visits.map((v) => [v._id.toString(), v.count])
      );
      patients = patients.sort(
        (a, b) =>
          (visitsMap[b._id.toString()] || 0) -
          (visitsMap[a._id.toString()] || 0)
      );
    }
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPatientHistory = async (req, res) => {
  try {
    const patientId = req.params.id;

    const appointments = await Appointment.find({
      doctor: req.user.userId,
      patient: patientId,
    })
      .populate("patient", "fullName avatarUrl")
      .sort({ date: -1 });

    // Fetch prescriptions and populate limited patient fields
    const prescriptions = await Prescription.find({
      doctor: req.user.userId,
      patient: patientId,
    })
      .populate("patient", "fullName avatarUrl")
      .sort({ date: -1 });

    // Optionally: include patient info separately from one of the populated documents
    // const patient = appointments[0]?.patient || prescriptions[0]?.patient || null;

    res.json({ appointments, prescriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, notes, appointmentid } = req.body;
    console.log("createPrescription", req);

    let prescription = await Prescription.findOne({ appointmentid });

    if (prescription) {
      prescription.medicines = prescription.medicines.concat(medicines);
      if (notes) prescription.notes = notes;
      await prescription.save();
    } else {
      prescription = new Prescription({
        doctor: req.user.userId,
        patientId,
        appointmentid,
        medicines,
        notes,
      });
      await prescription.save();
    }

    res.status(201).json(prescription);
  } catch (err) {
    console.log("createPrescription", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPrescriptionsbyId = async (req, res) => {
  try {
    const patientId = req.params.id;
    const prescription = await Prescription.find({ patientId })
      .populate("patientId", "fullName avatarUrl")
      .populate("doctor", "fullName");

    // console.log("getPrescriptionbyId", prescription);

    if (!prescription) {
      console.log("Prescription not found for ID:", req.params.id);
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (err) {
    console.error("Error fetching prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePrescriptionbyId = async (req, res) => {
  try {
    const { medicines } = req.body;
    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ message: "Invalid medicines list" });
    }
    const updated = await Prescription.findByIdAndUpdate(
      req.params.id,
      { medicines },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json({ message: "Prescription updated successfully", updated });
  } catch (err) {
    console.error("Error updating prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { today, endOfWeek } = getStartAndEndOfWeek();
    // console.log("Fetching stats for the week:");
    // console.log("Start of week (today):", today);
    // console.log("End of week:", endOfWeek);

    const appointmentsThisWeek = await Appointment.find({
      date: { $gte: today, $lte: endOfWeek },
    });

    // console.log(
    //   "Total appointments found this week:",
    //   appointmentsThisWeek.length
    // );

    const consultationsThisWeek = appointmentsThisWeek.length;

    const newPatients = await Appointment.distinct("patient", {
      doctor: req.user.userId,
      status: "pending",
    });
    const newPatientCount = newPatients.length;

    // console.log("Consultations this week:", consultationsThisWeek);
    // console.log("New patients (status: pending):", newPatientCount);

    res.json({
      consultationsThisWeek,
      newPatients: newPatientCount,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

function getStartAndEndOfWeek() {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { today: start, endOfWeek: end };
}

exports.fetchDoctorAvailability = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await User.findById(doctorId).select("isAvailable role");

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ available: doctor.isAvailable });
  } catch (err) {
    console.error("❌ Error fetching doctor availability:", err);
    res.status(500).json({ message: "Server error" });
  }
};

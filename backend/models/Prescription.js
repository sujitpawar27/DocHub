const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true },
  notes: { type: String },
});

const prescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentid: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  medicines: [medicineSchema],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema); 
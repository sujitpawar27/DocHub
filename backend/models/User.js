const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  age: {
    type: Number,
    min: 0,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: 'India' },
  },

  // For Doctor role
  specialization: { type: String },
  qualifications: { type: [String] },
  experience: { type: Number }, // in years
  availability: {
    type: [{
      day: { type: String },
      slots: [{
        start: { type: String },
        end: { type: String }
      }]
    }],
    default: [],
    required: true
  },

  // For Patient role
  medicalHistory: {
    type: [String], 
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);

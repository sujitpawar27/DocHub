const mongoose = require('mongoose');

const DoctorSlotSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'inperson'],
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('DoctorSlot', DoctorSlotSchema); 
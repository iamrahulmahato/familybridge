const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['blood_pressure', 'weight', 'temperature', 'medication', 'other']
  },
  value: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema); 
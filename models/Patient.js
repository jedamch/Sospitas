const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  age:             { type: Number, required: true },
  symptoms:        [String],                // e.g. ['fever', 'cough']
  infectionRisk:   { type: String, enum: ['low', 'medium', 'high'] },
  isolationNeeded: { type: Boolean, default: false },
  roomId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  createdAt:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
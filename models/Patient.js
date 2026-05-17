const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name:            { type: String, required: true }, // name of the patient
  age:             { type: Number, required: true }, // their age
  symptoms:        [String],                // e.g. ['fever', 'cough'] // symptoms
  infectionRisk:   { type: String, enum: ['low', 'medium', 'high'] }, // boolean risk
  isolationNeeded: { type: Boolean, default: false },
  roomId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  createdAt:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber:   { type: String, required: true, unique: true },
  isIsolation:  { type: Boolean, default: false },  // isolation room or standard
  isOccupied:   { type: Boolean, default: false },
  patientId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
});

module.exports = mongoose.model('Room', roomSchema);
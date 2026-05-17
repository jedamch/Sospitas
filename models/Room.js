const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber:   { type: String, required: true, unique: true },
  isIsolation:  { type: Boolean, default: false },  // normal room for isolation room
  isOccupied:   { type: Boolean, default: false }, // checking if the room already has people in it
  patientId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null } // Patient ID if the room is occupied.
});

module.exports = mongoose.model('Room', roomSchema);

const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Room = require('../models/Room');

// Helper: calculate isolation priority
function needsIsolation(patient) {
  if (patient.infectionRisk === 'high') return true;
  const highRiskSymptoms = ['fever', 'cough', 'rash', 'vomiting'];
  return patient.symptoms.some(s => highRiskSymptoms.includes(s.toLowerCase()));
}

// GET all patients
router.get('/', async (req, res) => {
  const patients = await Patient.find().populate('roomId');
  res.json(patients);
});

// POST add a new patient (auto-assigns isolation flag)
router.post('/', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    patient.isolationNeeded = needsIsolation(patient);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT assign patient to a room
router.put('/:id/assign-room', async (req, res) => {
  const { roomId } = req.body;
  const patient = await Patient.findById(req.params.id);
  const room = await Room.findById(roomId);

  if (!room || room.isOccupied)
    return res.status(400).json({ error: 'Room unavailable' });

  if (patient.isolationNeeded && !room.isIsolation)
    return res.status(400).json({ error: 'Patient needs an isolation room' });

  patient.roomId = room._id;
  room.isOccupied = true;
  room.patientId = patient._id;

  await patient.save();
  await room.save();
  res.json({ patient, room });
});

module.exports = router;
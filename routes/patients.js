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

router.put('/:id/assign-room', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Find any available room
    const query = { isOccupied: false };
    if (patient.isolationNeeded) query.isIsolation = true;

    const room = await Room.findOne(query);
    console.log('Looking for room with query:', query);
    console.log('Found room:', room);

    if (!room) return res.status(400).json({ error: 'No suitable rooms available' });

    patient.roomId = room._id;
    room.isOccupied = true;
    room.patientId  = patient._id;

    await patient.save();
    await room.save();
    res.json({ patient, room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/patients/:id
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Free up their room if assigned
    if (patient.roomId) {
      await Room.findByIdAndUpdate(patient.roomId, { isOccupied: false, patientId: null });
    }

    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
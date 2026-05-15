const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Patient = require('../models/Patient');

// GET all rooms
router.get('/', async (req, res) => {
  const rooms = await Room.find().populate('patientId');
  res.json(rooms);
});

// POST add a room
router.post('/', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE discharge patient from room
router.delete('/:id/discharge', async (req, res) => {
  const room = await Room.findById(req.params.id);
  room.isOccupied = false;
  room.patientId = null;
  await room.save();
  res.json({ message: 'Patient discharged', room });
});

module.exports = router;

// DELETE /api/rooms/:id/discharge
router.delete('/:id/discharge', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Clear the patient's room assignment too
    if (room.patientId) {
      await Patient.findByIdAndUpdate(room.patientId, { roomId: null });
    }

    room.isOccupied = false;
    room.patientId  = null;
    await room.save();

    res.json({ message: 'Patient discharged', room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
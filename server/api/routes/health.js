const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const HealthRecord = require('../../models/HealthRecord');

// @route   GET api/health
// @desc    Get all health records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/health
// @desc    Add new health record
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, value, notes } = req.body;

    const newRecord = new HealthRecord({
      type,
      value,
      notes,
      user: req.user.id
    });

    const record = await newRecord.save();
    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/health/:id
// @desc    Update health record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, value, notes } = req.body;

    let record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    // Check user
    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    record = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      { $set: { type, value, notes } },
      { new: true }
    );

    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/health/:id
// @desc    Delete health record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    // Check user
    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await HealthRecord.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
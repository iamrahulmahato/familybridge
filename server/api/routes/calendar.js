const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const CalendarEvent = require('../../models/CalendarEvent');

// @route   GET api/calendar
// @desc    Get all calendar events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ user: req.user.id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/calendar
// @desc    Add new calendar event
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, type } = req.body;

    const newEvent = new CalendarEvent({
      title,
      description,
      date,
      type,
      user: req.user.id
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/calendar/:id
// @desc    Update calendar event
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, date, type } = req.body;

    let event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check user
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, date, type } },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/calendar/:id
// @desc    Delete calendar event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check user
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await CalendarEvent.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
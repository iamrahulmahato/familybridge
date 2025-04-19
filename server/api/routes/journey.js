const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Journey = require('../../models/Journey');

// @route   GET api/journey
// @desc    Get all journeys
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user.id }).sort({ date: -1 });
    res.json(journeys);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/journey
// @desc    Add new journey
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const newJourney = new Journey({
      title,
      description,
      date,
      location,
      user: req.user.id
    });

    const journey = await newJourney.save();
    res.json(journey);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
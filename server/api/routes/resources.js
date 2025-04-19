const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Resource = require('../../models/Resource');

// @route   GET api/resources
// @desc    Get all resources
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/resources
// @desc    Add new resource
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, url, type } = req.body;

    const newResource = new Resource({
      title,
      description,
      url,
      type,
      user: req.user.id
    });

    const resource = await newResource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
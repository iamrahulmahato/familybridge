const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Message = require('../../models/Message');

// @route   GET api/communication/messages/:familyId
// @desc    Get messages for a family
// @access  Private
router.get('/messages/:familyId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ family: req.params.familyId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar');
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/communication/messages
// @desc    Send a message
// @access  Private
router.post('/messages', auth, async (req, res) => {
  try {
    const { content, familyId } = req.body;

    const newMessage = new Message({
      content,
      family: familyId,
      sender: req.user.id
    });

    const message = await newMessage.save();
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    res.json(populatedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
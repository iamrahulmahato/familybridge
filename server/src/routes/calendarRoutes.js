const express = require('express');
const router = express.Router();
const { eventController, transportationController, calendarSyncController } = require('../controllers/calendarController');
const auth = require('../middleware/auth');

// Event routes
router.post('/events', auth, eventController.createEvent);
router.get('/events', auth, eventController.getEvents);
router.patch('/events/:eventId', auth, eventController.updateEvent);

// Transportation routes
router.post('/events/:eventId/transportation', auth, transportationController.createTransportation);
router.patch('/transportation/:transportationId/status', auth, transportationController.updateStatus);

// Calendar sync routes
router.post('/sync', auth, calendarSyncController.connectCalendar);
router.patch('/sync/:syncId/settings', auth, calendarSyncController.updateSettings);

module.exports = router; 
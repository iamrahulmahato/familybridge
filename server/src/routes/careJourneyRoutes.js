const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateUser } = require('../middleware/auth');
const careJourneyController = require('../controllers/careJourneyController');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Timeline Routes
router.post('/timeline', authenticateUser, careJourneyController.createTimelineEvent);
router.get('/timeline', authenticateUser, careJourneyController.getTimelineEvents);

// Medical History Routes
router.post('/medical', authenticateUser, careJourneyController.addMedicalRecord);
router.get('/medical', authenticateUser, careJourneyController.getMedicalHistory);

// School Progress Routes
router.post('/school', authenticateUser, careJourneyController.addSchoolProgress);
router.get('/school', authenticateUser, careJourneyController.getSchoolProgress);

// Memory Routes
router.post('/memories', authenticateUser, upload.array('files', 5), careJourneyController.addMemory);
router.get('/memories', authenticateUser, careJourneyController.getMemories);

// Future Planning Routes
router.post('/plans', authenticateUser, careJourneyController.createFuturePlan);
router.get('/plans', authenticateUser, careJourneyController.getFuturePlans);
router.put('/plans/:planId/status', authenticateUser, careJourneyController.updatePlanStatus);

// Sharing Routes
router.post('/:journeyId/share', authenticateUser, careJourneyController.shareWithFamily);

module.exports = router; 
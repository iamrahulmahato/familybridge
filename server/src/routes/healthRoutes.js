const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateUser } = require('../middleware/auth');
const {
  medicationController,
  appointmentController,
  documentController,
  symptomController,
  providerController
} = require('../controllers/healthController');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Medication Routes
router.post('/medications', authenticateUser, medicationController.createMedication);
router.get('/medications', authenticateUser, medicationController.getMedications);
router.put('/medications/:medicationId', authenticateUser, medicationController.updateMedication);

// Appointment Routes
router.post('/appointments', authenticateUser, appointmentController.createAppointment);
router.get('/appointments', authenticateUser, appointmentController.getAppointments);

// Document Routes
router.post('/documents', authenticateUser, upload.single('file'), documentController.uploadDocument);
router.get('/documents', authenticateUser, documentController.getDocuments);
router.get('/documents/emergency-card', authenticateUser, documentController.generateEmergencyCard);

// Symptom Routes
router.post('/symptoms', authenticateUser, symptomController.logSymptom);
router.get('/symptoms', authenticateUser, symptomController.getSymptomLogs);

// Provider Routes
router.post('/providers', authenticateUser, providerController.addProvider);
router.get('/providers', authenticateUser, providerController.getProviders);

module.exports = router; 
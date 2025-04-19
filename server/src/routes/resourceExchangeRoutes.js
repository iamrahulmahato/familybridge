const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const resourceExchangeController = require('../controllers/resourceExchangeController');

// Community Resource Routes
router.post('/resources', authenticateUser, resourceExchangeController.addCommunityResource);
router.get('/resources', resourceExchangeController.getCommunityResources);

// Service Provider Routes
router.post('/providers', authenticateUser, resourceExchangeController.addServiceProvider);
router.get('/providers', resourceExchangeController.getServiceProviders);
router.post('/providers/:providerId/rate', authenticateUser, resourceExchangeController.rateProvider);

// Legal Guide Routes
router.post('/legal-guides', authenticateUser, resourceExchangeController.addLegalGuide);
router.get('/legal-guides', resourceExchangeController.getLegalGuides);

// Equipment Exchange Routes
router.post('/equipment', authenticateUser, resourceExchangeController.addEquipment);
router.get('/equipment', resourceExchangeController.getEquipment);
router.put('/equipment/:equipmentId/availability', authenticateUser, resourceExchangeController.updateEquipmentAvailability);

// Location-based Search
router.get('/search', resourceExchangeController.searchByLocation);

module.exports = router; 
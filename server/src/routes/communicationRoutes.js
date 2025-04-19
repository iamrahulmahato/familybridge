const express = require('express');
const router = express.Router();
const { messageController, conversationController, notificationController } = require('../controllers/communicationController');
const auth = require('../middleware/auth');

// Message routes
router.post('/messages', auth, messageController.createMessage);
router.get('/conversations/:conversationId/messages', auth, messageController.getMessages);
router.post('/messages/read', auth, messageController.markAsRead);

// Conversation routes
router.post('/conversations', auth, conversationController.createConversation);
router.get('/conversations', auth, conversationController.getConversations);
router.patch('/conversations/:conversationId/settings', auth, conversationController.updateSettings);

// Notification routes
router.post('/notifications', auth, notificationController.createNotification);
router.get('/notifications', auth, notificationController.getNotifications);
router.post('/notifications/read', auth, notificationController.markAsRead);

module.exports = router; 
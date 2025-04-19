const { Message, Conversation, Notification } = require('../models/Communication');
const { User } = require('../models/User');
const { Op } = require('sequelize');

// Message Controllers
const messageController = {
  // Create a new message
  async createMessage(req, res) {
    try {
      const { conversationId, content, type = 'text', replyTo, attachments } = req.body;
      const senderId = req.user.id;

      const message = await Message.create({
        conversationId,
        senderId,
        content,
        type,
        replyTo,
        attachments,
        deliveredTo: [senderId]
      });

      // Update conversation's last message
      await Conversation.update(
        {
          lastMessage: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            type: message.type,
            createdAt: message.createdAt
          }
        },
        { where: { id: conversationId } }
      );

      return res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      return res.status(500).json({ error: 'Failed to create message' });
    }
  },

  // Get messages for a conversation
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const messages = await Message.findByConversation(conversationId, limit, offset);
      return res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  },

  // Mark messages as read
  async markAsRead(req, res) {
    try {
      const { messageIds } = req.body;
      const userId = req.user.id;

      await Message.update(
        {
          readBy: sequelize.fn('array_append', sequelize.col('readBy'), userId)
        },
        {
          where: {
            id: { [Op.in]: messageIds },
            readBy: { [Op.not]: { [Op.contains]: [userId] } }
          }
        }
      );

      return res.json({ success: true });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return res.status(500).json({ error: 'Failed to mark messages as read' });
    }
  }
};

// Conversation Controllers
const conversationController = {
  // Create a new conversation
  async createConversation(req, res) {
    try {
      const { type, name, participants } = req.body;
      const creatorId = req.user.id;

      // Ensure creator is included in participants
      const allParticipants = [...new Set([...participants, creatorId])];

      const conversation = await Conversation.create({
        type,
        name,
        participants: allParticipants,
        admins: [creatorId]
      });

      return res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      return res.status(500).json({ error: 'Failed to create conversation' });
    }
  },

  // Get user's conversations
  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await Conversation.findByParticipant(userId);
      return res.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  },

  // Update conversation settings
  async updateSettings(req, res) {
    try {
      const { conversationId } = req.params;
      const { settings } = req.body;
      const userId = req.user.id;

      const conversation = await Conversation.findOne({
        where: {
          id: conversationId,
          participants: { [Op.contains]: [userId] }
        }
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      conversation.settings = { ...conversation.settings, ...settings };
      await conversation.save();

      return res.json(conversation);
    } catch (error) {
      console.error('Error updating conversation settings:', error);
      return res.status(500).json({ error: 'Failed to update conversation settings' });
    }
  }
};

// Notification Controllers
const notificationController = {
  // Create a new notification
  async createNotification(req, res) {
    try {
      const { userId, type, title, content, priority, actionUrl, expiresAt } = req.body;

      const notification = await Notification.create({
        userId,
        type,
        title,
        content,
        priority,
        actionUrl,
        expiresAt
      });

      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({ error: 'Failed to create notification' });
    }
  },

  // Get user's notifications
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { unreadOnly = false } = req.query;

      const where = { userId };
      if (unreadOnly) {
        where.read = false;
      }

      const notifications = await Notification.findAll({
        where,
        order: [['createdAt', 'DESC']]
      });

      return res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  // Mark notifications as read
  async markAsRead(req, res) {
    try {
      const { notificationIds } = req.body;
      const userId = req.user.id;

      await Notification.update(
        { read: true },
        {
          where: {
            id: { [Op.in]: notificationIds },
            userId
          }
        }
      );

      return res.json({ success: true });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
  }
};

module.exports = {
  messageController,
  conversationController,
  notificationController
}; 
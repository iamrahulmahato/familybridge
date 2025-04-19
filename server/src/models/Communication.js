const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Message model for individual messages
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Conversations',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'voice', 'video', 'location', 'task', 'event'),
    defaultValue: 'text'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  readBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  deliveredTo: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  replyTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Messages',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['conversationId']
    },
    {
      fields: ['senderId']
    }
  ]
});

// Conversation model for group or one-on-one chats
const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('direct', 'group', 'announcement'),
    defaultValue: 'direct'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true // Required for group chats
  },
  participants: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false
  },
  admins: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  lastMessage: {
    type: DataTypes.JSON,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {
      notifications: true,
      muted: false,
      pinned: false
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['participants']
    },
    {
      fields: ['type']
    }
  ]
});

// Notification model for system and user notifications
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'message',
      'task',
      'event',
      'health',
      'reminder',
      'system',
      'announcement'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  actionUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['read']
    }
  ]
});

// Establish relationships
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

// Class methods for Message
Message.findByConversation = async function(conversationId, limit = 50, offset = 0) {
  return this.findAll({
    where: { conversationId },
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
};

// Class methods for Conversation
Conversation.findByParticipant = async function(userId) {
  return this.findAll({
    where: {
      participants: {
        [Op.contains]: [userId]
      }
    },
    order: [['updatedAt', 'DESC']]
  });
};

// Class methods for Notification
Notification.findUnreadByUser = async function(userId) {
  return this.findAll({
    where: {
      userId,
      read: false
    },
    order: [['createdAt', 'DESC']]
  });
};

module.exports = {
  Message,
  Conversation,
  Notification
}; 
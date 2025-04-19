const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Timeline Model
const Timeline = sequelize.define('Timeline', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('medical', 'educational', 'social', 'milestone', 'other'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  importance: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  relatedEvents: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// Medical History Model
const MedicalHistory = sequelize.define('MedicalHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diagnosisDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('active', 'resolved', 'chronic', 'in_treatment'),
    defaultValue: 'active'
  },
  severity: {
    type: DataTypes.ENUM('mild', 'moderate', 'severe'),
    allowNull: true
  },
  treatments: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ type, description, startDate, endDate }]
    defaultValue: []
  },
  medications: {
    type: DataTypes.ARRAY(DataTypes.UUID), // References to Medication model
    defaultValue: []
  },
  providers: {
    type: DataTypes.ARRAY(DataTypes.UUID), // References to HealthcareProvider model
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  familyHistory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Educational Progress Model
const EducationalProgress = sequelize.define('EducationalProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('academic', 'developmental', 'behavioral', 'social'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  milestone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  assessment: {
    type: DataTypes.JSON, // { scores, observations, recommendations }
    defaultValue: {}
  },
  provider: {
    type: DataTypes.STRING // Teacher, therapist, counselor, etc.
  },
  goals: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ description, targetDate, status }]
    defaultValue: []
  },
  interventions: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ type, description, startDate, endDate, outcome }]
    defaultValue: []
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

// Memory Model
const Memory = sequelize.define('Memory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('photo', 'video', 'audio', 'text', 'document'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.JSON // { name, coordinates }
  },
  people: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  mediaUrl: {
    type: DataTypes.STRING
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Care Plan Model
const CarePlan = sequelize.define('CarePlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('medical', 'educational', 'behavioral', 'comprehensive'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE
  },
  goals: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ description, targetDate, status, measures }]
    defaultValue: []
  },
  interventions: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ type, description, frequency, responsibility }]
    defaultValue: []
  },
  providers: {
    type: DataTypes.ARRAY(DataTypes.UUID), // References to HealthcareProvider model
    defaultValue: []
  },
  medications: {
    type: DataTypes.ARRAY(DataTypes.UUID), // References to Medication model
    defaultValue: []
  },
  appointments: {
    type: DataTypes.ARRAY(DataTypes.UUID), // References to MedicalAppointment model
    defaultValue: []
  },
  emergencyPlan: {
    type: DataTypes.JSON, // { contacts, instructions, medications }
    defaultValue: {}
  },
  progress: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ date, notes, measurements }]
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed', 'archived'),
    defaultValue: 'draft'
  },
  reviews: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ date, reviewer, notes, changes }]
    defaultValue: []
  }
});

// Define relationships
Timeline.belongsTo(MedicalHistory, { as: 'medicalEvent', constraints: false });
Timeline.belongsTo(EducationalProgress, { as: 'educationalEvent', constraints: false });
Timeline.belongsTo(Memory, { as: 'memoryEvent', constraints: false });

CarePlan.hasMany(Timeline);
Timeline.belongsTo(CarePlan);

const CareJourney = sequelize.define('CareJourney', {
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
    type: DataTypes.ENUM('timeline', 'medical', 'school', 'memory', 'future_plan'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.JSONB)
  },
  metadata: {
    type: DataTypes.JSONB
  },
  // Timeline specific fields
  eventType: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  // Medical specific fields
  medicalType: {
    type: DataTypes.ENUM('diagnosis', 'treatment', 'medication', 'test', 'procedure')
  },
  provider: {
    type: DataTypes.STRING
  },
  // School specific fields
  academicYear: {
    type: DataTypes.STRING
  },
  subject: {
    type: DataTypes.STRING
  },
  grade: {
    type: DataTypes.STRING
  },
  // Memory specific fields
  memoryType: {
    type: DataTypes.ENUM('photo', 'video', 'story', 'milestone')
  },
  // Future planning specific fields
  planType: {
    type: DataTypes.ENUM('education', 'healthcare', 'legal', 'financial', 'housing')
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed'),
    defaultValue: 'planned'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  sharedWith: {
    type: DataTypes.ARRAY(DataTypes.UUID)
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'type']
    },
    {
      fields: ['date']
    },
    {
      fields: ['category']
    }
  ]
});

// Class methods
CareJourney.findByDateRange = async function(userId, startDate, endDate) {
  return await this.findAll({
    where: {
      userId,
      date: {
        [Op.between]: [startDate, endDate]
      }
    },
    order: [['date', 'ASC']]
  });
};

CareJourney.findByType = async function(userId, type) {
  return await this.findAll({
    where: { userId, type },
    order: [['date', 'DESC']]
  });
};

// Instance methods
CareJourney.prototype.shareWithFamily = async function(familyMemberIds) {
  this.sharedWith = [...new Set([...this.sharedWith, ...familyMemberIds])];
  await this.save();
};

CareJourney.prototype.addAttachment = async function(attachment) {
  this.attachments = [...this.attachments, attachment];
  await this.save();
};

// Export models
module.exports = {
  Timeline,
  MedicalHistory,
  EducationalProgress,
  Memory,
  CarePlan,
  CareJourney
}; 
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled', 'overdue'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  category: {
    type: DataTypes.ENUM(
      'medication',
      'appointment',
      'shopping',
      'household',
      'transportation',
      'social',
      'education',
      'health',
      'other'
    ),
    defaultValue: 'other'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimatedDuration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  recurrence: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  dependencies: {
    type: DataTypes.ARRAY(DataTypes.UUID), // Array of task IDs that must be completed first
    defaultValue: []
  },
  subtasks: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  reminders: {
    type: DataTypes.JSON,
    defaultValue: {
      enabled: true,
      timing: [24, 1], // hours before due date
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['createdBy']
    },
    {
      fields: ['assignedTo']
    },
    {
      fields: ['status']
    },
    {
      fields: ['dueDate']
    },
    {
      fields: ['category']
    }
  ]
});

// Class method to find tasks by date range
Task.findByDateRange = async function(startDate, endDate, userId, type = 'assigned') {
  const where = {
    dueDate: {
      [Op.between]: [startDate, endDate]
    }
  };
  
  if (type === 'assigned') {
    where.assignedTo = userId;
  } else if (type === 'created') {
    where.createdBy = userId;
  }

  return this.findAll({
    where,
    order: [['dueDate', 'ASC']]
  });
};

// Class method to find overdue tasks
Task.findOverdueTasks = async function(userId) {
  return this.findAll({
    where: {
      assignedTo: userId,
      status: {
        [Op.notIn]: ['completed', 'cancelled']
      },
      dueDate: {
        [Op.lt]: new Date()
      }
    }
  });
};

// Instance method to complete a task
Task.prototype.complete = async function(completedBy) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progress = 100;
  this.metadata = {
    ...this.metadata,
    completedBy
  };
  return this.save();
};

// Instance method to assign task
Task.prototype.assign = async function(userId) {
  this.assignedTo = userId;
  this.status = 'pending';
  return this.save();
};

// Instance method to update progress
Task.prototype.updateProgress = async function(progress) {
  this.progress = progress;
  if (progress === 100) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (progress > 0) {
    this.status = 'in_progress';
  }
  return this.save();
};

// Task Template Model
const TaskTemplate = sequelize.define('TaskTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.ENUM('medical', 'education', 'household', 'transportation', 'social', 'other'),
    defaultValue: 'other'
  },
  estimatedDuration: {
    type: DataTypes.INTEGER // minutes
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  steps: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ order, description, estimated_time }]
    defaultValue: []
  },
  requiredSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  resources: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ type, description, link }]
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// Task Assignment Model
const TaskAssignment = sequelize.define('TaskAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  templateId: {
    type: DataTypes.UUID,
    references: {
      model: 'TaskTemplates',
      key: 'id'
    },
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  assignedBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'delayed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE
  },
  completedDate: {
    type: DataTypes.DATE
  },
  category: {
    type: DataTypes.ENUM('medical', 'education', 'household', 'transportation', 'social', 'other'),
    defaultValue: 'other'
  },
  location: {
    type: DataTypes.JSON // { address, coordinates }
  },
  steps: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ order, description, completed }]
    defaultValue: []
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  recurrence: {
    type: DataTypes.JSON, // { frequency, interval, until }
    defaultValue: null
  },
  reminders: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ time, type }]
    defaultValue: []
  },
  dependencies: {
    type: DataTypes.ARRAY(DataTypes.UUID), // [taskId]
    defaultValue: []
  }
});

// Workload Metrics Model
const WorkloadMetrics = sequelize.define('WorkloadMetrics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  period: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  taskCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completedTasks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalDuration: {
    type: DataTypes.INTEGER, // minutes
    defaultValue: 0
  },
  categoryBreakdown: {
    type: DataTypes.JSON, // { category: count }
    defaultValue: {}
  },
  priorityBreakdown: {
    type: DataTypes.JSON, // { priority: count }
    defaultValue: {}
  },
  averageCompletionTime: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  onTimeCompletion: {
    type: DataTypes.FLOAT, // percentage
    defaultValue: 100
  },
  workloadScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  availableHours: {
    type: DataTypes.JSON, // { day: hours }
    defaultValue: {}
  },
  preferences: {
    type: DataTypes.JSON, // { maxTasksPerDay, preferredCategories, etc. }
    defaultValue: {}
  }
});

// Define relationships
TaskAssignment.belongsTo(TaskTemplate, { foreignKey: 'templateId' });
WorkloadMetrics.hasMany(TaskAssignment);
TaskAssignment.belongsTo(WorkloadMetrics);

// Instance methods
TaskAssignment.prototype.isOverdue = function() {
  return this.dueDate < new Date() && this.status !== 'completed';
};

// Class methods
TaskTemplate.findByCategory = async function(category) {
  return await this.findAll({
    where: { category }
  });
};

WorkloadMetrics.calculateUserMetrics = async function(userId, startDate, endDate) {
  const tasks = await TaskAssignment.findAll({
    where: {
      assignedTo: userId,
      dueDate: {
        [Op.between]: [startDate, endDate]
      }
    }
  });

  // Calculate metrics
  const metrics = {
    taskCount: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    categoryBreakdown: {},
    priorityBreakdown: {}
  };

  // Add more complex calculations here

  return metrics;
};

module.exports = {
  TaskTemplate,
  TaskAssignment,
  WorkloadMetrics
}; 
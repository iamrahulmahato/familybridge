const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Calendar Event Model
const CalendarEvent = sequelize.define('CalendarEvent', {
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
    type: DataTypes.TEXT
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.JSON, // { address, coordinates: { lat, lng } }
    defaultValue: {}
  },
  type: {
    type: DataTypes.ENUM('appointment', 'medication', 'task', 'social', 'other'),
    defaultValue: 'other'
  },
  recurrence: {
    type: DataTypes.JSON, // { frequency, interval, until, byDay, etc. }
    defaultValue: null
  },
  participants: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  reminders: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ type, time }]
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// Transportation Coordination Model
const TransportationCoordination = sequelize.define('TransportationCoordination', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'CalendarEvents',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('pickup', 'dropoff', 'round-trip'),
    allowNull: false
  },
  provider: {
    type: DataTypes.ENUM('family', 'service', 'self'),
    defaultValue: 'family'
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true
  },
  pickupLocation: {
    type: DataTypes.JSON, // { address, coordinates: { lat, lng } }
    allowNull: false
  },
  dropoffLocation: {
    type: DataTypes.JSON,
    allowNull: false
  },
  pickupTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dropoffTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// External Calendar Sync Model
const ExternalCalendarSync = sequelize.define('ExternalCalendarSync', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  provider: {
    type: DataTypes.ENUM('google', 'apple', 'outlook'),
    allowNull: false
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  calendarId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastSync: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  syncEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  syncSettings: {
    type: DataTypes.JSON,
    defaultValue: {
      syncDirection: 'bidirectional',
      eventTypes: ['all'],
      syncFrequency: 15 // minutes
    }
  }
});

// Define relationships
CalendarEvent.hasOne(TransportationCoordination);
TransportationCoordination.belongsTo(CalendarEvent);

// Instance methods
CalendarEvent.prototype.hasConflict = async function() {
  const overlappingEvents = await CalendarEvent.findAll({
    where: {
      id: { [Op.ne]: this.id },
      [Op.or]: [
        {
          startTime: {
            [Op.between]: [this.startTime, this.endTime]
          }
        },
        {
          endTime: {
            [Op.between]: [this.startTime, this.endTime]
          }
        }
      ],
      participants: {
        [Op.overlap]: this.participants
      }
    }
  });
  return overlappingEvents.length > 0;
};

// Class methods
CalendarEvent.findConflicts = async function(startTime, endTime, participants) {
  return await this.findAll({
    where: {
      [Op.or]: [
        {
          startTime: {
            [Op.between]: [startTime, endTime]
          }
        },
        {
          endTime: {
            [Op.between]: [startTime, endTime]
          }
        }
      ],
      participants: {
        [Op.overlap]: participants
      }
    }
  });
};

module.exports = {
  CalendarEvent,
  TransportationCoordination,
  ExternalCalendarSync
}; 
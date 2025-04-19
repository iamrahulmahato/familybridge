const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Health = sequelize.define('Health', {
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
    type: DataTypes.ENUM('medication', 'vital', 'symptom', 'appointment', 'test_result', 'note'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  // Medication specific fields
  medication: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    // Example structure:
    // {
    //   name: 'string',
    //   dosage: 'string',
    //   frequency: 'string',
    //   startDate: 'date',
    //   endDate: 'date',
    //   instructions: 'string',
    //   sideEffects: ['string'],
    //   interactions: ['string'],
    //   prescribedBy: 'string'
    // }
  },
  // Vital signs specific fields
  vitals: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    // Example structure:
    // {
    //   bloodPressure: { systolic: number, diastolic: number },
    //   heartRate: number,
    //   temperature: number,
    //   respiratoryRate: number,
    //   oxygenSaturation: number,
    //   weight: number
    // }
  },
  // Symptom specific fields
  symptoms: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    // Example structure:
    // {
    //   name: 'string',
    //   severity: number,
    //   duration: 'string',
    //   triggers: ['string'],
    //   alleviatingFactors: ['string'],
    //   aggravatingFactors: ['string']
    // }
  },
  // Appointment specific fields
  appointment: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    // Example structure:
    // {
    //   provider: 'string',
    //   location: 'string',
    //   type: 'string',
    //   notes: 'string',
    //   followUp: 'date'
    // }
  },
  // Test result specific fields
  testResult: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    // Example structure:
    // {
    //   testName: 'string',
    //   result: 'string',
    //   range: { min: number, max: number },
    //   unit: 'string',
    //   orderedBy: 'string',
    //   facility: 'string'
    // }
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled', 'scheduled'),
    defaultValue: 'active'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  sharedWith: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  reminders: {
    type: DataTypes.JSON,
    defaultValue: {
      enabled: false,
      frequency: null,
      times: [],
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
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
      fields: ['date']
    }
  ]
});

// Class method to find records by date range
Health.findByDateRange = async function(startDate, endDate, userId, type = null) {
  const where = {
    userId,
    date: {
      [Op.between]: [startDate, endDate]
    }
  };
  if (type) {
    where.type = type;
  }
  return this.findAll({
    where,
    order: [['date', 'DESC']]
  });
};

// Class method to find active medications
Health.findActiveMedications = async function(userId) {
  return this.findAll({
    where: {
      userId,
      type: 'medication',
      status: 'active'
    }
  });
};

// Instance method to share record
Health.prototype.shareWith = async function(userIds) {
  this.sharedWith = [...new Set([...this.sharedWith, ...userIds])];
  return this.save();
};

// Medication Model
const Medication = sequelize.define('Medication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  frequency: {
    type: DataTypes.JSON, // { times: [], interval: "daily"|"weekly"|"monthly", specificDays: [] }
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT
  },
  prescribedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'HealthcareProviders',
      key: 'id'
    }
  },
  pharmacy: {
    type: DataTypes.JSON // { name, phone, address }
  },
  reminders: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ time, type }]
    defaultValue: []
  },
  sideEffects: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'discontinued'),
    defaultValue: 'active'
  },
  refills: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nextRefillDate: {
    type: DataTypes.DATE
  }
});

// Medical Appointment Model
const MedicalAppointment = sequelize.define('MedicalAppointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  providerId: {
    type: DataTypes.UUID,
    references: {
      model: 'HealthcareProviders',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // minutes
    defaultValue: 30
  },
  location: {
    type: DataTypes.JSON // { address, coordinates }
  },
  reason: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT
  },
  reminders: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    defaultValue: []
  },
  preAppointmentInstructions: {
    type: DataTypes.TEXT
  },
  postAppointmentNotes: {
    type: DataTypes.TEXT
  }
});

// Health Document Model
const HealthDocument = sequelize.define('HealthDocument', {
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
    type: DataTypes.ENUM('lab_result', 'prescription', 'imaging', 'clinical_notes', 'insurance', 'other'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  providerId: {
    type: DataTypes.UUID,
    references: {
      model: 'HealthcareProviders',
      key: 'id'
    }
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// Symptom Log Model
const SymptomLog = sequelize.define('SymptomLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  symptom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  severity: {
    type: DataTypes.INTEGER, // 1-10
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  duration: {
    type: DataTypes.INTEGER // minutes
  },
  triggers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  relatedMedications: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  }
});

// Healthcare Provider Model
const HealthcareProvider = sequelize.define('HealthcareProvider', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING
  },
  facility: {
    type: DataTypes.STRING
  },
  contact: {
    type: DataTypes.JSON, // { phone, email, fax }
    allowNull: false
  },
  address: {
    type: DataTypes.JSON, // { street, city, state, zip, coordinates }
    allowNull: false
  },
  availability: {
    type: DataTypes.JSON, // { days: [], hours: {} }
    defaultValue: {}
  },
  insuranceAccepted: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  rating: {
    type: DataTypes.FLOAT
  },
  notes: {
    type: DataTypes.TEXT
  }
});

// Define relationships
Medication.belongsTo(HealthcareProvider, { as: 'prescriber', foreignKey: 'prescribedBy' });
MedicalAppointment.belongsTo(HealthcareProvider);
HealthDocument.belongsTo(HealthcareProvider);

// Export models
module.exports = {
  Medication,
  MedicalAppointment,
  HealthDocument,
  SymptomLog,
  HealthcareProvider
}; 
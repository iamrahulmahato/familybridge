const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Resource Model
const Resource = sequelize.define('Resource', {
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
  type: {
    type: DataTypes.ENUM('article', 'video', 'document', 'link', 'template', 'guide'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('medical', 'educational', 'legal', 'financial', 'caregiving', 'other'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  author: {
    type: DataTypes.STRING
  },
  publishedDate: {
    type: DataTypes.DATE
  },
  lastUpdated: {
    type: DataTypes.DATE
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// Service Provider Model
const ServiceProvider = sequelize.define('ServiceProvider', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('medical', 'educational', 'therapy', 'transportation', 'homecare', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  contact: {
    type: DataTypes.JSON, // { phone, email, website }
    allowNull: false
  },
  address: {
    type: DataTypes.JSON, // { street, city, state, zip, coordinates }
    allowNull: false
  },
  services: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  availability: {
    type: DataTypes.JSON, // { days: [], hours: {} }
    defaultValue: {}
  },
  pricing: {
    type: DataTypes.JSON, // { service: price }
    defaultValue: {}
  },
  insurance: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  certifications: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  reviews: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ userId, rating, comment, date }]
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'active'
  }
});

// Equipment Model
const Equipment = sequelize.define('Equipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('mobility', 'medical', 'assistive', 'therapeutic', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  condition: {
    type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
    allowNull: false
  },
  availability: {
    type: DataTypes.ENUM('available', 'in_use', 'maintenance', 'reserved'),
    defaultValue: 'available'
  },
  owner: {
    type: DataTypes.UUID
  },
  currentUser: {
    type: DataTypes.UUID
  },
  location: {
    type: DataTypes.JSON // { address, coordinates }
  },
  specifications: {
    type: DataTypes.JSON, // { dimensions, weight, features }
    defaultValue: {}
  },
  maintenanceHistory: {
    type: DataTypes.ARRAY(DataTypes.JSON), // [{ date, type, notes }]
    defaultValue: []
  },
  instructions: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

// Community Resource Model
const CommunityResource = sequelize.define('CommunityResource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('support_group', 'event', 'program', 'facility', 'organization'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.ENUM('medical', 'educational', 'social', 'recreational', 'support', 'other'),
    allowNull: false
  },
  contact: {
    type: DataTypes.JSON, // { name, phone, email }
    allowNull: false
  },
  location: {
    type: DataTypes.JSON, // { address, coordinates }
    allowNull: false
  },
  schedule: {
    type: DataTypes.JSON, // { frequency, days, times }
    defaultValue: {}
  },
  eligibility: {
    type: DataTypes.TEXT
  },
  cost: {
    type: DataTypes.JSON, // { amount, frequency, details }
    defaultValue: {}
  },
  capacity: {
    type: DataTypes.INTEGER
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'full'),
    defaultValue: 'active'
  }
});

// Define relationships
ServiceProvider.hasMany(Equipment);
Equipment.belongsTo(ServiceProvider);

CommunityResource.belongsTo(ServiceProvider);
ServiceProvider.hasMany(CommunityResource);

// Class methods
Resource.findByCategory = async function(category) {
  return await this.findAll({
    where: { category },
    order: [['rating', 'DESC']]
  });
};

ServiceProvider.findByService = async function(service) {
  return await this.findAll({
    where: {
      services: {
        [Op.contains]: [service]
      }
    },
    order: [['rating', 'DESC']]
  });
};

// Export models
module.exports = {
  Resource,
  ServiceProvider,
  Equipment,
  CommunityResource
}; 
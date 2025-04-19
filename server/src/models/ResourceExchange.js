const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResourceExchange = sequelize.define('ResourceExchange', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('community_resource', 'service_provider', 'legal_guide', 'equipment'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  location: {
    type: DataTypes.STRING
  },
  contactInfo: {
    type: DataTypes.JSONB
  },
  metadata: {
    type: DataTypes.JSONB
  },
  // Community Resource specific fields
  resourceType: {
    type: DataTypes.ENUM('article', 'video', 'guide', 'template', 'toolkit')
  },
  author: {
    type: DataTypes.STRING
  },
  // Service Provider specific fields
  providerType: {
    type: DataTypes.STRING
  },
  specialties: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  availability: {
    type: DataTypes.JSONB
  },
  ratings: {
    type: DataTypes.JSONB
  },
  // Legal Guide specific fields
  legalType: {
    type: DataTypes.ENUM('template', 'guide', 'checklist', 'form')
  },
  jurisdiction: {
    type: DataTypes.STRING
  },
  // Equipment specific fields
  equipmentType: {
    type: DataTypes.STRING
  },
  condition: {
    type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor')
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ownerId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['type', 'category']
    },
    {
      fields: ['location']
    },
    {
      fields: ['tags']
    }
  ]
});

// Class methods
ResourceExchange.findByType = async function(type, filters = {}) {
  return await this.findAll({
    where: { type, ...filters },
    order: [['createdAt', 'DESC']]
  });
};

ResourceExchange.findByLocation = async function(location, radius) {
  // Implementation for location-based search
  return await this.findAll({
    where: {
      location: {
        [Op.like]: `%${location}%`
      }
    }
  });
};

// Instance methods
ResourceExchange.prototype.updateRating = async function(rating, userId) {
  const ratings = this.ratings || {};
  ratings[userId] = rating;
  this.ratings = ratings;
  await this.save();
};

ResourceExchange.prototype.updateAvailability = async function(available) {
  this.availability = available;
  await this.save();
};

module.exports = ResourceExchange; 
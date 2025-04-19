const { ResourceExchange } = require('../models');
const { uploadToS3 } = require('../utils/s3');

const resourceExchangeController = {
  // Community Resources
  addCommunityResource: async (req, res) => {
    try {
      const { title, description, resourceType, author, category, tags } = req.body;
      const resource = await ResourceExchange.create({
        type: 'community_resource',
        title,
        description,
        resourceType,
        author,
        category,
        tags
      });
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCommunityResources: async (req, res) => {
    try {
      const { category, tags } = req.query;
      const resources = await ResourceExchange.findByType('community_resource', {
        ...(category && { category }),
        ...(tags && { tags: { [Op.overlap]: tags.split(',') } })
      });
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Service Providers
  addServiceProvider: async (req, res) => {
    try {
      const { title, description, providerType, specialties, contactInfo, location } = req.body;
      const provider = await ResourceExchange.create({
        type: 'service_provider',
        title,
        description,
        providerType,
        specialties,
        contactInfo,
        location
      });
      res.status(201).json(provider);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getServiceProviders: async (req, res) => {
    try {
      const { providerType, location, specialties } = req.query;
      const providers = await ResourceExchange.findByType('service_provider', {
        ...(providerType && { providerType }),
        ...(location && { location }),
        ...(specialties && { specialties: { [Op.overlap]: specialties.split(',') } })
      });
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  rateProvider: async (req, res) => {
    try {
      const { providerId } = req.params;
      const { rating } = req.body;
      const provider = await ResourceExchange.findByPk(providerId);
      
      if (!provider) {
        return res.status(404).json({ error: 'Provider not found' });
      }

      await provider.updateRating(rating, req.user.id);
      res.json(provider);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Legal Guides
  addLegalGuide: async (req, res) => {
    try {
      const { title, description, legalType, jurisdiction, category } = req.body;
      const guide = await ResourceExchange.create({
        type: 'legal_guide',
        title,
        description,
        legalType,
        jurisdiction,
        category
      });
      res.status(201).json(guide);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLegalGuides: async (req, res) => {
    try {
      const { legalType, jurisdiction } = req.query;
      const guides = await ResourceExchange.findByType('legal_guide', {
        ...(legalType && { legalType }),
        ...(jurisdiction && { jurisdiction })
      });
      res.json(guides);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Equipment Exchange
  addEquipment: async (req, res) => {
    try {
      const { title, description, equipmentType, condition, location } = req.body;
      const equipment = await ResourceExchange.create({
        type: 'equipment',
        title,
        description,
        equipmentType,
        condition,
        location,
        ownerId: req.user.id
      });
      res.status(201).json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEquipment: async (req, res) => {
    try {
      const { equipmentType, location, condition } = req.query;
      const equipment = await ResourceExchange.findByType('equipment', {
        ...(equipmentType && { equipmentType }),
        ...(location && { location }),
        ...(condition && { condition })
      });
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateEquipmentAvailability: async (req, res) => {
    try {
      const { equipmentId } = req.params;
      const { available } = req.body;
      const equipment = await ResourceExchange.findByPk(equipmentId);
      
      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' });
      }

      await equipment.updateAvailability(available);
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Location-based Search
  searchByLocation: async (req, res) => {
    try {
      const { location, radius, type } = req.query;
      const results = await ResourceExchange.findByLocation(location, radius, type);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = resourceExchangeController; 
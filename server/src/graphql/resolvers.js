const { User, CareJourney, ResourceExchange } = require('../models');
const { Op } = require('sequelize');

const resolvers = {
  Query: {
    // User resolvers
    user: async (_, { id }) => {
      return await User.findByPk(id);
    },
    users: async () => {
      return await User.findAll();
    },

    // Care Journey resolvers
    timelineEvents: async (_, { userId, startDate, endDate }) => {
      return await CareJourney.findByDateRange(userId, startDate, endDate);
    },
    medicalHistory: async (_, { userId }) => {
      return await CareJourney.findByType(userId, 'medical');
    },
    schoolProgress: async (_, { userId }) => {
      return await CareJourney.findByType(userId, 'school');
    },
    memories: async (_, { userId }) => {
      return await CareJourney.findByType(userId, 'memory');
    },
    futurePlans: async (_, { userId }) => {
      return await CareJourney.findByType(userId, 'future_plan');
    },

    // Resource Exchange resolvers
    communityResources: async (_, { category, tags }) => {
      return await ResourceExchange.findByType('community_resource', {
        ...(category && { category }),
        ...(tags && { tags: { [Op.overlap]: tags } })
      });
    },
    serviceProviders: async (_, { providerType, location, specialties }) => {
      return await ResourceExchange.findByType('service_provider', {
        ...(providerType && { providerType }),
        ...(location && { location }),
        ...(specialties && { specialties: { [Op.overlap]: specialties } })
      });
    },
    legalGuides: async (_, { legalType, jurisdiction }) => {
      return await ResourceExchange.findByType('legal_guide', {
        ...(legalType && { legalType }),
        ...(jurisdiction && { jurisdiction })
      });
    },
    equipment: async (_, { equipmentType, location, condition }) => {
      return await ResourceExchange.findByType('equipment', {
        ...(equipmentType && { equipmentType }),
        ...(location && { location }),
        ...(condition && { condition })
      });
    }
  },

  Mutation: {
    // Care Journey mutations
    createTimelineEvent: async (_, { input }) => {
      return await CareJourney.create({
        ...input,
        type: 'timeline'
      });
    },
    addMedicalRecord: async (_, { input }) => {
      return await CareJourney.create({
        ...input,
        type: 'medical'
      });
    },
    addSchoolProgress: async (_, { input }) => {
      return await CareJourney.create({
        ...input,
        type: 'school'
      });
    },
    addMemory: async (_, { input }) => {
      return await CareJourney.create({
        ...input,
        type: 'memory'
      });
    },
    createFuturePlan: async (_, { input }) => {
      return await CareJourney.create({
        ...input,
        type: 'future_plan',
        status: 'planned'
      });
    },
    updatePlanStatus: async (_, { id, status }) => {
      const plan = await CareJourney.findByPk(id);
      if (!plan) {
        throw new Error('Plan not found');
      }
      plan.status = status;
      await plan.save();
      return plan;
    },
    shareWithFamily: async (_, { id, familyMemberIds }) => {
      const journey = await CareJourney.findByPk(id);
      if (!journey) {
        throw new Error('Journey item not found');
      }
      await journey.shareWithFamily(familyMemberIds);
      return journey;
    },

    // Resource Exchange mutations
    addCommunityResource: async (_, { input }) => {
      return await ResourceExchange.create({
        ...input,
        type: 'community_resource'
      });
    },
    addServiceProvider: async (_, { input }) => {
      return await ResourceExchange.create({
        ...input,
        type: 'service_provider'
      });
    },
    rateProvider: async (_, { id, rating }, { user }) => {
      const provider = await ResourceExchange.findByPk(id);
      if (!provider) {
        throw new Error('Provider not found');
      }
      await provider.updateRating(rating, user.id);
      return provider;
    },
    addLegalGuide: async (_, { input }) => {
      return await ResourceExchange.create({
        ...input,
        type: 'legal_guide'
      });
    },
    addEquipment: async (_, { input }, { user }) => {
      return await ResourceExchange.create({
        ...input,
        type: 'equipment',
        ownerId: user.id
      });
    },
    updateEquipmentAvailability: async (_, { id, available }) => {
      const equipment = await ResourceExchange.findByPk(id);
      if (!equipment) {
        throw new Error('Equipment not found');
      }
      await equipment.updateAvailability(available);
      return equipment;
    }
  }
};

module.exports = resolvers; 
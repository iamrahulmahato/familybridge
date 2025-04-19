const { CareJourney } = require('../models');
const { uploadToS3 } = require('../utils/s3');
const { generatePDF } = require('../utils/pdf');

const careJourneyController = {
  // Timeline Events
  createTimelineEvent: async (req, res) => {
    try {
      const { title, description, date, eventType, location, category, tags } = req.body;
      const timelineEvent = await CareJourney.create({
        userId: req.user.id,
        type: 'timeline',
        title,
        description,
        date,
        eventType,
        location,
        category,
        tags
      });
      res.status(201).json(timelineEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTimelineEvents: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const events = await CareJourney.findByDateRange(req.user.id, startDate, endDate);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Medical History
  addMedicalRecord: async (req, res) => {
    try {
      const { title, description, date, medicalType, provider, category } = req.body;
      const medicalRecord = await CareJourney.create({
        userId: req.user.id,
        type: 'medical',
        title,
        description,
        date,
        medicalType,
        provider,
        category
      });
      res.status(201).json(medicalRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMedicalHistory: async (req, res) => {
    try {
      const medicalHistory = await CareJourney.findByType(req.user.id, 'medical');
      res.json(medicalHistory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // School Progress
  addSchoolProgress: async (req, res) => {
    try {
      const { title, description, date, academicYear, subject, grade } = req.body;
      const progress = await CareJourney.create({
        userId: req.user.id,
        type: 'school',
        title,
        description,
        date,
        academicYear,
        subject,
        grade
      });
      res.status(201).json(progress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSchoolProgress: async (req, res) => {
    try {
      const progress = await CareJourney.findByType(req.user.id, 'school');
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Memories
  addMemory: async (req, res) => {
    try {
      const { title, description, date, memoryType, category } = req.body;
      let attachments = [];
      
      if (req.files) {
        for (const file of req.files) {
          const uploadedFile = await uploadToS3(file);
          attachments.push(uploadedFile);
        }
      }

      const memory = await CareJourney.create({
        userId: req.user.id,
        type: 'memory',
        title,
        description,
        date,
        memoryType,
        category,
        attachments
      });
      res.status(201).json(memory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMemories: async (req, res) => {
    try {
      const memories = await CareJourney.findByType(req.user.id, 'memory');
      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Future Planning
  createFuturePlan: async (req, res) => {
    try {
      const { title, description, planType, priority, dueDate } = req.body;
      const plan = await CareJourney.create({
        userId: req.user.id,
        type: 'future_plan',
        title,
        description,
        date: dueDate,
        planType,
        priority,
        status: 'planned'
      });
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFuturePlans: async (req, res) => {
    try {
      const plans = await CareJourney.findByType(req.user.id, 'future_plan');
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updatePlanStatus: async (req, res) => {
    try {
      const { planId } = req.params;
      const { status } = req.body;
      const plan = await CareJourney.findByPk(planId);
      
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      plan.status = status;
      await plan.save();
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Sharing
  shareWithFamily: async (req, res) => {
    try {
      const { journeyId } = req.params;
      const { familyMemberIds } = req.body;
      const journey = await CareJourney.findByPk(journeyId);
      
      if (!journey) {
        return res.status(404).json({ error: 'Journey item not found' });
      }

      await journey.shareWithFamily(familyMemberIds);
      res.json(journey);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = careJourneyController; 
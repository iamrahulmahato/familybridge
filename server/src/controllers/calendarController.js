const { CalendarEvent, TransportationCoordination, ExternalCalendarSync } = require('../models/Calendar');
const { redis } = require('../config/database');
const { Op } = require('sequelize');
const { google } = require('googleapis');
const ical = require('ical');
const axios = require('axios');

// Calendar Event Controllers
const eventController = {
  // Create a new event
  async createEvent(req, res) {
    try {
      const {
        title,
        description,
        startTime,
        endTime,
        location,
        type,
        recurrence,
        participants,
        reminders,
        transportation
      } = req.body;

      // Check for scheduling conflicts
      const conflicts = await CalendarEvent.findConflicts(startTime, endTime, participants);
      if (conflicts.length > 0) {
        return res.status(409).json({
          error: 'Schedule conflict detected',
          conflicts: conflicts.map(c => ({
            id: c.id,
            title: c.title,
            startTime: c.startTime,
            endTime: c.endTime
          }))
        });
      }

      // Create the event
      const event = await CalendarEvent.create({
        title,
        description,
        startTime,
        endTime,
        location,
        type,
        recurrence,
        participants,
        reminders,
        createdBy: req.user.id
      });

      // If transportation is needed, create transportation coordination
      if (transportation) {
        await TransportationCoordination.create({
          eventId: event.id,
          ...transportation
        });
      }

      // Sync with external calendars if enabled
      const externalSyncs = await ExternalCalendarSync.findAll({
        where: {
          userId: {
            [Op.in]: participants
          },
          syncEnabled: true
        }
      });

      for (const sync of externalSyncs) {
        await syncEventToExternalCalendar(event, sync);
      }

      // Cache event for quick access
      await redis.set(`event:${event.id}`, JSON.stringify(event), 'EX', 3600);

      return res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ error: 'Failed to create event' });
    }
  },

  // Get events by date range and filters
  async getEvents(req, res) {
    try {
      const {
        startDate,
        endDate,
        participants,
        type,
        view = 'month'
      } = req.query;

      const where = {
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endTime: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      };

      if (participants) {
        where.participants = {
          [Op.overlap]: Array.isArray(participants) ? participants : [participants]
        };
      }

      if (type) {
        where.type = type;
      }

      const events = await CalendarEvent.findAll({
        where,
        include: [
          {
            model: TransportationCoordination,
            required: false
          }
        ],
        order: [['startTime', 'ASC']]
      });

      // Format events based on view type
      const formattedEvents = formatEventsForView(events, view);

      return res.json(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
  },

  // Update an event
  async updateEvent(req, res) {
    try {
      const { eventId } = req.params;
      const updates = req.body;

      const event = await CalendarEvent.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Check for new conflicts if time or participants changed
      if (updates.startTime || updates.endTime || updates.participants) {
        const conflicts = await CalendarEvent.findConflicts(
          updates.startTime || event.startTime,
          updates.endTime || event.endTime,
          updates.participants || event.participants
        );

        const otherConflicts = conflicts.filter(c => c.id !== eventId);
        if (otherConflicts.length > 0) {
          return res.status(409).json({
            error: 'Schedule conflict detected',
            conflicts: otherConflicts
          });
        }
      }

      // Update event
      await event.update(updates);

      // Update transportation if provided
      if (updates.transportation) {
        await TransportationCoordination.upsert({
          eventId,
          ...updates.transportation
        });
      }

      // Update external calendar syncs
      const externalSyncs = await ExternalCalendarSync.findAll({
        where: {
          userId: {
            [Op.in]: event.participants
          },
          syncEnabled: true
        }
      });

      for (const sync of externalSyncs) {
        await updateExternalCalendarEvent(event, sync);
      }

      // Update cache
      await redis.set(`event:${event.id}`, JSON.stringify(event), 'EX', 3600);

      return res.json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ error: 'Failed to update event' });
    }
  }
};

// Transportation Controllers
const transportationController = {
  // Create transportation coordination
  async createTransportation(req, res) {
    try {
      const { eventId } = req.params;
      const transportationDetails = req.body;

      const transportation = await TransportationCoordination.create({
        eventId,
        ...transportationDetails
      });

      return res.status(201).json(transportation);
    } catch (error) {
      console.error('Error creating transportation:', error);
      return res.status(500).json({ error: 'Failed to create transportation coordination' });
    }
  },

  // Update transportation status
  async updateStatus(req, res) {
    try {
      const { transportationId } = req.params;
      const { status } = req.body;

      const transportation = await TransportationCoordination.findByPk(transportationId);
      if (!transportation) {
        return res.status(404).json({ error: 'Transportation coordination not found' });
      }

      await transportation.update({ status });
      return res.json(transportation);
    } catch (error) {
      console.error('Error updating transportation status:', error);
      return res.status(500).json({ error: 'Failed to update transportation status' });
    }
  }
};

// Calendar Sync Controllers
const calendarSyncController = {
  // Connect external calendar
  async connectCalendar(req, res) {
    try {
      const { provider, accessToken, refreshToken, calendarId } = req.body;
      const userId = req.user.id;

      const sync = await ExternalCalendarSync.create({
        userId,
        provider,
        accessToken,
        refreshToken,
        calendarId
      });

      // Initialize sync
      await initializeCalendarSync(sync);

      return res.status(201).json({
        id: sync.id,
        provider,
        calendarId,
        syncEnabled: sync.syncEnabled
      });
    } catch (error) {
      console.error('Error connecting calendar:', error);
      return res.status(500).json({ error: 'Failed to connect calendar' });
    }
  },

  // Update sync settings
  async updateSettings(req, res) {
    try {
      const { syncId } = req.params;
      const { syncEnabled, syncSettings } = req.body;

      const sync = await ExternalCalendarSync.findByPk(syncId);
      if (!sync) {
        return res.status(404).json({ error: 'Calendar sync not found' });
      }

      await sync.update({
        syncEnabled,
        syncSettings: { ...sync.syncSettings, ...syncSettings }
      });

      return res.json(sync);
    } catch (error) {
      console.error('Error updating sync settings:', error);
      return res.status(500).json({ error: 'Failed to update sync settings' });
    }
  }
};

// Helper Functions
function formatEventsForView(events, view) {
  switch (view) {
    case 'day':
      return events.reduce((acc, event) => {
        const hour = new Date(event.startTime).getHours();
        if (!acc[hour]) acc[hour] = [];
        acc[hour].push(event);
        return acc;
      }, {});

    case 'week':
      return events.reduce((acc, event) => {
        const day = new Date(event.startTime).getDay();
        if (!acc[day]) acc[day] = [];
        acc[day].push(event);
        return acc;
      }, {});

    case 'month':
    default:
      return events.reduce((acc, event) => {
        const date = new Date(event.startTime).getDate();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
      }, {});
  }
}

async function syncEventToExternalCalendar(event, sync) {
  switch (sync.provider) {
    case 'google':
      return syncToGoogle(event, sync);
    case 'apple':
      return syncToApple(event, sync);
    case 'outlook':
      return syncToOutlook(event, sync);
    default:
      throw new Error(`Unsupported calendar provider: ${sync.provider}`);
  }
}

async function updateExternalCalendarEvent(event, sync) {
  // Implementation for updating external calendar events
  // Similar to syncEventToExternalCalendar but with update logic
}

async function initializeCalendarSync(sync) {
  // Implementation for initial calendar sync
  // Fetch existing events and sync them
}

module.exports = {
  eventController,
  transportationController,
  calendarSyncController
}; 
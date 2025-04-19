const { Medication, MedicalAppointment, HealthDocument, SymptomLog, HealthcareProvider } = require('../models/Health');
const { s3 } = require('../config/database');
const { Op } = require('sequelize');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

// Medication Controllers
const medicationController = {
  // Create new medication
  async createMedication(req, res) {
    try {
      const medicationData = req.body;
      medicationData.userId = req.user.id;

      const medication = await Medication.create(medicationData);

      // Schedule reminders
      if (medication.reminders && medication.reminders.length > 0) {
        await scheduleReminders(medication);
      }

      return res.status(201).json(medication);
    } catch (error) {
      console.error('Error creating medication:', error);
      return res.status(500).json({ error: 'Failed to create medication' });
    }
  },

  // Get medications with filters
  async getMedications(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      const where = { userId: req.user.id };

      if (status) {
        where.status = status;
      }

      if (startDate && endDate) {
        where.startDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const medications = await Medication.findAll({
        where,
        include: [
          {
            model: HealthcareProvider,
            as: 'prescriber'
          }
        ],
        order: [['startDate', 'DESC']]
      });

      return res.json(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      return res.status(500).json({ error: 'Failed to fetch medications' });
    }
  },

  // Update medication
  async updateMedication(req, res) {
    try {
      const { medicationId } = req.params;
      const updates = req.body;

      const medication = await Medication.findOne({
        where: {
          id: medicationId,
          userId: req.user.id
        }
      });

      if (!medication) {
        return res.status(404).json({ error: 'Medication not found' });
      }

      await medication.update(updates);

      // Update reminders if changed
      if (updates.reminders) {
        await updateReminders(medication);
      }

      return res.json(medication);
    } catch (error) {
      console.error('Error updating medication:', error);
      return res.status(500).json({ error: 'Failed to update medication' });
    }
  }
};

// Appointment Controllers
const appointmentController = {
  // Create new appointment
  async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      appointmentData.userId = req.user.id;

      const appointment = await MedicalAppointment.create(appointmentData);

      // Schedule reminders
      if (appointment.reminders && appointment.reminders.length > 0) {
        await scheduleReminders(appointment);
      }

      return res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      return res.status(500).json({ error: 'Failed to create appointment' });
    }
  },

  // Get appointments with filters
  async getAppointments(req, res) {
    try {
      const { status, startDate, endDate, providerId } = req.query;
      const where = { userId: req.user.id };

      if (status) {
        where.status = status;
      }

      if (startDate && endDate) {
        where.dateTime = {
          [Op.between]: [startDate, endDate]
        };
      }

      if (providerId) {
        where.providerId = providerId;
      }

      const appointments = await MedicalAppointment.findAll({
        where,
        include: [
          {
            model: HealthcareProvider
          }
        ],
        order: [['dateTime', 'ASC']]
      });

      return res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }
};

// Document Controllers
const documentController = {
  // Upload new document
  async uploadDocument(req, res) {
    try {
      const { type, title, providerId } = req.body;
      const file = req.file;

      // Upload file to S3
      const s3Response = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `documents/${req.user.id}/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private'
      }).promise();

      const document = await HealthDocument.create({
        userId: req.user.id,
        type,
        title,
        providerId,
        fileUrl: s3Response.Location,
        date: new Date()
      });

      return res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document:', error);
      return res.status(500).json({ error: 'Failed to upload document' });
    }
  },

  // Get documents with filters
  async getDocuments(req, res) {
    try {
      const { type, startDate, endDate, providerId } = req.query;
      const where = { userId: req.user.id };

      if (type) {
        where.type = type;
      }

      if (startDate && endDate) {
        where.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      if (providerId) {
        where.providerId = providerId;
      }

      const documents = await HealthDocument.findAll({
        where,
        include: [
          {
            model: HealthcareProvider
          }
        ],
        order: [['date', 'DESC']]
      });

      return res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  },

  // Generate emergency info card
  async generateEmergencyCard(req, res) {
    try {
      const userId = req.user.id;

      // Gather emergency information
      const [medications, conditions, providers] = await Promise.all([
        Medication.findAll({
          where: { userId, status: 'active' }
        }),
        MedicalHistory.findAll({
          where: { userId, status: 'active' }
        }),
        HealthcareProvider.findAll({
          where: { id: { [Op.in]: req.user.providers } }
        })
      ]);

      // Generate QR code
      const qrCode = await QRCode.toDataURL(JSON.stringify({
        userId,
        timestamp: Date.now()
      }));

      // Create PDF
      const doc = new PDFDocument();
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.type('application/pdf');
        res.send(pdfBuffer);
      });

      // Add content to PDF
      doc.image(qrCode, 50, 50, { width: 100 });
      doc.fontSize(20).text('Emergency Medical Information', 170, 50);
      // Add more PDF content...
      doc.end();
    } catch (error) {
      console.error('Error generating emergency card:', error);
      return res.status(500).json({ error: 'Failed to generate emergency card' });
    }
  }
};

// Symptom Controllers
const symptomController = {
  // Log new symptom
  async logSymptom(req, res) {
    try {
      const symptomData = req.body;
      symptomData.userId = req.user.id;

      const symptom = await SymptomLog.create(symptomData);
      return res.status(201).json(symptom);
    } catch (error) {
      console.error('Error logging symptom:', error);
      return res.status(500).json({ error: 'Failed to log symptom' });
    }
  },

  // Get symptom logs with filters
  async getSymptomLogs(req, res) {
    try {
      const { startDate, endDate, symptom } = req.query;
      const where = { userId: req.user.id };

      if (startDate && endDate) {
        where.timestamp = {
          [Op.between]: [startDate, endDate]
        };
      }

      if (symptom) {
        where.symptom = symptom;
      }

      const symptoms = await SymptomLog.findAll({
        where,
        order: [['timestamp', 'DESC']]
      });

      return res.json(symptoms);
    } catch (error) {
      console.error('Error fetching symptom logs:', error);
      return res.status(500).json({ error: 'Failed to fetch symptom logs' });
    }
  }
};

// Provider Controllers
const providerController = {
  // Add new provider
  async addProvider(req, res) {
    try {
      const providerData = req.body;
      const provider = await HealthcareProvider.create(providerData);
      return res.status(201).json(provider);
    } catch (error) {
      console.error('Error adding provider:', error);
      return res.status(500).json({ error: 'Failed to add provider' });
    }
  },

  // Get providers with filters
  async getProviders(req, res) {
    try {
      const { specialty, insurance } = req.query;
      const where = {};

      if (specialty) {
        where.specialty = specialty;
      }

      if (insurance) {
        where.insuranceAccepted = {
          [Op.contains]: [insurance]
        };
      }

      const providers = await HealthcareProvider.findAll({
        where,
        order: [['name', 'ASC']]
      });

      return res.json(providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
      return res.status(500).json({ error: 'Failed to fetch providers' });
    }
  }
};

// Helper Functions
async function scheduleReminders(entity) {
  // Implementation for scheduling reminders
  // This would typically use a job queue (e.g., Bull)
}

async function updateReminders(entity) {
  // Implementation for updating reminders
  // This would typically update existing jobs in the queue
}

module.exports = {
  medicationController,
  appointmentController,
  documentController,
  symptomController,
  providerController
}; 
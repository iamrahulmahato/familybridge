require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./api/routes/auth');
const calendarRoutes = require('./api/routes/calendar');
const healthRoutes = require('./api/routes/health');
const tasksRoutes = require('./api/routes/tasks');
const communicationRoutes = require('./src/routes/communicationRoutes');
const journeyRoutes = require('./api/routes/journey');
const resourcesRoutes = require('./api/routes/resources');

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Redis client setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport config
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/health', healthRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/resources', resourcesRoutes);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_family', (familyId) => {
    socket.join(familyId);
    console.log(`User ${socket.id} joined family: ${familyId}`);
  });
  
  socket.on('task_update', (data) => {
    io.to(data.familyId).emit('task_updated', data);
  });
  
  socket.on('new_message', (data) => {
    io.to(data.familyId).emit('message_received', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
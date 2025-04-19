const socketIO = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join family room
    socket.on('join-family', (familyId) => {
      socket.join(`family-${familyId}`);
    });

    // Leave family room
    socket.on('leave-family', (familyId) => {
      socket.leave(`family-${familyId}`);
    });

    // Care Journey Events
    socket.on('timeline-event-created', (data) => {
      io.to(`family-${data.familyId}`).emit('new-timeline-event', data);
    });

    socket.on('medical-record-added', (data) => {
      io.to(`family-${data.familyId}`).emit('new-medical-record', data);
    });

    socket.on('school-progress-updated', (data) => {
      io.to(`family-${data.familyId}`).emit('school-progress-changed', data);
    });

    socket.on('memory-added', (data) => {
      io.to(`family-${data.familyId}`).emit('new-memory', data);
    });

    socket.on('future-plan-updated', (data) => {
      io.to(`family-${data.familyId}`).emit('plan-status-changed', data);
    });

    // Resource Exchange Events
    socket.on('resource-added', (data) => {
      io.to(`family-${data.familyId}`).emit('new-resource', data);
    });

    socket.on('provider-rated', (data) => {
      io.to(`family-${data.familyId}`).emit('provider-rating-updated', data);
    });

    socket.on('equipment-availability-changed', (data) => {
      io.to(`family-${data.familyId}`).emit('equipment-status-updated', data);
    });

    // Task Events
    socket.on('task-created', (data) => {
      io.to(`family-${data.familyId}`).emit('new-task', data);
    });

    socket.on('task-updated', (data) => {
      io.to(`family-${data.familyId}`).emit('task-changed', data);
    });

    socket.on('task-completed', (data) => {
      io.to(`family-${data.familyId}`).emit('task-done', data);
    });

    // Calendar Events
    socket.on('event-created', (data) => {
      io.to(`family-${data.familyId}`).emit('new-event', data);
    });

    socket.on('event-updated', (data) => {
      io.to(`family-${data.familyId}`).emit('event-changed', data);
    });

    socket.on('event-deleted', (data) => {
      io.to(`family-${data.familyId}`).emit('event-removed', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = initializeSocket; 
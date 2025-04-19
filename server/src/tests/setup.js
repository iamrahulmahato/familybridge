const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('../graphql/schema');
const { resolvers } = require('../graphql/resolvers');
const { User } = require('../models');

let mongoServer;
let apolloServer;

beforeAll(async () => {
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to MongoDB
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Create Apollo Server for testing
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      user: {
        id: 'test-user-id',
        email: 'test@example.com'
      }
    })
  });
});

afterAll(async () => {
  // Close MongoDB connection
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Helper functions
const createTestUser = async (userData = {}) => {
  return await User.create({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    ...userData
  });
};

const getTestClient = () => {
  return createTestClient(apolloServer);
};

module.exports = {
  createTestUser,
  getTestClient
}; 
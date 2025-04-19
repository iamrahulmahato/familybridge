const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const AWS = require('aws-sdk');
require('dotenv').config();

// PostgreSQL Configuration
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// MongoDB Configuration
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Redis Configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  }
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

// S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Test database connections
const testConnections = async () => {
  try {
    // Test PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully');

    // Test MongoDB
    await connectMongoDB();

    // Redis connection is handled by events
  } catch (error) {
    console.error('Unable to connect to databases:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectMongoDB,
  redis,
  s3,
  testConnections
}; 
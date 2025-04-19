const mongoose = require('mongoose');
const { Pool } = require('pg');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/familybridge', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// PostgreSQL Connection (Optional)
let pgPool;
const connectPostgreSQL = async () => {
  try {
    if (process.env.POSTGRES_URI) {
      pgPool = new Pool({
        connectionString: process.env.POSTGRES_URI,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      await pgPool.connect();
      console.log('PostgreSQL Connected');
    } else {
      console.log('PostgreSQL connection skipped - no connection string provided');
    }
  } catch (err) {
    console.warn('PostgreSQL Connection Warning:', err.message);
    console.log('Continuing without PostgreSQL connection');
  }
};

// Connect to databases
const connectDB = async () => {
  await connectMongoDB();
  await connectPostgreSQL();
};

module.exports = { connectDB, pgPool }; 
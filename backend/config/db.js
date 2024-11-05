// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use full URL if set
  ssl: {
    rejectUnauthorized: false // This may be needed for connections to services like Railway
  }
});

// Check the connection
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error', err);
  process.exit(-1);
});

module.exports = pool;


const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false // Railway
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


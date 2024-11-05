const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api'); // Import the main api router

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Frontend's URL
}));
app.use(express.json());

// Mount the API routes under `/api`
app.use('/api', apiRoutes);

// Example root route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


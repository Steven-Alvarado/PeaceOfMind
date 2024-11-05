const express = require('express');
const router = express.Router();

const userRoutes = require('./users');


// Mount routes on `/api`
router.use('/users', userRoutes);

module.exports = router;


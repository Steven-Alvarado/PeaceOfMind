const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const authRoutes = require('./auth');

// Mount routes on `/api`
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;


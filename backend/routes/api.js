const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const authRoutes = require('./auth');
const documentRoutes = require('./documents');

// Mount routes on `/api`
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use("/documents", documentRoutes);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
  fetchAllUsers,
  fetchUserById, 
  fetchUserAudit,
} = require('../controllers/usersController');


router.get('/', fetchAllUsers); // Get all users
router.get('/:id', fetchUserById); // Get user by ID
router.get('/audit/:id', fetchUserAudit); // Get user audit by id

module.exports = router;

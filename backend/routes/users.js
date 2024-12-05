const express = require("express");
const router = express.Router();
const {
  fetchAllUsers,
  fetchUserById,
  fetchUserAudit,
  fetchUserEmail,
} = require("../controllers/usersController");

router.get("/", fetchAllUsers); // Get all users
router.get("/:id", fetchUserById); // Get user by ID
router.get("/audit/:id", fetchUserAudit); // Get user audit by id
router.get("/email/:id", fetchUserEmail); // Get user email by id

module.exports = router;

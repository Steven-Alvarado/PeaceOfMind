const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const authRoutes = require("./auth");
const appointmentRoutes = require("./appointments"); // Appointments file

// Mount routes on `/api`
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/appointments", appointmentRoutes); // Mounts appointments routes

module.exports = router;

const express = require("express");
const router = express.Router();

// Get all routees
const userRoutes = require("./users");
const authRoutes = require("./auth");
const reviewRoutes = require("./reviews");
const therapistRoutes = require("./therapists");
const appointmentRoutes = require("./appointments"); 


// Mount routes on `/api`
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/reviews", reviewRoutes);
router.use("/therapists", therapistRoutes);
router.use("/appointments", appointmentRoutes); 

module.exports = router;

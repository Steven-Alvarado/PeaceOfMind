const express = require("express");
const router = express.Router();



// Get all routees
const userRoutes = require("./users");
const authRoutes = require("./auth");
const reviewRoutes = require("./reviews");
const therapistRoutes = require("./therapists");
const appointmentRoutes = require("./appointments"); 
const conversationRoutes = require("./conversations");
const messagesRoutes = require("./messages");
const surveyRoutes = require("./survey");
const journalRoutes = require("./journal");

// Mount routes on `/api`
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/reviews", reviewRoutes);
router.use("/therapists", therapistRoutes);
router.use("/appointments", appointmentRoutes); 
router.use("/conversations", conversationRoutes);
router.use("/messages", messagesRoutes);
router.use("/surveys", surveyRoutes);
router.use("/journals", journalRoutes);



module.exports = router;

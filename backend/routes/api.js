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
const documentRoutes = require("./documents");
const relationshipRoutes = require("./relationships");
const invoiceRoutes = require("./invoices");

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
router.use("/documents", documentRoutes);
router.use("/relationships", relationshipRoutes);
router.use("/invoices", invoiceRoutes);

module.exports = router;

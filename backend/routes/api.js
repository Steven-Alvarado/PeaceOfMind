const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const authRoutes = require("./auth");
const therapistRoutes = require("./therapists");

// Mount routes on `/api`
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/therapists", therapistRoutes);

module.exports = router;

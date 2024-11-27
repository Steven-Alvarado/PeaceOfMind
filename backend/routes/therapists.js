const express = require("express");
const {
  registerTherapist,
  getTherapistDetails,
  listAvailableTherapists,
  getTherapistId,
} = require("../controllers/therapistController");
const router = express.Router();

router.post("/register", registerTherapist); // Register new therapist
router.get("/available", listAvailableTherapists); // Get available therapists
router.get("/:id", getTherapistDetails); // Get therapist by id
router.get("/find/:id", getTherapistId); // Get therapist_id from user_id

module.exports = router;

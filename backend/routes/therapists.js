const express = require("express");
const {
  registerTherapist,
  getTherapistDetails,
  listAvailableTherapists,
  getTherapistId,
  toggleAvailability,
} = require("../controllers/therapistController");
const router = express.Router();

router.post("/register", registerTherapist); // Register new therapist
router.get("/available", listAvailableTherapists); // Get available therapists
router.get("/:id", getTherapistDetails); // Get therapist by id
router.get("/find/:id", getTherapistId); // Get therapist_id from user_id
router.put("/toggleAvailability/:id", toggleAvailability); // Update therapist availability

module.exports = router;

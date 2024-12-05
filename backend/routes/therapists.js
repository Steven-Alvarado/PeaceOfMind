const express = require("express");
const {
  registerTherapist,
  getTherapistDetails,
  listAvailableTherapists,
  getTherapistId,
  getTherapistDetailsByUserId,
  toggleAvailability,
  updateAvailability,
} = require("../controllers/therapistController");
const router = express.Router();

router.post("/register", registerTherapist); // Register new therapist
router.get("/available", listAvailableTherapists); // Get available therapists
router.get("/:id", getTherapistDetails); // Get therapist by id
router.get("/find/:id", getTherapistId); // Get therapist_id from user_id
router.get('/user/:id', getTherapistDetailsByUserId) //get therapist by userid 
router.put("/toggleAvailability/:id", toggleAvailability); // Toggle availability by therapist idrouter.put("/toggleAvailability/:id", toggleAvailability); // Toggle availability by therapist idrouter.put('/:id/availability', updateAvailability); // Update therapist availability
router.put('/:id/availability', updateAvailability); // Update therapist availability

module.exports = router;

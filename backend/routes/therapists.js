const express = require("express");
const {
  registerTherapist,
  getTherapistDetails,
  listAvailableTherapists,
  getTherapistIdByUserId,
  getTherapistDetailsByUserId,
  toggleAvailability,
} = require("../controllers/therapistController");
const router = express.Router();

router.post("/register", registerTherapist); // Register new therapist
router.get("/available", listAvailableTherapists); // Get available therapists
router.get("/:id", getTherapistDetails); // Get therapist by id
router.get("/find/:id", getTherapistIdByUserId); // Get therapist_id from user_id
router.get('/user/:id', getTherapistDetailsByUserId) //get therapist by userid 
router.put("/toggleAvailability/:id", toggleAvailability); // Toggle availability by therapist 


module.exports = router;

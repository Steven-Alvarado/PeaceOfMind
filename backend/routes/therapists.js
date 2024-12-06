const express = require("express");
const {
  registerTherapist,
  getTherapistDetails,
  listAvailableTherapists,
<<<<<<< HEAD
  getTherapistId,
=======
  getTherapistIdByUserId,
>>>>>>> c151fd109060e53f37d4e7515a86d8583e5bc227
  getTherapistDetailsByUserId,
  toggleAvailability,
  updateAvailability,
} = require("../controllers/therapistController");
const router = express.Router();

router.post("/register", registerTherapist); // Register new therapist
router.get("/available", listAvailableTherapists); // Get available therapists
router.get("/:id", getTherapistDetails); // Get therapist by id
<<<<<<< HEAD
router.get("/find/:id", getTherapistId); // Get therapist_id from user_id
router.get('/user/:id', getTherapistDetailsByUserId) //get therapist by userid 
router.put("/toggleAvailability/:id", toggleAvailability); // Toggle availability by therapist idrouter.put("/toggleAvailability/:id", toggleAvailability); // Toggle availability by therapist idrouter.put('/:id/availability', updateAvailability); // Update therapist availability
router.put('/:id/availability', updateAvailability); // Update therapist availability
=======
router.get("/find/:id", getTherapistIdByUserId); // Get therapist_id from user_id
router.get('/user/:id', getTherapistDetailsByUserId) //get therapist by userid 
router.put("/toggleAvailability/:id", toggleAvailability); // Toggle availability by therapist 

>>>>>>> c151fd109060e53f37d4e7515a86d8583e5bc227

module.exports = router;

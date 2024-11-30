const express = require("express");
const router = express.Router();
const {
  assignTherapist,
  requestTherapist,
  getRelationshipByStudentId,
  getAllStudentTherapistRelationships,
  getTherapistRelationships,
  requestTherapistSwitchHandler,
  approveTherapistSwitchHandler,
  endRelationshipHandler,
} = require("../controllers/relationshipController");

router.get("/", getAllStudentTherapistRelationships); // Get all relationships
router.get("/:studentId", getRelationshipByStudentId); // Get relationship by student ID
router.post("/", assignTherapist); // Assign a therapist to a student
router.post("/request", requestTherapist); // Request new therapist
router.put("/:studentId/request-switch", requestTherapistSwitchHandler); //Request a therapist switch
router.put("/:studentId/approve-switch", approveTherapistSwitchHandler); //Approve a therapist switch
router.get("/therapist/:therapistId", getTherapistRelationships); // Get relationships by therapist ID
router.delete("/:studentId", endRelationshipHandler); //End a student-therapist relationship

module.exports = router;

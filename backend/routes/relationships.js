const express = require("express");
const {
  getTherapistsForStudent,
  getStudentsForTherapist
} = require("../controllers/relationshipController");

const router = express.Router();

// Route to get all therapists assigned to a specific student
router.get("/students/:id/listTherapists", getTherapistsForStudent);

// Route to get all students assigned to a specific therapist
router.get("/therapists/:id/listStudents", getStudentsForTherapist);

module.exports = router;
const express = require("express");
const router = express.Router();
const { uploadProfilePicture , getStudentProfilePicture, getTherapistProfilePicture} = require("../controllers/profilePictureController");

// Endpoint to handle profile picture upload
router.post("/upload/:id", uploadProfilePicture);
router.get("/therapist/:id", getTherapistProfilePicture);
router.get("/:id", getStudentProfilePicture);
module.exports = router;

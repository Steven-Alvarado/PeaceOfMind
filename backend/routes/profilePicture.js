const express = require("express");
const router = express.Router();
const { uploadProfilePicture } = require("../controllers/profilePictureController");

// Endpoint to handle profile picture upload
router.post("/upload/:id", uploadProfilePicture);

module.exports = router;

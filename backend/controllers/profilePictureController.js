const fs = require("fs");
const path = require("path");
const multer = require("multer");
const db = require("../config/db"); 

// Make uploads dir if not exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Directory for storing profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("profile_picture");

// Controller to handle profile picture upload
exports.uploadProfilePicture = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ error: "Failed to upload profile picture." });
      }
  
      // Check if file exists in the request
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded. Please provide a valid file." });
      }
  
      const userId = req.params.id;
      const profilePicturePath = `/uploads/${req.file.filename}`; // Path relative to the server
  
      try {
        // Update the user's profile picture URL in the database
        await db.query("UPDATE users SET profile_picture_url = $1 WHERE id = $2", [
          profilePicturePath,
          userId,
        ]);
  
        res.status(200).json({ message: "Profile picture updated!", profilePicturePath });
      } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ error: "Failed to update profile picture in database." });
      }
    });
  };

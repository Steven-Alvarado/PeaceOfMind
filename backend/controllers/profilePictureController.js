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

  /**
 * Get therapist profile picture
 */
exports.getTherapistProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT u.profile_picture_url
      FROM therapists t
      INNER JOIN users u ON t.user_id = u.id
      WHERE t.user_id = $1;
    `;

    const values = [id];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Therapist not found." });
    }

    res.status(200).json({ profile_picture_url: result.rows[0].profile_picture_url });
  } catch (error) {
    console.error("Error fetching therapist profile picture:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get student profile picture
 */
exports.getStudentProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT profile_picture_url
      FROM users
      WHERE id = $1 AND role = 'student';
    `;

    const values = [id];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ profile_picture_url: result.rows[0].profile_picture_url });
  } catch (error) {
    console.error("Error fetching student profile picture:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

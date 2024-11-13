const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Database

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users"); // Adjust the query as needed
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Route to update user information
// Currently the information available for change in the users table is role
// Of course information in other tables can be updated with this same endpoint but this should be discussed.
// Tested on Postman using string "http://localhost:5000/api/users/update" and body { user_id: , role: }
router.put("/update", async (req, res) => {
  const { user_id, role } = req.body;

  // Checks body for required fields
  if (!user_id || !role) {
    return res.status(400).json({ error: "user id and role needed" });
  }

  try {
    const update = await pool.connect(); // Connects to db
    await update.query("BEGIN"); // Initiates transaction, allows grouping multiple queries

    const updateRole = `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`; // Assigns query string to variable
    const updateRoleCheck = await update.query(updateRole, [role, user_id]); // Executes query

    if (updateRoleCheck.rowCount === 0) {
      // Checks if any rows affected by query
      await update.query("ROLLBACK"); // Transaction rolled back if no rows affected
      return res.status(404).json({ error: "User not found in users table" });
    }

    /*
    This is just an example of code that could be used to edit multiple tables
    const updateEmail = UPDATE auth SET email WHERE id
    const updateEmailCheck = 

    const updateSpecialization = UPDATE therapists SET specialization WHERE user_id
    const updateSpecializationCheck = 
    */

    await update.query("COMMIT"); // If all updates succeed, the transaction commits
    update.release(); // Releases connection to db
    res.json({ message: "User role successfully updated" });
  } catch (err) {
    console.error("Error updating user information:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Route to retrieve user audit history
// "/audit/:id" is also an option, but ticket specified "/audit"
// Tested on Postman with string "http://localhost:5000/api/users/audit?user_id=1"
router.get("/audit", async (req, res) => {
  const user_id = parseInt(req.query.user_id);

  if (isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid user id parameter" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users_audit WHERE user_id = $1`,
      [user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Audit not found for this user" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving user audit:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Route to get a specific user by ID
// This is a dynamic route, meaning it can seriously interfere with the more specific API paths, keep it last in the order of routes
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword
} = require("../models/authModel");

const register = async (req, res) => {
  const { email, password, role, firstName, lastName, gender} = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, passwordHash, role, firstName, lastName, gender);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email); // Now includes the `role`
    if (!user) return res.status(400).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, // Include role in token
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // Send role in response
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};



const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Email does not exist" });
    }
    res.status(200).json({ message: "Email exists" });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
};
const resetPasswordDirect = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await findUserByEmail(email); // Ensure this checks the `auth` table
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(email, hashedPassword);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};



module.exports = { register, login, logout, getProfile, checkEmail, resetPasswordDirect };

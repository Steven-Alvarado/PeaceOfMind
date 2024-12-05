const bcrypt = require("bcryptjs");
const {
  createTherapist,
  findTherapistByUserId,
  findTherapistIdById,
  getAvailableTherapists,
  isLicenseVerified,
  licenseExists,
  toggleTherapistAvailability,
  findTherapistById
} = require("../models/therapistModel");
const { createUser, findUserByEmail } = require("../models/authModel");

const registerTherapist = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    gender,
    licenseNumber,
    specialization,
    experienceYears,
    monthlyRate,
  } = req.body;

  // Validate required fields
  if (
    !(
      email &&
      password &&
      firstName &&
      lastName &&
      licenseNumber &&
      specialization &&
      gender
    )
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if license already exists
    if (await licenseExists(licenseNumber)) {
        return res.status(409).json({ error: "License number already exists" });
    }
    // Verify therapist license
    const licenseIsVerified = await isLicenseVerified(licenseNumber);
    if (!licenseIsVerified) {
      return res.status(403).json({ error: "License number is not verified" });
    }

    // Check if user already exists with the provided email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists with this email" });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const { id: userId } = await createUser(
      email,
      passwordHash,
      "therapist",
      firstName,
      lastName,
      gender
    );

    // Create therapist profile
    const therapist = await createTherapist(
      userId,
      licenseNumber,
      specialization,
      experienceYears,
      monthlyRate
    );


    res.status(201).json({
      message: "Therapist registered successfully",
      therapist: {
        id: therapist.id,
        userId,
        firstName,
        lastName,
        email,
        gender,
        licenseNumber,
        specialization,
        experienceYears,
        monthlyRate,
        createdAt: therapist.created_at,
        updatedAt: therapist.updated_at,
      },
    });
  } catch (error) {

    if (error.message === "License number already exists") {
      return res.status(409).json({ error: "License number already exists" });
    }
    if (error.message === "License number is not verified") {
      return res.status(403).json({ error: "License number is not verified" });
    }
    if (error.message === "User already exists with this email") {
      return res.status(409).json({ error: "User already exists with this email" });
    }

    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      message: "An unexpected error occurred during registration",
    });
  }
};

const getTherapistDetails = async (req, res) => {
  const therapistId = req.params.id;
  try {
    const therapist = await findTherapistById(therapistId);
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    res.json({
      message: "Therapist details retrieved successfully",
      therapist,
    });
  } catch (error) {
    console.error("Error retrieving therapist details:", error);
    res.status(500).json({
      error: "Failed to fetch therapist details",
      message: error.message,
    });
  }
};

const getTherapistIdByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const therapist = await findTherapistIdById(userId);
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    res.json({ message: "Therapist ID retrieved successfully", therapist });
  } catch (error) {
    console.error("Error retrieving therapist details:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch therapist ID", message: error.message });
  }
};

const listAvailableTherapists = async (req, res) => {
  try {
    const therapists = await getAvailableTherapists();
    if (therapists.length === 0) {
      return res.status(404).json({ message: "No available therapists found" });
    }
    res.json({
      message: "Available therapists retrieved successfully",
      therapists,
    });
  } catch (error) {
    console.error("Error retrieving available therapists:", error);
    res.status(500).json({
      error: "Failed to fetch available therapists",
      message: error.message,
    });
  }
};

const toggleAvailability = async (req, res) => {
  const therapistId = parseInt(req.params.id, 10);

  if (isNaN(therapistId)) {
    return res.status(400).json({ error: "Invalid therapist ID" });
  }

  try {
    const updatedTherapist = await toggleTherapistAvailability(therapistId);

    if (!updatedTherapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    res.status(200).json({
      message: "Therapist availability toggled successfully",
      therapist: updatedTherapist,
    });
  } catch (error) {
    console.error("Error toggling therapist availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getTherapistDetailsByUserId = async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Use req.params.id instead of userId

  if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
      const therapist = await findTherapistByUserId(userId);
      if (!therapist) {
          return res.status(404).json({ error: "Therapist not found" });
      }
      res.json({ message: "Therapist details retrieved successfully", therapist });
  } catch (error) {
      console.error("Error retrieving therapist details:", error);
      res.status(500).json({ error: "Failed to fetch therapist details", message: error.message });
  }
};

module.exports = { getTherapistIdByUserId, registerTherapist, getTherapistDetails, listAvailableTherapists, toggleAvailability, getTherapistDetailsByUserId};
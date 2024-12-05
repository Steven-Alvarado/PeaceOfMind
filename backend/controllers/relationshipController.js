const { 
  createRelationship, 
  findRelationship, 
  requestTherapistSwitch, 
  approveTherapistSwitch,
  getAllRelationships,
  getRelationshipsByTherapistId,
  endRelationship
} = require('../models/relationshipsModel');

// Assign a therapist to a student
const assignTherapist = async (req, res) => {
  const { studentId, therapistId } = req.body;
  
  // Validation
  if (!studentId || !therapistId) {
    return res.status(400).json({ error: "Both studentId and therapistId are required." });
  }
  
  try {
    // Check if a relationship already exists
    const existingRelationship = await findRelationship(studentId);
    if (existingRelationship) {
      return res.status(409).json({ message: "Relationship already exists." });
    }
    
    // Create a new relationship
    const relationship = await createRelationship(studentId, therapistId);
    res.status(201).json({ message: "Therapist assigned", relationship });
  } catch (error) {
    console.error("Error assigning therapist:", error);
    res.status(500).json({ error: "Failed to assign therapist" });
  }
};

// Get relationship by student ID
const getRelationshipByStudentId = async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const relationship = await findRelationship(studentId);
    
    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }
    
    res.status(200).json({ relationship });
  } catch (error) {
    console.error("Error retrieving relationship:", error);
    res.status(500).json({ error: "Failed to retrieve relationship" });
  }
};

// Get all relationships
const getAllStudentTherapistRelationships = async (req, res) => {
  try {
    const relationships = await getAllRelationships();
    res.status(200).json({ relationships });
  } catch (error) {
    console.error("Error retrieving relationships:", error);
    res.status(500).json({ error: "Failed to retrieve relationships" });
  }
};

// Get relationships by therapist ID
const getTherapistRelationships = async (req, res) => {
  const { therapistId } = req.params;
  
  try {
    const relationships = await getRelationshipsByTherapistId(therapistId);
    res.status(200).json({ relationships });
  } catch (error) {
    console.error("Error retrieving therapist relationships:", error);
    res.status(500).json({ error: "Failed to retrieve therapist relationships" });
  }
}; 
// Get relationships by therapist ID
const getTherapistRelationshipss = async (therapistId) => {
  try {
    const relationships = await getRelationshipsByTherapistId(therapistId);
    return relationships;
  } catch (error) {
    console.error("Error retrieving therapist relationships:", error);
    throw new Error("Failed to retrieve therapist relationships");
  }
};

// Request therapist switch
const requestTherapistSwitchHandler = async (req, res) => {
  const { studentId } = req.params;
  const { requestedTherapistId } = req.body;
  
  // Validation
  if (!requestedTherapistId) {
    return res.status(400).json({ error: "Requested therapistId is required." });
  }
  
  try {
    const relationship = await requestTherapistSwitch(studentId, requestedTherapistId);
    
    if (!relationship) {
      return res.status(404).json({ message: "Student relationship not found" });
    }
    
    res.status(200).json({ message: "Therapist switch requested", relationship });
  } catch (error) {
    console.error("Error requesting therapist switch:", error);
    res.status(500).json({ error: "Failed to request therapist switch" });
  }
};

// Approve therapist switch
const approveTherapistSwitchHandler = async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const relationship = await approveTherapistSwitch(studentId);
    
    if (!relationship) {
      return res.status(404).json({ message: "No pending therapist switch found" });
    }
    
    res.status(200).json({ message: "Therapist switch approved", relationship });
  } catch (error) {
    console.error("Error approving therapist switch:", error);
    res.status(500).json({ error: "Failed to approve therapist switch" });
  }
};

// End relationship
const endRelationshipHandler = async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const relationship = await endRelationship(studentId);
    
    res.status(200).json({ message: "Relationship ended", relationship });
  } catch (error) {
    console.error("Error ending relationship:", error);
    res.status(500).json({ error: "Failed to end relationship" });
  }
};

module.exports = {
  assignTherapist,
  getRelationshipByStudentId,
  getAllStudentTherapistRelationships,
  getTherapistRelationships,
  requestTherapistSwitchHandler,
  approveTherapistSwitchHandler,
  endRelationshipHandler,
  getTherapistRelationshipss
};
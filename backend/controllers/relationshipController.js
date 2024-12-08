const {
  createRelationship,
  requestRelationship,
  findRelationship,
  requestTherapistSwitch,
  approveTherapistSwitch,
  getAllRelationships,
  getRelationshipsByTherapistId,
  endRelationship,
} = require("../models/relationshipsModel");



// Assign a therapist to a student
const assignTherapist = async (req, res) => {
  const { studentId, therapistId } = req.body;

  if (!studentId || !therapistId) {
    return res
      .status(400)
      .json({ error: "Both studentId and therapistId are required." });
  }

  try {
    const existingRelationship = await findRelationship(studentId);
    if (existingRelationship) {
      return res.status(409).json({ message: "Relationship already exists." });
    }

    const relationship = await createRelationship(studentId, therapistId);

    // Emit the event for real-time updates to the specific student
    const io = req.app.get("io");
    io.to(`student_${studentId}`).emit("relationship-changed", {
      status: "assigned",
      therapistId,
    });

    res.status(201).json({ message: "Therapist assigned", relationship });
  } catch (error) {
    console.error("Error assigning therapist:", error);
    res.status(500).json({ error: "Failed to assign therapist" });
  }
};

// Request a therapist
const requestTherapist = async (req, res) => {
  const { studentId, therapistId } = req.body;

  if (!studentId || !therapistId) {
    return res
      .status(400)
      .json({ error: "Both studentId and therapistId are required." });
  }

  try {
    const existingRelationship = await findRelationship(studentId);
    if (existingRelationship) {
      return res.status(409).json({ message: "Relationship already exists." });
    }

    const relationship = await requestRelationship(studentId, therapistId);

    // Emit the event to the therapist
    const io = req.app.get("io");
    io.to(`therapist_${therapistId}`).emit("relationship-requested", {
      studentId,
      therapistId,
      status: "requested",
    });

    res.status(201).json({ message: "Therapist requested", relationship });
  } catch (error) {
    console.error("Error requesting therapist:", error);
    res.status(500).json({ error: "Failed to request therapist" });
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

// Request therapist switch
const requestTherapistSwitchHandler = async (req, res) => {
  const { studentId } = req.params;
  const { requestedTherapistId } = req.body;

  if (!requestedTherapistId) {
    return res
      .status(400)
      .json({ error: "Requested therapistId is required." });
  }

  try {
    const relationship = await requestTherapistSwitch(
      studentId,
      requestedTherapistId
    );

    if (!relationship) {
      return res
        .status(404)
        .json({ message: "Student relationship not found" });
    }

    // Emit the event for real-time updates
    const io = req.app.get("io");
    io.emit("therapist-switch-requested", { studentId, requestedTherapistId });

    res
      .status(200)
      .json({ message: "Therapist switch requested", relationship });
  } catch (error) {
    console.error("Error requesting therapist switch:", error);
    res.status(500).json({ error: "Failed to request therapist switch" });
  }
};

const approveTherapistSwitchHandler = async (req, res) => {
  const { studentId } = req.params;

  try {
    const relationship = await approveTherapistSwitch(studentId);

    if (!relationship) {
      return res
        .status(404)
        .json({ message: "No pending therapist switch found" });
    }

    const io = req.app.get("io");
    // Notify the student of the approval
    io.to(`student_${studentId}`).emit("relationship-changed", {
      status: "approved",
      therapistId: relationship.therapist_id,
    });
    // Notify the therapist of the new relationship
    io.to(`therapist_${relationship.therapist_id}`).emit(
      "relationship-switch-approved",
      { studentId }
    );

    res.status(200).json({
      message: "Therapist switch approved",
      relationship,
    });
  } catch (error) {
    console.error("Error approving therapist switch:", error);
    res.status(500).json({ error: "Failed to approve therapist switch" });
  }
};



const endRelationshipHandler = async (req, res) => {
  const { studentId } = req.params;

  try {
    const relationship = await endRelationship(studentId);

    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found." });
    }

    // Emit the event for real-time updates
    const io = req.app.get("io");
    io.to(`student_${studentId}`).emit("relationship-ended", {
      status: "ended",
    });

    res.status(200).json({ message: "Relationship ended", relationship });
  } catch (error) {
    console.error("Error ending relationship:", error);
    res.status(500).json({ error: "Failed to end relationship" });
  }
};


const rejectTherapistSwitch = async (req, res) => {
  const { studentId } = req.params;

  try {
    const deletedRelationship = await endRelationship(studentId);

    if (!deletedRelationship) {
      return res
        .status(404)
        .json({ message: "No relationship found for rejection" });
    }

    const io = req.app.get("io");
    // Notify the student of the rejection
    io.to(`student_${studentId}`).emit("relationship-changed", {
      status: "rejected",
    });

    res.status(200).json({
      message: "Therapist switch rejected",
      relationship: deletedRelationship,
    });
  } catch (error) {
    console.error("Error rejecting therapist switch:", error);
    res.status(500).json({ error: "Failed to reject therapist switch" });
  }
};



module.exports = {
  assignTherapist,
  requestTherapist,
  getRelationshipByStudentId,
  getAllStudentTherapistRelationships,
  getTherapistRelationships,
  requestTherapistSwitchHandler,
  approveTherapistSwitchHandler,
  endRelationshipHandler,
  rejectTherapistSwitch 
};

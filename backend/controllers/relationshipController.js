const {
    getTherapistsForStudent: fetchTherapistsForStudent,
    getStudentsForTherapist: fetchStudentsForTherapist
  } = require("../models/relationshipsModel");
  
  const getTherapistsForStudent = async (req, res) => {
    const { id } = req.params; // Student ID
    try {
      const therapists = await fetchTherapistsForStudent(id);
      res.status(200).json(therapists);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getStudentsForTherapist = async (req, res) => {
    const { id } = req.params; // Therapist ID
    try {
      const students = await fetchStudentsForTherapist(id);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { getTherapistsForStudent, getStudentsForTherapist };
  
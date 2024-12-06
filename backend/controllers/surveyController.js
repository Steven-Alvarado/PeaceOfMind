const { createSurveyResponse,createWeeklySurveyResponse, updateSurveyResponse, getSurveyById, getSurveysByUserId } = require('../models/surveysModel');
const { hasWeeklySurveyForCurrentWekk } = require('../models/documentsModel');
// Create a new survey response
const createSurvey = async (req, res) => {
    const { userId, content } = req.body;

    if (!userId || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const survey = await createSurveyResponse(userId, content);
        res.status(201).json({ message: 'Survey response submitted successfully', survey });
    } catch (error) {
        console.error("Error submitting survey response:", error);
        res.status(500).json({ error: 'Failed to submit survey response' });
    }
};

// Create a new weekly survey response
const createWeeklySurvey = async (req, res) => {
    const { userId, content } = req.body;
  
    if (!userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const survey = await createWeeklySurveyResponse(userId, content);
      res.status(201).json({ message: "Weekly survey submitted successfully", survey });
    } catch (error) {
      console.error("Error submitting weekly survey:", error);
      res.status(500).json({ error: "Failed to submit weekly survey" });
    }
};

const checkWeeklySurveyStatus = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const hasSubmitted = await hasWeeklySurveyForCurrentWekk(userId);

        if (hasSubmitted) {
            return res.status(200).json({ message: "Weekly survey already submitted", canSubmit: false });
        }

        return res.status(200).json({ message: "No weekly survey submitted", canSubmit: true });
    } catch (error) {
        console.error("Error checking weekly survey status:", error);
        res.status(500).json({ error: "Failed to check weekly survey status" });
    }
};

// Update a survey response
const updateSurvey = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Missing required field: content' });
    }

    try {
        const updatedSurvey = await updateSurveyResponse(id, content);
        res.status(200).json({ message: 'Survey response updated successfully', survey: updatedSurvey });
    } catch (error) {
        console.error("Error updating survey response:", error);
        res.status(500).json({ error: 'Failed to update survey response' });
    }
};

// Get a specific survey response by ID
const getSurvey = async (req, res) => {
    const { id } = req.params;

    try {
        const survey = await getSurveyById(id);

        if (!survey) {
            return res.status(404).json({ error: 'Survey response not found' });
        }

        res.status(200).json({ survey });
    } catch (error) {
        console.error("Error fetching survey response:", error);
        res.status(500).json({ error: 'Failed to fetch survey response' });
    }
};

// Get all survey responses by userId
const getSurveys = async (req, res) => {
    const { userId } = req.params;

    try {
        const surveys = await getSurveysByUserId(userId);

        if (surveys.length === 0) {
            return res.status(404).json({ error: 'No surveys found for this user' });
        }

        res.status(200).json({ surveys });
    } catch (error) {
        console.error("Error fetching surveys:", error);
        res.status(500).json({ error: 'Failed to fetch surveys' });
    }
};

module.exports = { createSurvey, createWeeklySurvey, checkWeeklySurveyStatus, updateSurvey, getSurvey, getSurveys };
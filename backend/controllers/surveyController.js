const { createSurveyResponse, getSurveyById, updateSurveyResponse } = require('../models/surveysModel');

// Submit a new survey response
const submitSurvey = async (req, res) => {
    const { userId, content } = req.body;

    if (!userId || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const survey = await createSurveyResponse(userId, content);
        res.status(201).json({
            message: 'Survey response submitted successfully',
            survey
        });
    } catch (error) {
        console.error("Error submitting survey response:", error);
        res.status(500).json({ error: 'Failed to submit survey response' });
    }
};

// Retrieve a specific survey response
const getSurvey = async (req, res) => {
    const { id } = req.params;

    try {
        const survey = await getSurveyById(id);

        if (!survey) {
            return res.status(404).json({ error: 'Survey response not found' });
        }

        res.status(200).json({ survey });
    } catch (error) {
        console.error("Error retrieving survey response:", error);
        res.status(500).json({ error: 'Failed to retrieve survey response' });
    }
};

// Update a survey response by ID
const updateSurvey = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Missing required field: content' });
    }

    try {
        const updatedSurvey = await updateSurveyResponse(id, content);

        if (!updatedSurvey) {
            return res.status(404).json({ error: 'Survey response not found' });
        }

        res.status(200).json({
            message: 'Survey response updated successfully',
            survey: updatedSurvey
        });
    } catch (error) {
        console.error("Error updating survey response:", error);
        res.status(500).json({ error: 'Failed to update survey response' });
    }
};

module.exports = { submitSurvey, getSurvey, updateSurvey };

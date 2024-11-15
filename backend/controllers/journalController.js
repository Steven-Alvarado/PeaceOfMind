const { createJournalEntry, getJournalEntryById, updateJournalEntry } = require('../models/journalsModel');

// Create a new journal entry
const createJournal = async (req, res) => {
    const { userId, mood, content } = req.body;

    if (!userId || !mood || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const journal = await createJournalEntry(userId, mood, content);
        res.status(201).json({
            message: 'Journal entry created successfully',
            journal
        });
    } catch (error) {
        console.error("Error creating journal entry:", error);
        res.status(500).json({ error: 'Failed to create journal entry' });
    }
};

// Retrieve a specific journal entry
const getJournal = async (req, res) => {
    const { id } = req.params;

    try {
        const journal = await getJournalEntryById(id);

        if (!journal) {
            return res.status(404).json({ error: 'Journal entry not found' });
        }

        res.status(200).json({ journal });
    } catch (error) {
        console.error("Error retrieving journal entry:", error);
        res.status(500).json({ error: 'Failed to retrieve journal entry' });
    }
};

// Update a journal entry by ID
const updateJournal = async (req, res) => {
    const { id } = req.params;
    const { mood, content } = req.body;

    if (!mood || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedJournal = await updateJournalEntry(id, mood, content);

        if (!updatedJournal) {
            return res.status(404).json({ error: 'Journal entry not found' });
        }

        res.status(200).json({
            message: 'Journal entry updated successfully',
            journal: updatedJournal
        });
    } catch (error) {
        console.error("Error updating journal entry:", error);
        res.status(500).json({ error: 'Failed to update journal entry' });
    }
};

module.exports = { createJournal, getJournal, updateJournal };

const express = require('express');
const { createJournal, updateJournal, getJournal, getJournals } = require('../controllers/journalController');
const router = express.Router();

router.post('/', createJournal);
router.put('/:id', updateJournal);
router.get('/:id', getJournal);
router.get('/user/:userId', getJournals);

module.exports = router;


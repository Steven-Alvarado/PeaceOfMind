const express = require('express');
const { 
    createJournal, 
    updateJournal, 
    getJournal, 
    getJournals,
    deleteJournal
} = require('../controllers/journalController');

const router = express.Router();

router.post('/', createJournal);
router.put('/:id', updateJournal);
router.get('/:id', getJournal);
router.get('/user/:userId', getJournals);
router.delete('/delete/:id', deleteJournal);

module.exports = router;


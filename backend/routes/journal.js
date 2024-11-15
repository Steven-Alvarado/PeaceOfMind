const express = require('express');
const { createJournal, getJournal, updateJournal } = require('../controllers/journalController');
const router = express.Router();

router.post('/', createJournal);
router.get('/:id', getJournal);
router.put('/:id', updateJournal); 

module.exports = router;

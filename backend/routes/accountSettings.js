const express = require('express');
const router = express.Router();

const {  updateUser, updateTherapist, handleDeleteTherapist, handleDeleteStudent  } = require('../controllers/accountSettingsController');


router.delete('/therapist/delete/:therapistId', handleDeleteTherapist);
router.patch('/student/:userid',  updateUser);
router.patch('/therapist/:userid', updateTherapist);
router.delete('/students/:studentId', handleDeleteStudent);
module.exports = router;

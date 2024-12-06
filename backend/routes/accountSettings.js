const express = require('express');
const router = express.Router();

const {  updateUser, updateTherapist, handleDeleteUserAndTherapist, handleDeleteStudent  } = require('../controllers/accountSettingsController');


router.delete("/therapists/:therapistId/user/:studentId", handleDeleteUserAndTherapist);
router.patch('/student/:userid',  updateUser);
router.patch('/therapist/:userid', updateTherapist);
router.delete('/students/:studentId', handleDeleteStudent);
module.exports = router;

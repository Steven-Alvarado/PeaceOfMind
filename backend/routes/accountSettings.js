const express = require('express');
const router = express.Router();

const {  updateUser, updateTherapist  } = require('../controllers/accountSettingsController');


//router.delete('/user/delete/:userid');
router.patch('/student/:userid',  updateUser);
router.patch('/therapist/:userid', updateTherapist);


module.exports = router;

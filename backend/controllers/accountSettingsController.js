const bcrypt = require('bcrypt');
const { updateUserAccountSettings, updateTherapistAccountSettings  } = require('../models/accountSettingsModel');

const updateUser = async (req, res) => {
  const { userid } = req.params;
  const { first_name, last_name, email, password } = req.body;

  try {
    const updatedUser = await updateUserAccountSettings(userid, first_name, last_name, email, password);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};


const updateTherapist = async (req, res) => {
  const { userid } = req.params;
  const { first_name, last_name, email, password, experience_years, monthly_rate } = req.body;

  try {
    const updatedTherapist = await updateTherapistAccountSettings(userid, first_name, last_name, email, password, experience_years, monthly_rate);

    if (!updatedTherapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    res.status(200).json({ message: 'Therapist updated successfully', therapist: updatedTherapist });
  } catch (error) {
    console.error('Error updating therapist:', error);
    res.status(500).json({ error: 'An error occurred while updating the therapist' });
  }
};
 
module.exports = { updateUser, updateTherapist};

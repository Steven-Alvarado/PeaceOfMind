const { updateUserAccountSettings } = require('../models/accountSettingsModel');

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

module.exports = { updateUser };

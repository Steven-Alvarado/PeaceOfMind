import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { FaBars, FaTimes } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";

import Logo from "../../assets/images/logobetter.png";

const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [monthlyRate, setMonthlyRate] = useState('');

  if (!isOpen) return null;

  const handleDeleteAccount = () => {
    // Logic to delete account
    console.log('Account deleted');
  };

  const handleUpdate = () => {
    // Logic to update user details
    console.log('User details updated');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg outline outline-white outline-2 outline-offset-2">
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">Settings</h2>

        {/* First Name and Last Name on the same line */}
        <div className="flex space-x-4">
          <div className="w-full">
            <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name</label>
            <input
              id="firstName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Email Address and Experience (Years) */}
        <div className="flex space-x-4 mt-4">
          <div className="w-full">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="w-full">
            <label htmlFor="experienceYears" className="block text-gray-700 font-bold mb-2">Experience (Years)</label>
            <input
              id="experienceYears"
              type="number"
              min="0" // Prevent negative values
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="Enter years of experience"
          />
        </div>
        </div>

        {/* New Password and Confirm Password */}
        <div className="flex space-x-4 mt-4">
          <div className="w-full">
            <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">New Password</label>
            <input
              id="newPassword"
              type="password"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>
          <div className="w-full">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {/* Monthly Rate */}
        <div className="mt-4">
        <label htmlFor="monthlyRate" className="block text-gray-700 font-bold mb-2">Monthly Rate</label>
        <input
          id="monthlyRate"
          type="number"
          min="0" // Prevent negative values
          className="w-full p-2 border border-gray-300 rounded text-black"
          value={monthlyRate}
          onChange={(e) => setMonthlyRate(e.target.value)}
          placeholder="Enter your monthly rate"
        />
          </div>

        {/* Update, Delete Account, and Close buttons in the same row */}
        <div className="mt-6 flex justify-between">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>

          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]"
            onClick={handleUpdate}
          >
            Update
          </button>

          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const LogoutConfirmationModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-center text-black mb-4">Confirm Logout</h2>
        <p className="text-center text-black mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-between">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Yes, Log Out
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const HeaderTherapistDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


  const { logout } = useAuth(); 
  const navigate = useNavigate(); 

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");

    if (logout) {
      logout();
    }

    navigate("/login");
  };
  
  return (
    <header className="bg-[#5E9ED9] text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center cursor-pointer">
          <a href="/" className="flex items-center">
            <img
              src={Logo}
              alt="Peace of Mind Logo"
              className="w-12 h-12 object-cover rounded-full mr-2"
            />
            <h1 className="text-lg font-bold">Peace of Mind</h1>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden font-bold md:flex space-x-1">
          <div className="justify-center flex cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4] space-x-1">
            <button 
              className="cursor-pointer rounded hover:bg-[#4b8cc4]"
              onClick={() => setIsSettingsOpen(true)}
            >
              <IoMdSettings className="inline mr-1 mb-0.5" />
              Settings
            </button>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          </div>
          <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              >
              <MdOutlineLogout className="inline mr-1 mb-0.5"/>
              Logout
            </button>
          </div>
        </nav>

        {/* Mobile Hamburger Icon */}
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden text-center font-bold bg-[#5E9ED9] text-white p-4 space-y-2">
          <div className="space-y-2">
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
              <a href="Link for Dashboard"> <IoMdSettings className="inline mr-1 mb-0.5"/> Settings </a>
            </div>
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
              <button
              onClick={() => setIsLogoutModalOpen(true)}
              >
                <MdOutlineLogout className="inline mr-1 mb-0.5"/>
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </header>
  );
};

export default HeaderTherapistDashboard;
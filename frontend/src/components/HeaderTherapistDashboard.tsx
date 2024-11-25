import React, { useState } from "react";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import Logo from "../assets/images/logobetter.png";

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
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">Student Settings</h2>


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


const HeaderTherapistDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
                <FaHome className="mt-1"/>
                <a href="Link for Dashboard" className="cursor-pointer rounded hover:bg-[#4b8cc4]">
                    Dashboard
                </a>
            </div>
            <div className="justify-center flex cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4] space-x-1">
                <IoIosNotifications className="mt-1" />
                <a href="Link for Notifications" className="cursor-pointer rounded hover:bg-[#4b8cc4]">
                    Notifications
                </a>
            </div>
            <div className="justify-center flex cursor-pointer px-3 py-2 rounded hover:bg-[#4b8cc4] space-x-1">
                <IoMdSettings className="mt-1" />
                <button 
                  className="cursor-pointer rounded hover:bg-[#4b8cc4]"
                  onClick={() => setIsSettingsOpen(true)}
                >
                    Settings
                </button>
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
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
                <FaHome className="mt-1"/>
                <a href="Link for Dashboard"> Dashboard </a>
            </div>
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
                <IoIosNotifications className="mt-1"/>
                <a href="Link for Dashboard"> Notification </a>
            </div>
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4]">
                <IoMdSettings className="mt-1"/>
                <a href="Link for Dashboard"> Settings </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default HeaderTherapistDashboard;

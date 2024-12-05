import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import { IoIosNotifications, IoMdSettings } from "react-icons/io";

import Logo from "../../assets/images/logobetter.png";
import { useAuth } from "../../hooks/useAuth";


const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [monthlyRate, setMonthlyRate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [therapistId, setTherapistId] = useState(null);
  const { user } = useAuth();  // Get user data from useAuth hook

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchTherapistDetails();
    }
  }, [isOpen, user?.id]);

  const fetchTherapistDetails = async () => {
    if (!user?.id) {
      setErrorMessage("User ID is not available.");
      return;
    }

    try {
      const response = await fetch(`/api/therapists/user/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFirstName(data.therapist.first_name || '');
        setLastName(data.therapist.last_name || '');
        setEmail(data.therapist.email || '');
        setExperienceYears(data.therapist.experience_years || '');
        setMonthlyRate(data.therapist.monthly_rate || '');
      } else {
        setErrorMessage(data.message || "Failed to fetch therapist details.");
      }
    } catch (error) {
      console.error("Error fetching therapist details:", error);
      setErrorMessage(error.message || "Error fetching therapist details.");
    }
  };

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/accountSettings/therapist/${user.id}`, {
        method: "PATCH", // Use PATCH to update the therapist details
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          experience_years: experienceYears,
          new_password: newPassword,
          monthly_rate: monthlyRate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Details updated successfully.");
        onClose(); // Close the modal after successful update
      } else {
        setErrorMessage(data.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating therapist details:", error);
      setErrorMessage(error.message || "Error updating therapist details.");
    }
  };
  const handleDeleteAccount = async () => {
    if (!user?.id) {
      setErrorMessage("User ID is not available.");
      return;
    }
  
    const fetchTherapistId = async () => {
      if (!user?.id) {
        setErrorMessage("User ID is not available.");
        return null; // Return null if there's no user ID
      }
  
      try {
        const response = await fetch(`/api/therapists/find/${user.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text(); // Read as text to understand error response
          setErrorMessage(errorText || "Failed to fetch therapist ID.");
          return null;
        }
  
        const data = await response.json();
        console.log("Therapist ID Response:", data);
  
        if (data.therapist?.id) {
          return data.therapist.id; // Return the therapist ID
        } else {
          setErrorMessage("Therapist ID is not available in the response.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching therapist ID:", error);
        setErrorMessage(error.message || "Error fetching therapist ID.");
        return null;
      }
    };
  
    // Proceed with deleting the therapist
    const therapistId = await fetchTherapistId();
  
    if (!therapistId) {
      return; // If no therapist ID is found, exit the function
    }
  
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const response = await fetch(`/api/accountSettings/therapist/delete/${therapistId}`, {
          method: "DELETE", // Use DELETE for account deletion
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json(); // Parse the response JSON
  
        if (!response.ok) {
          // Handle error: check for error messages like unpaid invoices or active relationships
          console.error("Error response:", data); // Log error response for debugging
          setErrorMessage(data.error || "Failed to delete account.");
          return;
        }
  
        // If the deletion was successful
        alert("Account deleted successfully.");
        onClose(); // Close the modal after successful deletion
      } catch (error) {
        console.error("Error deleting account:", error);
        setErrorMessage(error.message || "Error deleting account.");
      }
    }
  };
  
  
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg outline outline-white outline-2 outline-offset-2">
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">Therapist Settings</h2>

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
              min="0"
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
            min="0"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={monthlyRate}
            onChange={(e) => setMonthlyRate(e.target.value)}
            placeholder="Enter your monthly rate"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mt-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-300 p-2 rounded-md hover:bg-gray-400">
            Close
          </button>
          <div className="flex space-x-4">
            <button onClick={handleDeleteAccount} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600">
              Delete Account
            </button>
            <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              Save Changes
            </button>
          </div>
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

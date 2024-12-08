import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProfilePicture from "../ProfilePicture";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";

import Logo from "../../assets/images/logobetter.png";

interface UserSettings {
  fname: string;
  last_name: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchSettings();
    }
  }, [isOpen, user?.id]);

  const fetchSettings = async () => {
    if (!user?.id) {
      setDeleteErrorMessage("User ID is not available.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (data && data.first_name && data.last_name && data.email) {
        setUserSettings({
          fname: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setDeleteErrorMessage("Failed to fetch user settings.");
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      setDeleteErrorMessage(error.message || "Failed to fetch user settings.");
    }
  };



  const handleSave = async () => {
    if (!userSettings) {
      setSaveErrorMessage("User settings are not loaded.");
      return;
    }
  
    // Check if passwords match before proceeding
    if (userSettings.newPassword !== userSettings.confirmPassword) {
      window.alert("Passwords do not match. Please try again."); // Show a pop-up alert
      return;
    }
  
    try {
      const response = await fetch(`/api/accountSettings/student/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: userSettings.fname,
          last_name: userSettings.last_name,
          email: userSettings.email,
          ...(userSettings.newPassword && { password: userSettings.newPassword }), // Send the correct field name
        }),
      });
  
      const data = await response.json();
      console.log("Response Data:", data);
  
      if (response.ok) {
        alert("Details updated successfully.");
        setSaveErrorMessage(""); // Clear error message on success
        onClose(); // Close the modal after successful update
      } else {
        setSaveErrorMessage(data.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating therapist details:", error);
      setSaveErrorMessage(error.message || "Error updating therapist details.");
    }
  };
  

  // Handle student deletion
  const handleDelete = async () => {
    if (!user?.id) {
      setDeleteErrorMessage("User ID is not available.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this account? This action is irreversible.");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/accountSettings/students/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Account deleted successfully.");
        window.location.href = "/"; // Or wherever you want to redirect
      } else {
        setDeleteErrorMessage(data.error || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error fetching therapist data or deleting account:", error);
      setDeleteErrorMessage("An error occurred while deleting the account.");
    }
  };
  





  const handleClose = () => {
    onClose(); // Close the modal
    // Reset error messages and success state when modal is closed
    setDeleteErrorMessage("");
    setSaveErrorMessage("");
    setSuccessMessage("");
    setUserSettings(null); // Optional: Reset settings when modal is closed
  };
  
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg w-full max-w-lg">
          <div className="flex">
            <div className="w-full p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-[#5E9ED9] font-bold">Settings</h2>
                <button
                  className="text-black px-2 rounded hover:text-gray-900"
                  onClick={onClose}
                >
                  X
                </button>
              </div>

              {userSettings ? (
                <div>
                    <div className="w-full">

                    <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg text-black"
                      value={userSettings.fname}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev!,
                          fname: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="w-full">
                  <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name</label>
                  <input
                      type="text"
                      className="w-full p-3 border rounded-lg text-black"
                      value={userSettings.last_name}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev!,
                          last_name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="w-full">
                  <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
                  <input
                      type="email"
                      className="w-full p-3 border rounded-lg text-black"
                      value={userSettings.email}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev!,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="w-full">
                  <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">New Password</label>
                  <input
                      type="password"
                      className="w-full p-3 border rounded-lg text-black"
                      value={userSettings.newPassword}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev!,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="w-full">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
                  <input
                      type="password"
                      className="w-full p-3 border rounded-lg text-black"
                      value={userSettings.confirmPassword}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev!,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Save Button and Error Message */}
                  <div className="justify-between flex">
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        className="bg-[#5E9ED9] text-white px-4 py-2 w-44 rounded hover:bg-[#4a8ac9]"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      {saveErrorMessage && (
                        <p className="text-red-500 mt-2 text-sm">{saveErrorMessage}</p>
                      )}
                      {successMessage && (
                        <p className="text-green-500 mt-2 text-sm">{successMessage}</p>
                      )}
                    </div>

                    {/* Delete Button and Error Message */}
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        className="bg-red-500 text-white px-4 py-2 w-44 rounded hover:bg-red-600"
                        onClick={handleDelete}
                      >
                        Delete Account
                      </button>
                      {deleteErrorMessage && (
                        <p className="text-red-500 mt-2 text-sm">{deleteErrorMessage}</p>
                      )}
                      {successMessage && (
                        <p className="text-green-500 mt-2 text-sm">{successMessage}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading settings...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  
};

const LogoutConfirmationModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-bold text-center text-black mb-4">Confirm Logout</h2>
        <p className="text-center text-black mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-center space-x-3">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Log Out
          </button>
          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#73a3d0]"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const HeaderStudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useAuth(); 
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
        {/* Logo Section */}
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
  
        {/* Profile and Navigation Section */}
        <div className="flex items-center gap-4">
          {/* Student Info */}
          {user && (
            <div className="flex items-center gap-2">
              <ProfilePicture
                userRole="student"
                userId={user.id} // Assuming the user's ID is accessible
                className="w-14 h-14"
                style={{ border: "2px solid white" }}
              />
              <span className="text-white text-xl font-bold">
                {user.first_name} {user.last_name}
              </span>
            </div>
          )}
  
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 font-bold">
            <button
              className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4] transition"
              onClick={() => setIsSettingsOpen(true)}
            >
              <IoMdSettings className="inline" />
              <span>Settings</span>
            </button>
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
            <button
              className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-[#4b8cc4] transition"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <MdOutlineLogout className="inline" />
              <span>Logout</span>
            </button>
          </nav>
  
          {/* Mobile Hamburger Icon */}
          <button onClick={toggleMenu} className="md:hidden">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
  
      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden text-center font-bold bg-[#5E9ED9] text-white p-4 space-y-2">
          <button
            className="block px-3 py-2 rounded hover:bg-[#4b8cc4] transition w-full text-left"
            onClick={() => setIsSettingsOpen(true)}
          >
            <IoMdSettings className="inline mr-2" />
            Settings
          </button>
          <button
            className="block px-3 py-2 rounded hover:bg-[#4b8cc4] transition w-full text-left"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <MdOutlineLogout className="inline mr-2" />
            Logout
          </button>
        </nav>
      )}
  
      {/* Modals */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </header>
  );
  
};

export default HeaderStudentDashboard;
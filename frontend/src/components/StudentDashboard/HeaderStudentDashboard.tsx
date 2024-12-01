import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Assuming you're using an AuthContext or similar

import { FaBars, FaTimes } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";

import Logo from "../../assets/images/logobetter.png";

import { useAuth } from "../../hooks/useAuth";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch settings when the modal is opened and the user ID is available
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchSettings();
    }
  }, [isOpen, user?.id]);

  const fetchSettings = async () => {
    if (!user?.id) {
      setErrorMessage("User ID is not available.");
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

      // Log the response data for debugging
      console.log("Response Data:", data);

      // Ensure the response contains the necessary fields
      if (data && data.first_name && data.last_name && data.email) {
        setUserSettings({
          fname: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setErrorMessage("Failed to fetch user settings.");
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      setErrorMessage(error.message || "Failed to fetch user settings.");
    }
  };

  const handleSave = async () => {
    if (!userSettings) {
      setErrorMessage("User settings are not loaded.");
      return;
    }
  
    if (userSettings.newPassword !== userSettings.confirmPassword) {
      setErrorMessage("Passwords do not match.");
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
          ...(userSettings.newPassword && { newPassword: userSettings.newPassword }), // Include new password if provided
        }),
      });
  
      // Log the response data for debugging
      const data = await response.json();
      console.log("Response Data:", data);
  
      if (response.ok) {
        setSuccessMessage("Settings saved successfully.");
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving user settings:", error);
      setErrorMessage(error.message || "Failed to save settings.");
    }
  };
  
  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl">
          <div className="flex">
            {/* Left Panel: User Info Form */}
            <div className="w-full p-8">
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold text-blue-600">User Settings</h2>
                <button
                  className="bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-500"
                  onClick={onClose}
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Form to display and edit user settings */}
              {userSettings ? (
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700">First Name</label>
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

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700">Last Name</label>
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

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700">Email</label>
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

                  {/* New Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700">New Password</label>
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

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700">Confirm Password</label>
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

                  <div className="flex justify-between">
                    <button
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    {errorMessage && (
                      <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
                    )}
                    {successMessage && (
                      <p className="text-green-500 mt-2 text-sm">{successMessage}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">Loading user settings...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
const HeaderStudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
            <IoMdSettings className="mt-1" />
            <button 
              className="cursor-pointer rounded hover:bg-[#4b8cc4]"
              onClick={() => setIsSettingsOpen(true)}
            >
                Settings
            </button>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          </div>
          <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-red-400">
            <MdOutlineLogout className="mt-1"/>
            <button
              onClick={handleLogout}
            >
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
              <IoMdSettings className="mt-1"/>
              <a href="Link for Dashboard"> Settings </a>
            </div>
            <div className="justify-center flex space-x-1 px-3 py-2 rounded hover:bg-red-400">
              <MdOutlineLogout className="mt-1"/>
              <button
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default HeaderStudentDashboard;
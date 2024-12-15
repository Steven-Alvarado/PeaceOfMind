import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProfilePicture from "../ProfilePicture";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import Logo from "../../assets/images/logobetter.png";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

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
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchSettings();
      setSaveErrorMessage("");
      setDeleteErrorMessage(""); 
      setSuccessMessage("");
    }
  }, [isOpen, user?.id]);

  const fetchSettings = async () => {
    if (!user?.id) {
      setDeleteErrorMessage("User ID is not available.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data && data.first_name && data.last_name && data.email) {
        setUserSettings({
          fname: data.first_name,
          last_name: data.last_name,
          email: data.email,
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
  
    const { fname, last_name, email, newPassword, confirmPassword } = userSettings;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!fname.trim()) {
      setSaveErrorMessage("First name cannot be empty.");
      return;
    }
  
    if (!last_name.trim()) {
      setSaveErrorMessage("Last name cannot be empty.");
      return;
    }
  
    if (!email.trim() || !emailRegex.test(email)) {
      setSaveErrorMessage("Please enter a valid email address.");
      return;
    }
  
    if (newPassword && (!confirmPassword || newPassword !== confirmPassword)) {
      setSaveErrorMessage(
        "Passwords do not match. Please confirm your new password."
      );
      return;
    }
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/accountSettings/student/${user.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: fname,
            last_name: last_name,
            email,
            password: newPassword || undefined,
          }),
        }
      );
  
      if (response.ok) {
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            firstName: fname,
            lastName: last_name,
            email,
          };
        });
  
        setSuccessMessage("Details updated successfully.");
        setSuccessModalOpen(true);
      } else {
        setSaveErrorMessage("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      setSaveErrorMessage("Error updating details.");
    }
  };

  const handleDelete = async () => {
    if (!user?.id) {
      setDeleteErrorMessage("User ID is not available.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/accountSettings/students/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDeleteModalOpen(false);
        localStorage.removeItem("jwt");
        navigate("/");
      } else {
        setDeleteErrorMessage(data.error || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteErrorMessage("An error occurred while deleting the account.");
    }
  };

  const handleCloseModal = () => {
    setSuccessModalOpen(false);
    setSuccessMessage("");
    onClose();
  };

  const handleClose = () => {
    onClose();
    setDeleteErrorMessage("");
    setSaveErrorMessage("");
    setSuccessMessage("");
    setUserSettings(null);
  };
  
  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg relative">
            <div className="flex">
              <div className="w-full p-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-[#5E9ED9]">Settings</h2>
                  <button
                    className="text-black px-2 rounded hover:text-gray-900"
                    onClick={handleClose}
                  >
                    X
                  </button>
                </div>

                {userSettings ? (
                  <div className="space-y-3">
                    <div className="w-full">
                      <label htmlFor="firstName" className="block text-black mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-[#5E9ED9] rounded-lg text-black font-medium"
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
                      <label htmlFor="lastName" className="block text-black mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-[#5E9ED9] rounded-lg text-black font-medium"
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
                      <label htmlFor="email" className="block text-black mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full p-3 border border-[#5E9ED9] rounded-lg text-black font-medium"
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
                      <label htmlFor="newPassword" className="block text-black mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-[#5E9ED9] rounded-lg text-black font-medium"
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
                      <label htmlFor="confirmPassword" className="block text-black mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-[#5E9ED9] rounded-lg text-black font-medium"
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
                        className="bg-[#5E9ED9] text-white mt-5 px-4 py-2 rounded w-48 hover:bg-[#4a8ac9]"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 mt-5 py-2 w-48 rounded hover:bg-red-600"
                        onClick={() => setDeleteModalOpen(true)}
                      >
                        Delete Account
                      </button>
                    </div>
                    <p className="text-red-500 text-center mt-3">{saveErrorMessage}{deleteErrorMessage}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading settings...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {successModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
            <h2 className="text-lg font-bold text-center text-[#5E9ED9] mb-4">
              Success
            </h2>
            <p className="text-center text-gray-700 mb-6">{successMessage}</p>
            <div className="flex justify-center">
              <button
                className="bg-[#5E9ED9] text-white px-6 py-2 rounded-lg hover:bg-[#4a8ac9]"
                onClick={handleCloseModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h2 className="text-lg font-bold text-center text-black mb-4">
              Confirm Account Deletion
            </h2>
            <p className="text-center text-black mb-6 font-normal">
              Are you sure you want to delete your account? This action is irreversible.
            </p>
            <div className="flex justify-center gap-10">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
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
  
  /*const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      await axios.post(`${API_BASE_URL}/api/profilePicture/upload/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Optionally, you can trigger a refresh to update the profile picture
      window.location.reload(); // Refresh the page to fetch the updated profile picture
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
    }
  };*/

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
              {/* Profile Picture as a button */}
              <label htmlFor="profile-picture-upload" className="cursor-pointer">
                <ProfilePicture
                  userRole="student"
                  userId={user.id}
                  className="w-14 h-14"
                  style={{ border: "2px solid white" }}
                />
              </label> 
              <span className="text-white text-xl font-bold">
                {user.firstName} {user.lastName}
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

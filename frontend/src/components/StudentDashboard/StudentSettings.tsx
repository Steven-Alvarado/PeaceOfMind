import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Lock,
  Mail,
  Trash2,
  X,
  Check,
  Camera,
} from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  );
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      if (data && data.first_name && data.last_name && data.email) {
        setUserSettings({
          fname: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          newPassword: "",
          confirmPassword: "",
        });
        setProfileImage(data.profile_picture_url || profileImage);
      } else {
        setErrorMessage("Failed to fetch user settings.");
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      setErrorMessage(error.message || "Failed to fetch user settings.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSettings((prev) => ({
      ...prev!,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

    setLoading(true);
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
          profile_picture_url: profileImage, // Save profile picture URL
          ...(userSettings.newPassword && { newPassword: userSettings.newPassword }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Settings updated successfully.");
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving user settings:", error);
      setErrorMessage(error.message || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) {
      setErrorMessage("User ID is not available.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;

    setLoading(true);
    try {
      const response = await fetch(`/api/accountSettings/students/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      setErrorMessage(error.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setErrorMessage("");
    setSuccessMessage("");
    setUserSettings(null);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 text-center">
                <div className="relative inline-block">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="fname"
                    value={userSettings?.fname || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userSettings?.email || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="col-span-full flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 border border-red-300 text-red-500 rounded-lg"
                >
                  Delete Account
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsModal;


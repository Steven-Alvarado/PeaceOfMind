import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface ProfilePictureProps {
  userRole: "student" | "therapist";
  userId?: number;
  therapistId?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  userRole,
  userId,
  therapistId,
  className,
  style,
}) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  // Memoize the endpoint to avoid unnecessary recomputation
  const endpoint = useMemo(() => {
    if (userRole === "student" && userId) {
      return `${API_BASE_URL}/api/profilePicture/${userId}`;
    } else if (userRole === "therapist" && therapistId) {
      return `${API_BASE_URL}/api/profilePicture/therapist/${therapistId}`;
    }
    return null;
  }, [userRole, userId, therapistId]);

  useEffect(() => {
    if (!endpoint || profilePictureUrl) return;

    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(endpoint);
        const relativeUrl = response.data.profile_picture_url;
        setProfilePictureUrl(`${API_BASE_URL}${relativeUrl}`);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePictureUrl(`${API_BASE_URL}/uploads/default-profile.png`);
      }
    };

    fetchProfilePicture();
  }, [endpoint, profilePictureUrl]);

  return (
    <img
      src={profilePictureUrl || `${API_BASE_URL}/uploads/default-profile.png`}
      alt="Profile"
      className={`rounded-full object-cover ${className || ""}`}
      style={style || {}}
      onError={(e) => {
        const imgElement = e.target as HTMLImageElement;
        imgElement.onerror = null;
        imgElement.src = `${API_BASE_URL}/uploads/default-profile.png`;
      }}
    />
  );
};

export default ProfilePicture;

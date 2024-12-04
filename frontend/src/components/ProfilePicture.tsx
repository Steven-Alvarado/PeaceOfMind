import React, { useState, useEffect } from "react";
import axios from "axios";

interface ProfilePictureProps {
  userRole: "student" | "therapist"; // Indicates the role of the user
  userId?: number; // Unified user ID (for students or users in general)
  therapistId?: number; // Therapist ID (used if userRole is "therapist")
  className?: string; // Optional class names for custom styling
  style?: React.CSSProperties; // Optional inline styles for custom dimensions
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  userRole,
  userId,
  therapistId,
  className,
  style,
}) => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      `Fetching profile picture for Role: ${userRole}, User ID: ${userId}, Therapist ID: ${therapistId}`
    );

    const fetchProfilePicture = async () => {
      try {
        let endpoint = "";

        // Determine the endpoint based on the user's role and available IDs
        if (userRole === "student" && userId) {
          endpoint = `http://localhost:5000/api/profilePicture/${userId}`;
        } else if (userRole === "therapist" && therapistId) {
          endpoint = `http://localhost:5000/api/profilePicture/therapist/${therapistId}`;
        } else {
          console.error("Invalid inputs for fetching profile picture.");
          setProfilePictureUrl("http://localhost:5000/uploads/default-profile.png");
          return;
        }

        console.log(`Using endpoint: ${endpoint}`); // Debug

        const response = await axios.get(endpoint);
        const relativeUrl = response.data.profile_picture_url;

        // Construct the full profile picture URL
        setProfilePictureUrl(`http://localhost:5000${relativeUrl}`);
      } catch (error) {
        console.error("Error fetching profile picture:", error);

        // Fallback to the default profile picture
        setProfilePictureUrl("http://localhost:5000/uploads/default-profile.png");
      }
    };

    // Trigger the fetch if the required IDs are available
    if ((userRole === "student" && userId) || (userRole === "therapist" && therapistId)) {
      fetchProfilePicture();
    }
  }, [userRole, userId, therapistId]);

  return (
    <img
      src={profilePictureUrl || "http://localhost:5000/uploads/default-profile.png"}
      alt="Profile"
      className={`rounded-full object-cover ${className || ""}`} // Apply custom class names
      style={style || {}} // Apply custom inline styles
      onError={(e) => {
        const imgElement = e.target as HTMLImageElement;
        imgElement.onerror = null;
        imgElement.src = "http://localhost:5000/uploads/default-profile.png";
      }}
      
    />
  );
};

export default ProfilePicture;

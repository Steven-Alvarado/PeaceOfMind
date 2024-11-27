import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import StudentDashboardAnimation from "../../assets/lotties/StudentDashboardAnimation.json";
import {
  FaChevronDown,
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendar,
  FaComments,
} from "react-icons/fa";
import axios from "axios";
import { User } from "../../context/AuthContext";
import MessagingInterface from "../Messaging/MessagingInterface";

interface TherapistSectionProps {
  user: User; // Define that user prop is of type User
}

const TherapistSection: React.FC<TherapistSectionProps> = ({ user }) => {
  const [therapist, setTherapist] = useState<any | null>(null); // State for therapist details
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat interface

  useEffect(() => {
    const fetchTherapistDetails = async () => {
      try {
        if (user) {
          const response = await axios.get(`/students/${user.id}/listTherapists/`);
          setTherapist(response.data.therapist); // Adjust based on API response structure
        } else {
          throw new Error("User not authenticated");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load therapist details");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistDetails();
  }, [user]);

  if (loading) return <div>Loading therapist details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      {/* Lottie Animation */}
      <div className="flex justify-center bg-blue-100 rounded-lg border border-[#5E9ED9] shadow-lg mb-12">
        <Lottie
          animationData={StudentDashboardAnimation}
          loop={true}
          style={{ width: "45%", height: "45%" }}
        />
      </div>

      {/* Therapist Details */}
      <div className="bg-blue-100 rounded-lg shadow-lg p-6 border border-[#5E9ED9]">
        <h2 className="text-2xl text-center font-bold text-[#5E9ED9] mb-10">
          Your Therapist
        </h2>
        <p className="text-xl text-center font-medium text-gray-800 mb-10">
          {therapist?.name || "No therapist assigned"}
        </p>
        <div className="mb-14">
          <button
            className="w-full bg-[#5E9ED9] text-white px-4 py-2 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            View Details
            <FaChevronDown
              className={`ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
          {isExpanded && therapist && (
            <div className="mt-4 flex space-x-5 justify-center text-gray-700">
              <p>
                <FaUser className="inline mr-2 text-[#5E9ED9]" />
                <span className="font-medium">Years of Experience:</span>{" "}
                {therapist.experience_years || "N/A"}
              </p>
              <p>
                <FaBriefcase className="inline mr-2 text-[#5E9ED9]" />
                <span className="font-medium">Specialty:</span>{" "}
                {therapist.specialization || "N/A"}
              </p>
              <p>
                <FaMapMarkerAlt className="inline mr-2 text-[#5E9ED9]" />
                <span className="font-medium">Location:</span>{" "}
                {therapist.location || "N/A"}
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center space-x-4 mb-5">
          <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9] transition">
            <FaCalendar className="inline mr-2" /> Schedule Appointment
          </button>
          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9] transition"
            onClick={() => setIsChatOpen(!isChatOpen)} // Toggle chat interface
          >
            <FaComments className="inline mr-2" /> Chat
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
            >
              &#x2715;
            </button>
            <MessagingInterface userId={user.id} userRole={user.role}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistSection;

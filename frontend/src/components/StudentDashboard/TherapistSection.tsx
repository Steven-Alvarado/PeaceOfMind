import React, { useState, useEffect } from "react";
import { FaCalendar, FaComments } from "react-icons/fa";
import {
  FaClipboardList,
  FaPerson,
  FaPersonWalkingArrowRight,
} from "react-icons/fa6";
import Alert from "@mui/material/Alert";
import { CiStar, CiBadgeDollar } from "react-icons/ci";
import { MdOutlineWorkHistory, MdOutlineMail } from "react-icons/md";
import { MessageCircle, Search, Star, Calendar } from "lucide-react";

import TherapistModal from "./TherapistModal";
import DropModal from "./DropTherapist";
import axios from "axios";
import { User } from "../../context/AuthContext";
import MessagingInterface from "../Messaging/MessagingInterface";

interface TherapistSectionProps {
  user: User;
}

const TherapistSection: React.FC<TherapistSectionProps> = ({ user }) => {
  const [therapistName, setTherapistName] = useState<string | null>(null);
  const [therapistDetails, setTherapistDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [sentAlert, setSentAlert] = useState(false);
  const [sentDrop, setSentDrop] = useState(false);

  const [isTherListOpen, setIsTherListOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleAlert = () => {
    setSentAlert((prev) => !prev);
  };

  const handleDrop = () => {
    setSentDrop((prev) => !prev);
  };

  useEffect(() => {
    const fetchTherapistRelationship = async () => {
      try {
        const response = await axios.get(`/api/relationships/${user.id}`);
        const relationship = response.data.relationship;

        if (relationship?.current_therapist_id) {
          setTherapistName(
            `${relationship.current_therapist_first_name} ${relationship.current_therapist_last_name}`
          );
          fetchTherapistDetails(relationship.current_therapist_id);
        } else {
          setTherapistName(null);
          setTherapistDetails(null);
        }
      } catch (err) {
        console.error("Failed to load therapist relationship:", err);
        setTherapistName(null);
        setTherapistDetails(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchTherapistDetails = async (therapistId: number) => {
      try {
        const response = await axios.get(`/api/therapists/${therapistId}`);
        setTherapistDetails(response.data.therapist);
      } catch (err) {
        console.error("Error fetching therapist details:", err);
        setTherapistDetails(null);
      }
    };

    fetchTherapistRelationship();
  }, [user, refresh]);

  if (loading) return <div>Loading therapist details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 mt-4">



      <div className="bg-blue-100 border-2 border-[#5E9ED9] rounded-lg shadow-lg p-12">
        {sentAlert && (
          <Alert severity="info" onClose={handleAlert}>
            Your request has been sent
          </Alert>
        )}
        {sentDrop && (
          <Alert severity="error" onClose={handleDrop}>
            Your therapist has been dropped.
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Therapist Image Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3"
                alt={therapistName || "Therapist"}
                className="rounded-full object-cover w-full h-full shadow-md transition duration-300 hover:shadow-lg"
              />
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Therapist Info Section */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                {therapistName || "No Therapist Assigned"}
              </h2>
              {therapistDetails && (
                <>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <CiStar className="w-5 h-5 mr-2 text-[#5E9ED9]" />
                    {therapistDetails.specialization}
                  </p>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <MdOutlineWorkHistory className="w-5 h-5 mr-2 text-[#5E9ED9]" />
                    {therapistDetails.experience_years} years experience
                  </p>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <MdOutlineMail className="w-5 h-5 mr-2 text-[#5E9ED9]" />
                    {therapistDetails.email}
                  </p>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <CiBadgeDollar className="w-5 h-5 mr-2 text-[#5E9ED9]" />$
                    {therapistDetails.monthly_rate} monthly
                  </p>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  setIsTherListOpen(true);
                  {
                    if (sentAlert) handleAlert();
                    if (sentDrop) handleDrop();
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-[#5E9ED9] text-white py-3 px-6 rounded-lg hover:bg-[#4b8bc4] transition duration-300 shadow-md hover:shadow-lg"
              >
                <Search className="w-5 h-5" />
                <span>
                  {therapistName ? "Switch Therapist" : "Find Therapist"}
                </span>
              </button>

              {therapistDetails && (
                <>
                  <button
                    onClick={() => {
                      setIsDropOpen(true);
                      {
                        if (sentAlert) handleAlert();
                        if (sentDrop) handleDrop();
                      }
                    }}
                    className="flex items-center justify-center space-x-2 bg-[#5E9ED9] text-white py-3 px-6 rounded-lg hover:bg-[#4b8bc4] transition duration-300 shadow-md hover:shadow-lg"
                  >
                    <FaPersonWalkingArrowRight className="w-5 h-5" />
                    <span>Drop Therapist</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center justify-center space-x-2 bg-white text-[#5E9ED9] border-2 border-[#5E9ED9] py-3 px-6 rounded-lg hover:bg-[#5E9ED9] hover:text-white transition duration-300 shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>

              <button className="flex items-center justify-center space-x-2 bg-white text-[#5E9ED9] border-2 border-[#5E9ED9] py-3 px-6 rounded-lg hover:bg-[#5E9ED9] hover:text-white transition duration-300 shadow-md hover:shadow-lg">
                <Calendar className="w-5 h-5" />
                <span>Schedule Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              ✕
            </button>
            <MessagingInterface
              userId={user.id}
              userRole={user.role}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}

      <DropModal
        isOpen={isDropOpen}
        sentDrop={handleDrop}
        onClose={() => {
          setIsDropOpen(false);
          handleRefresh();
        }}
      />

      {/* Therapist Modal */}
      <TherapistModal
        isOpen={isTherListOpen}
        refresh={refresh}
        sentAlert={handleAlert}
        onClose={() => {
          setIsTherListOpen(false);
          handleRefresh();
        }}
      />
    </div>
  );
};

export default TherapistSection;

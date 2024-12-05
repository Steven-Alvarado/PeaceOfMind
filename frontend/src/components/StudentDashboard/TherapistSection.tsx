import React, { useState, useEffect } from "react";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import { CiStar, CiBadgeDollar } from "react-icons/ci";
import { MdOutlineWorkHistory, MdOutlineMail } from "react-icons/md";
import { MessageCircle, Search, Star, Calendar } from "lucide-react";

import Alert from "@mui/material/Alert";
import TherapistModal from "./TherapistModal";
import DropModal from "./DropTherapist";
import axios from "axios";
import { User } from "../../context/AuthContext";
import MessagingInterface from "../Messaging/MessagingInterface";
import ProfilePicture from "../ProfilePicture";

interface TherapistSectionProps {
  user: User;
}

const TherapistSection: React.FC<TherapistSectionProps> = ({ user }) => {
  const [therapistName, setTherapistName] = useState<string | null>(null);
  const [therapistDetails, setTherapistDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [sentAlert, setSentAlert] = useState(false);
  const [sentDrop, setSentDrop] = useState(false);

  const [isTherListOpen, setIsTherListOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleRefresh = () => setRefresh((prev) => !prev);
  const handleAlert = () => setSentAlert((prev) => !prev);
  const handleDrop = () => setSentDrop((prev) => !prev);

  useEffect(() => {
    const fetchTherapistDetails = async (therapistId: number) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/therapists/${therapistId}`);
        setTherapistDetails(response.data.therapist);
        console.log(response.data.therapist);
      } catch (err) {
        console.error("Error fetching therapist details:", err);
      }
    };

    const fetchTherapistRelationship = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/relationships/${user.id}`);
        console.log("User ID:", user.id);
        const relationship = response.data.relationship;

        if (relationship?.current_therapist_id) {
          setTherapistName(
            `${relationship.current_therapist_first_name} ${relationship.current_therapist_last_name}`
          );
          await fetchTherapistDetails(relationship.current_therapist_id);
        } else {
          setTherapistName(null);
          setTherapistDetails(null);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Explicitly handle 404 (No therapist relationship)
          setTherapistName(null);
          setTherapistDetails(null);
        } else {
          console.error("Failed to load therapist relationship:", err);
          setError("Unable to load therapist relationship.");
        }
      } finally {
        setLoading(false); // Set loading to false after everything completes
      }
    };

    fetchTherapistRelationship();
  }, [user, refresh]);

  // DEBUGGING
  /* useEffect(() => {
     if (therapistDetails) {
       console.log("Therapist details are now available:", therapistDetails);
     } else {
       //console.log("Therapist details are not available.");
     }
   }, [therapistDetails]); */

  if (loading) return <div>Loading therapist details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (

    <div className="p-8 mt-1">
     <div className="p-6 mt-4 flex flex-col min-h-[400px]">
  <div className="bg-blue-100 border-2 border-[#5E9ED9] rounded-lg shadow-lg p-12 flex flex-col h-full">
    {sentAlert && (
      <Alert severity="info" onClose={handleAlert}>
        Your request has been sent.
      </Alert>
    )}
    {sentDrop && (
      <Alert severity="error" onClose={handleDrop}>
        Your therapist has been dropped.
      </Alert>
    )}
    <div className="flex items-center justify-center mb-6">
      <h2 className="text-2xl font-bold text-[#5E9ED9]">Therapist Details</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Therapist Image Section */}
      <div className="relative mx-auto">
        <ProfilePicture
          userRole="therapist"
          therapistId={therapistDetails?.therapist_id}
          className="w-full h-full rounded-full object-cover"
          style={{ width: "200px", height: "200px" }}
        />
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
      </div>
    </div>

    {/* Centered Buttons */}
    <div className="mt-auto flex justify-center py-4 items-center">
      <div className="grid grid-cols-2  gap-4">
        <button
          onClick={() => setIsTherListOpen(true)}
          className="flex items-center justify-center space-x-2 bg-[#5E9ED9] text-white py-3 px-6 rounded-lg hover:bg-[#4b8bc4] transition duration-300 shadow-md hover:shadow-lg"
        >
          <Search className="w-5 h-5" />
          <span>
            {therapistName ? "Switch Therapist" : "Find Therapist"}
          </span>
        </button>

        {therapistDetails && (
          <button
            onClick={() => setIsDropOpen(true)}
            className="flex items-center justify-center space-x-2 bg-[#5E9ED9] text-white py-3 px-6 rounded-lg hover:bg-[#4b8bc4] transition duration-300 shadow-md hover:shadow-lg"
          >
            <FaPersonWalkingArrowRight className="w-5 h-5" />
            <span>Drop Therapist</span>
          </button>
        )}

        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center justify-center space-x-2 bg-white text-[#5E9ED9] border-2 border-[#5E9ED9] py-3 px-6 rounded-lg hover:bg-[#5E9ED9] hover:text-white transition duration-300 shadow-md hover:shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat</span>
        </button>

        <button
          className="flex items-center justify-center space-x-2 bg-white text-[#5E9ED9] border-2 border-[#5E9ED9] py-3 px-6 rounded-lg hover:bg-[#5E9ED9] hover:text-white transition duration-300 shadow-md hover:shadow-lg"
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule Appointment</span>
        </button>
      </div>
    </div>
  </div>
</div>




      {/* Chat Modal */}
      {isChatOpen && (
        <MessagingInterface
          userId={user.id}
          userRole={user.role}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      <DropModal
        isOpen={isDropOpen}
        sentDrop={handleDrop}
        onClose={() => {
          setIsDropOpen(false);
          handleRefresh();
        }}
      />

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
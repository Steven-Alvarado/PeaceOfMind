import React, { useState, useEffect } from "react";
import { FaPersonWalkingArrowRight, FaDiscourse } from "react-icons/fa6";
import { CiStar, CiBadgeDollar } from "react-icons/ci";
import { MdOutlineWorkHistory, MdOutlineMail } from "react-icons/md";
import { MessageCircle, Search, Calendar } from "lucide-react";
import io from "socket.io-client";

import Alert from "@mui/material/Alert";
import TherapistModal from "./TherapistModal";
import DropModal from "./DropTherapist";
import ReviewModal from "./ReviewTherapist";
import axios from "axios";
import { User } from "../../context/AuthContext";
import MessagingInterface from "../Messaging/MessagingInterface";
import ProfilePicture from "../ProfilePicture";
import ScheduleForStudents from "./ScheduleForStudents";

const socket = io("http://localhost:5000"); // Replace with your backend URL

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
  const [sentReview, setSentReview] = useState(false);
  const [rejectionAlert, setRejectionAlert] = useState(false);

  const [isTherListOpen, setIsTherListOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const handleRefresh = () => setRefresh((prev) => !prev);
  const handleReview = () => setSentReview((prev) => !prev);
  const handleAlert = () => setSentAlert((prev) => !prev);
  const handleDrop = () => setSentDrop((prev) => !prev);
  const handleRejectionAlert = () => setRejectionAlert((prev) => !prev);

  // Helper to clear therapist state
  const resetTherapistState = () => {
    setTherapistName(null);
    setTherapistDetails(null);
  };

  // Fetch therapist relationship
  // Fetch therapist relationship
  const fetchTherapistRelationship = async () => {
    setLoading(true);
    resetTherapistState(); // Clear therapist state immediately

    try {
      const response = await axios.get(
        `http://localhost:5000/api/relationships/${user.id}`
      );
      const relationship = response.data.relationship;

      if (relationship?.current_therapist_id) {
        const fetchedDetails = await fetchTherapistDetails(
          relationship.current_therapist_id
        );
        setTherapistName(
          `${relationship.current_therapist_first_name} ${relationship.current_therapist_last_name}`
        );
        setTherapistDetails(fetchedDetails);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        resetTherapistState();
      } else {
        console.error("Failed to load therapist relationship:", err);
        setError("Unable to load therapist relationship.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch therapist details
  const fetchTherapistDetails = async (therapistId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/therapists/${therapistId}`
      );
      return response.data.therapist;
    } catch (err) {
      console.error("Error fetching therapist details:", err);
      return null;
    }
  };



  useEffect(() => {
    fetchTherapistRelationship();

    // Join a unique room for the current student
    socket.emit("joinStudentRoom", user.id);

    // Listen for real-time updates to the relationship
    const handleRelationshipChange = ({ status, therapistId }: any) => {
      if (status === "approved") {
        fetchTherapistRelationship();
      } else if (status === "rejected") {
        setRejectionAlert(true);
      } else if (status === "ended") {
        resetTherapistState();
      }
    };

    socket.on("relationship-changed", handleRelationshipChange);

    return () => {
      socket.off("relationship-changed", handleRelationshipChange);
      setTherapistDetails(null);
    };
  }, [user, refresh]);

  if (loading) return <div>Loading therapist details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 mt-1">
      <div className="p-6 mt-5 flex flex-col min-h-[400px]">
        <div className="bg-blue-100 border-2 border-[#5E9ED9] rounded-lg shadow-lg p-9 flex flex-col h-full">
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
          {sentReview && (
            <Alert severity="success" onClose={handleReview}>
              Your review has been submitted.
            </Alert>
          )}
          {rejectionAlert && (
            <Alert severity="error" onClose={handleRejectionAlert}>
              Your therapist request was rejected.
            </Alert>
          )}
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-[#5E9ED9]">
              Therapist Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Therapist Image Section */}
            {therapistDetails && (
              <div className="relative mx-auto">
                <ProfilePicture
                  userRole="therapist"
                  therapistId={therapistDetails.therapist_id}
                  className="w-full h-full rounded-full object-cover"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
            )}


            <div className="flex flex-col justify-center space-y-6 h-full">
              {therapistDetails ? (
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                    {therapistName}
                  </h2>
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
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center text-center px-10 py-32 bg-blue-50 p-6 rounded-lg shadow-md h-full w-[210%]">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                      Ready to find your new therapist?
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Click the{" "}
                      <span className="font-bold text-[#5E9ED9]">Find Therapist</span> button to
                      start your journey.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTherListOpen(true)}
                    className="mt-4 bg-[#5E9ED9] text-white py-3 px-6 rounded-lg hover:bg-[#4b8bc4] transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Find Therapist</span>
                  </button>
                </div>

              )}
            </div>


          </div>


          {/* Centered Buttons */}
          <div className="mt-auto flex justify-center py-4 items-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {/* Find/Switch Therapist Button */}

              {therapistDetails && (
                <button
                  onClick={() => setIsTherListOpen(true)}
                  className="flex items-center justify-center space-x-2 bg-[#5E9ED9] text-white py-3 px-6 rounded-lg hover:bg-[#4b8bc4] transition duration-300 shadow-md hover:shadow-lg"
                >
                  <Search className="w-5 h-5" />
                  <span>{therapistName ? "Switch Therapist" : "Find Therapist"}</span>
                </button>
              )}

              {/* Drop Therapist Button (if therapist is assigned) */}
              {therapistDetails && (
                <button
                  onClick={() => setIsDropOpen(true)}
                  className="flex items-center justify-center space-x-2 bg-[#5E9ED9] text-white py-3 px-6 rounded-lg hover:bg-[#4b8bc4] transition duration-300 shadow-md hover:shadow-lg"
                >
                  <FaPersonWalkingArrowRight className="w-5 h-5" />
                  <span>Drop Therapist</span>
                </button>
              )}

              {/* Chat Button (only visible if therapist is assigned) */}
              {therapistDetails && (
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center justify-center space-x-2 bg-white text-[#5E9ED9] border-2 border-[#5E9ED9] py-3 px-6 rounded-lg hover:bg-[#5E9ED9] hover:text-white transition duration-300 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>
              )}

              {/* Schedule Appointment Button (only visible if therapist is assigned) */}
              {therapistDetails && (
                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="flex items-center justify-center space-x-2 bg-white text-[#5E9ED9] border-2 border-[#5E9ED9] py-3 px-6 rounded-lg hover:bg-[#5E9ED9] hover:text-white transition duration-300 shadow-md hover:shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Appointment</span>
                </button>
              )}

              {/* Review Therapist Button (if therapist is assigned) */}
              {therapistDetails && (
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="col-span-2 flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 shadow-md hover:shadow-lg"
                >
                  <FaDiscourse className="w-5 h-5" />
                  <span>Review Therapist</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isChatOpen && (
        <MessagingInterface
          userId={user.id}
          userRole={user.role}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      <DropModal
        isOpen={isDropOpen}
        sentDrop={() => {
          setTherapistName(null); // Clear therapist name
          setTherapistDetails(null); // Clear therapist details
          handleDrop();
        }}
        onClose={() => {
          setIsDropOpen(false);
          fetchTherapistRelationship();
          handleRefresh();
        }}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        therapistId={therapistDetails?.therapist_id}
        sentReview={handleReview}
        onClose={() => {
          setIsReviewOpen(false);
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

      {isScheduleOpen && therapistDetails && (
        <ScheduleForStudents
          isOpen={isScheduleOpen}
          studentId={user.id}
          therapistId={therapistDetails.therapist_id}
          onClose={() => setIsScheduleOpen(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default TherapistSection;

import React, { useState, useEffect } from "react";

import { FaCalendar, FaComments } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";

import TherapistModal from "./TherapistModal";

import axios from "axios";
import { User } from "../../context/AuthContext";
import MessagingInterface from "../Messaging/MessagingInterface";

import { CiStar, CiBadgeDollar } from "react-icons/ci";
import { MdOutlineWorkHistory, MdOutlineMail } from "react-icons/md";


interface TherapistSectionProps {
  user: User;
}

const TherapistSection: React.FC<TherapistSectionProps> = ({ user }) => {
  const [therapistName, setTherapistName] = useState<string | null>(null);
  const [therapistDetails, setTherapistDetails] = useState<any>(null); // State for therapist details
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const [isTherListOpen, setIsTherListOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchTherapistRelationship = async () => {
      try {
        if (user) {
          // Fetch relationship details
          const response = await axios.get(`/api/relationships/${user.id}`);
          const relationship = response.data.relationship;
  
          if (relationship && relationship.current_therapist_id) {
            setTherapistName(
              `${relationship.current_therapist_first_name} ${relationship.current_therapist_last_name}`
            );
            fetchTherapistDetails(relationship.current_therapist_id); // Fetch therapist details
          } else {
            // No therapist assigned
            setTherapistName(null);
            setTherapistDetails(null);
          }
        } else {
          throw new Error("User not authenticated");
        }
      } catch (err: any) {
        console.error("Failed to load therapist relationship:", err);
        // Assume no therapist if error occurs
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
      } catch (err: any) {
        console.error("Error fetching therapist details:", err);
        setTherapistDetails(null);
      }
    };
  
    fetchTherapistRelationship();
  }, [user]);


  if (loading) return <div>Loading therapist details...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="bg-blue-100 rounded-lg shadow-lg p-6 border border-[#5E9ED9]">
        <h2 className="text-4xl text-center font-bold text-[#5E9ED9] mb-1">
          My Therapist
        </h2>
        {therapistName ? (
          <>
            <div className=" justify-center flex mb-2">
              <p className="text-2xl text-center shadow-lg rounded-md p-2 font-medium bg-white border-2 border-[#5E9ED9] text-[#5E9ED9]">
                Dr. {therapistName}
              </p>
            </div>
            {therapistDetails && (
              <div>
                <div className="flex flex-col items-center justify-center ">
                  <div className="bg-white w-full p-4 mb-6 shadow-lg rounded-md border-2 border-[#5E9ED9]">
                    <p className="text-xl font-bold text-[#5E9ED9]">Details</p>

                    <div className="flex">
                      <p className="w-1/2"><strong><CiStar className="inline mb-1"/> Specialization:</strong> {therapistDetails.specialization}</p>
                      <p className="w-1/2"><strong><MdOutlineWorkHistory className="inline mb-1"/> Experience:</strong> {therapistDetails.experience_years} years</p>
                    </div>
                    
                    <div className="flex ">
                      <p className="w-1/2"><strong><CiBadgeDollar className="inline mb-1"/> Monthly Rate:</strong> <span className="text-green-600">${therapistDetails.monthly_rate}</span></p>
                      <p className="w-1/2"><strong><MdOutlineMail className="inline mb-1"/> Email:</strong> {therapistDetails.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xl text-center bg-[#5E9ED9] rounded-xl p-2 font-medium text-white mt-5 mb-5">
            No therapist assigned, please click find a therapist and request one.
          </p>
        )}
        <div className="flex justify-center space-x-4 mb-2">
          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded shadow-lg hover:bg-[#4a8ac9] transition"
            onClick={() => setIsTherListOpen(true)}
          >
            <FaClipboardList className="inline mr-2 mb-1" />
            {therapistName ? "Switch Therapist" : "Request a Therapist"}
          </button>
          <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded shadow-lg  hover:bg-[#4a8ac9] transition">
            <FaCalendar className="inline mr-2 mb-1" /> Schedule Appointment
          </button>
          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded shadow-lg  hover:bg-[#4a8ac9] transition"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <FaComments className="inline mr-2 mb-1" /> Chat
          </button>
        </div>
        <TherapistModal isOpen={isTherListOpen} onClose={() => setIsTherListOpen(false)} />
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
            >
              &#x2715;
            </button>
            <MessagingInterface userId={user.id} userRole={user.role} />
          </div>
        </div>
      )}
    </div>
  );
};


export default TherapistSection;

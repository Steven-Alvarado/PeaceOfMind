import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, MessageCircle, FileText, X } from "lucide-react";
import MessagingInterface from "../Messaging/MessagingInterface";

interface PatientListComponentProps {
  therapistId: number;
  refresh: boolean;
}

const PatientSection: React.FC<PatientListComponentProps> = ({
  therapistId,
  refresh,
}) => {
  const [currPatients, setCurrPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patEmail, setPatEmail] = useState<string | null>(null);
  const [patientFilter, setPatientFilter] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // State to toggle details modal

  useEffect(() => {
    const fetchRequests = async () => {
      if (!therapistId) return;
      try {
        const response = await axios.get(
          `/api/relationships/therapist/${therapistId}`
        );
        console.log("Relationships Response:", response.data);
        setCurrPatients(response.data.relationships || []);
      } catch (error) {
        console.error("Error retrieving relationships", error);
      }
    };

    fetchRequests();
  }, [therapistId, refresh]);

  const activeRelations = currPatients.filter(
    (relation) => relation.status !== "pending"
  );

  const filteredPatients = activeRelations.filter((patient) => {
    const fullName =
      (patient.student_first_name || "").toLowerCase() +
      " " +
      (patient.student_last_name || "").toLowerCase();
    return fullName.includes(patientFilter.toLowerCase());
  });

  const getEmail = async (studentId: number) => {
    try {
      const response = await axios.get(`/api/users/email/${studentId}`);
      console.log("Email GET successful:", response.data);
      setPatEmail(response.data.email || null);
    } catch (error) {
      console.error("Error retrieving email:", error);
    }
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    getEmail(patient.student_id);
    setIsDetailsOpen(true); // Open the details modal
  };

  const handleChat = (patient: any) => {
    setSelectedPatient(patient);
    setIsChatOpen(true); // Open the chat modal
  };

  return (
    <div className="flex flex-row w-full h-full p-6 space-x-4">
      <div className="flex-grow bg-blue-100 border-2 border-[#5E9ED9] rounded-lg p-6">
        {/* <h1>Therapist ID: {therapistId}</h1> */}
        <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
          My Patients
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <input
            type="text"
            placeholder="Type part of name..."
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="w-2/3 border border-[#5E9ED9] rounded-md p-2.5 text-black focus:outline-none focus:ring-2 focus:ring-[#5E9ED9]"
          />
        </div>

        <div className="space-y-4 mb-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-50 hover:bg-blue-100 transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {patient.student_first_name} {patient.student_last_name}
                </h3>
                <p className="text-sm text-gray-600">
                  Assigned patient since{" "}
                  {new Date(patient.updated_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-lg hover:bg-[#4b8bc4] transition"
                  onClick={() => handleViewDetails(patient)}
                >
                  <User className="w-5 h-5" />
                  <span>View Details</span>
                </button>
                <button
                  className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-lg hover:bg-[#4b8bc4] transition"
                  onClick={() => handleChat(patient)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedPatient && isDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-8 max-w-xl w-full shadow-lg">
            <button
              onClick={() => {
                setIsDetailsOpen(false); // Close details modal
                setSelectedPatient(null);
                setPatEmail(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-semibold text-center text-[#5E9ED9] mb-4">
              Details for {selectedPatient.student_first_name}{" "}
              {selectedPatient.student_last_name}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email: </strong> {patEmail || <span>Loading...</span>}
              </p>
              <p className="text-gray-700">
                <strong>Notes:</strong> Notes go here
              </p>
            </div>
            <div className="flex justify-around mt-6">
              <button
                className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4b8bc4] transition"
                onClick={() => handleChat(selectedPatient)} // Open chat modal from details
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4b8bc4] transition">
                <FileText className="w-5 h-5" />
                <span>Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedPatient && isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-8 max-w-3xl w-full shadow-lg">
            <button
              onClick={() => setIsChatOpen(false)} // Close chat modal
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-semibold text-center text-[#5E9ED9] mb-4">
              Chat with {selectedPatient.student_first_name}{" "}
              {selectedPatient.student_last_name}
            </h3>
            <MessagingInterface
              userId={therapistId}
              userRole="therapist"
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSection;

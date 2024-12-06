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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 4;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!therapistId) return;
      try {
        const response = await axios.get(
          `/api/relationships/therapist/${therapistId}`
        );
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
      setPatEmail(response.data.email || null);
    } catch (error) {
      console.error("Error retrieving email:", error);
    }
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    getEmail(patient.student_id);
    setIsDetailsOpen(true);
  };

  const handleChat = (patient: any) => {
    setSelectedPatient(patient);
    setIsChatOpen(true);
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex w-full h-full p-6 space-x-4">
      <div className="flex flex-col w-full bg-blue-100 shadow-md rounded-lg mt-1 border-2 border-[#5E9ED9] p-6">
        <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
          My Patients
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="w-2/3 border border-[#5E9ED9] rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#5E9ED9]"
          />
        </div>

        <div className="space-y-4 mb-5">
          {currentPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {patient.student_first_name} {patient.student_last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Assigned since{" "}
                    {new Date(patient.updated_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4b8bc4] transition"
                    onClick={() => handleViewDetails(patient)}
                  >
                    <User className="w-5 h-5" />
                    View Details
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4b8bc4] transition"
                    onClick={() => handleChat(patient)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No patients found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center pt-8 space-x-4 border-t mt-4 border-[#5E9ED9]">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border w-30 h-15 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#5E9ED9] text-white hover:bg-[#4b8bc4]"
            } transition`}
          >
            Previous
          </button>
          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border w-20 h-15 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#5E9ED9] text-white hover:bg-[#4b8bc4]"
            } transition`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedPatient && isDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-8 max-w-xl w-full shadow-lg">
            <button
              onClick={() => {
                setIsDetailsOpen(false);
                setSelectedPatient(null);
                setPatEmail(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-semibold text-center text-[#5E9ED9] mb-4">
              {selectedPatient.student_first_name}{" "}
              {selectedPatient.student_last_name}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email: </strong> {patEmail || <span>Loading...</span>}
              </p>
              <p className="text-gray-700">
                <strong>Notes:</strong> Add notes here
              </p>
            </div>
            <div className="flex justify-around mt-6">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-full hover:bg-[#4b8bc4] transition"
                onClick={() => handleChat(selectedPatient)}
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-full hover:bg-[#4b8bc4] transition">
                <FileText className="w-5 h-5" />
                Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedPatient && isDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-8 max-w-xl w-full shadow-lg">
            <button
              onClick={() => {
                setIsDetailsOpen(false);
                setSelectedPatient(null);
                setPatEmail(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-semibold text-center text-[#5E9ED9] mb-4">
              {selectedPatient.student_first_name}{" "}
              {selectedPatient.student_last_name}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email: </strong> {patEmail || <span>Loading...</span>}
              </p>
              <p className="text-gray-700">
                <strong>Notes:</strong> Add notes here
              </p>
            </div>
            <div className="flex justify-around mt-6">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-full hover:bg-[#4b8bc4] transition"
                onClick={() => handleChat(selectedPatient)}
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-full hover:bg-[#4b8bc4] transition">
                <FileText className="w-5 h-5" />
                Notes
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
              onClick={() => setIsChatOpen(false)}
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

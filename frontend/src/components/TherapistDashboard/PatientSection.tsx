import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderTherapistDashboard from "../components/HeaderTherapistDashboard";
import Footer from "../components/Footer";
import PatientSection from "../components/TherapistDashboard/PatientSection";
import SchedulingForTherapists from "../components/TherapistDashboard/SchedulingForTherapists";
import { FaUserPlus, FaTasks, FaFileInvoice } from "react-icons/fa";
import Switch from "@mui/material/Switch";

const TherapistDashboard: React.FC = () => {
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined);
  const [therapistId, setTherapistId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const toggleAvailability = async () => {
    const fetchPatients = async () => {
      if (!therapistId) return;

      try {
        // Fetch relationships for the therapist
        const response = await axios.get(
          `/api/relationships/therapist/${therapistId}`
        );
        const relationships = response.data.relationships || [];
        setCurrPatients(relationships);

        // Fetch user details for each student
        const detailRequests = relationships.map((relation: any) =>
          axios.get(`/api/users/${relation.student_id}`)
        );

        const detailResponses = await Promise.all(detailRequests);
        const detailsMap = detailResponses.reduce((acc, res) => {
          acc[res.data.id] = res.data;
          return acc;
        }, {} as Record<number, any>);

        setPatientDetails(detailsMap);
      } catch (error) {
        console.error("Error fetching patients or details:", error);
      }
    };

    fetchPatients();
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

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsAnalyticsOpen(true); // Open the analytics modal
  };

  const handleChat = (patient: any) => {
    setSelectedPatient(patient);
    setIsChatOpen(true);
  };

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
      <div className="flex flex-col w-full bg-blue-100 shadow-md rounded-lg mt-1  p-6">
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

        <div className="space-y-4 mb-5 md:h-[370px] h-[380px] overflow-y-auto">
          {currentPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <ProfilePicture
                    userRole="student"
                    userId={patient.student_id}
                    className="w-12 h-12 rounded-full border border-gray-300"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {patient.student_first_name} {patient.student_last_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {patientDetails[patient.student_id]?.email || "Loading..."}
                    </p>
                    <p className="text-sm text-gray-600">
                      Assigned since{" "}
                      {new Date(patient.updated_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4b8bc4] transition"
                    onClick={() => handleViewDetails(patient)}
                  >
                    <FileText className="w-5 h-5" />
                    View Analytics
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

      {/* Analytics Modal */}
      {selectedPatient && isAnalyticsOpen && (
        <JournalAnalyticsModal
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          user={patientDetails[selectedPatient.student_id]} 
        />
      )}

      {/* Chat Modal */}
      {selectedPatient && isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <MessagingInterface
            userId={therapistId}
            userRole="therapist"
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PatientSection;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaX } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import socket from "../../socket";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "${API_BASE_URL}";

interface RequestListModalProps {
  therapistId: number;
  isOpen: boolean;
  refresh: boolean;
  onClose: () => void;
}

const RequestList: React.FC<RequestListModalProps> = ({
  therapistId,
  isOpen,
  refresh,
  onClose,
}) => {
  const { user, fetchUser } = useAuth();
  const [relations, setRelations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Fetch user data if not initialized
  useEffect(() => {
    const initializeUser = async () => {
      if (!user) {
        try {
          await fetchUser();
          console.log("User fetched successfully:", user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    initializeUser();
  }, [user, fetchUser]);

  // Join the therapist's socket room
  useEffect(() => {
    if (therapistId) {
      console.log(`Joining therapist room: therapist_${therapistId}`);
      socket.emit("joinTherapistRoom", therapistId);
    }
  }, [therapistId]);

  // Fetch requests for the therapist
  useEffect(() => {
    const fetchRequests = async () => {
      if (!therapistId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/relationships/therapist/${therapistId}`
        );
        console.log("Relationships Response:", response.data);
        setRelations(response.data.relationships || []);
      } catch (error) {
        console.error("Error retrieving relationships:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [therapistId, refresh]);

  // Listen for real-time updates
  useEffect(() => {
    const handleRelationshipRequest = (data: any) => {
      const { studentId, therapistId: emittedTherapistId, status } = data;

      if (therapistId === emittedTherapistId && status === "requested") {
        console.log(
          `New relationship request received for therapist_${therapistId}`
        );
        setRelations((prev) => [...prev, data]);
      }
    };

    socket.on("relationship-requested", handleRelationshipRequest);

    return () => {
      socket.off("relationship-requested", handleRelationshipRequest);
    };
  }, [therapistId]);

  // Handle action approval/rejection
  const handleAction = async (studentId: number, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await axios.put(
          `${API_BASE_URL}/api/relationships/${studentId}/approve-switch`
        );
        console.log(`Approved request for student ID ${studentId}`);
        socket.emit("therapist-action", {
          studentId,
          status: "approved",
        });
      } else if (action === "reject") {
        await axios.put(
          `${API_BASE_URL}/api/relationships/${studentId}/reject-switch`
        );
        console.log(`Rejected request for student ID ${studentId}`);
        socket.emit("therapist-action", {
          studentId,
          status: "rejected",
        });
      }

      // Update state to remove the processed request
      setRelations((prev) =>
        prev.filter((relation) => relation.student_id !== studentId)
      );
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  if (!isOpen) return null;

  // Filter relationships where status = "pending"
  const pendingRelations = relations.filter(
    (relation) => relation.status === "pending"
  );

  const totalPages = Math.ceil(pendingRelations.length / itemsPerPage);
  const paginatedRelations = pendingRelations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-[#5E9ED9] font-bold">List of Requests</h2>
          <button
            className="text-black px-2 rounded hover:text-gray-900"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className="h-[450px] overflow-y-auto">
          {therapistId ? (
            <>
              {isLoading ? (
                <p className="text-center text-gray-500">Loading requests...</p>
              ) : paginatedRelations.length > 0 ? (
                <div>
                  {paginatedRelations.map((relation) => (
                    <div
                      key={relation.id}
                      className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-4 shadow-sm"
                    >
                      <span className="text-lg font-medium text-gray-700">
                        {relation.student_first_name} {relation.student_last_name}
                      </span>

                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            handleAction(relation.student_id, "approve")
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center space-x-2"
                        >
                          <FaCheck className="inline" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() =>
                            handleAction(relation.student_id, "reject")
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2"
                        >
                          <FaX className="inline" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No pending patient requests found.
                </p>
              )}
            </>
          ) : (
            <h1 className="text-center text-gray-500">No ID yet</h1>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#5E9ED9] text-white hover:bg-[#538bc0]"
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className={`px-4 py-2 rounded ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#5E9ED9] text-white hover:bg-[#538bc0]"
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestList;

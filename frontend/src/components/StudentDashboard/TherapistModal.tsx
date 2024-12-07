import React, { useState, useEffect } from "react";
import { FaArrowRightArrowLeft, FaArrowRightToBracket } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import ProfilePicture from "../ProfilePicture";

interface TherapistModalProps {
  isOpen: boolean;
  refresh: boolean;
  sentAlert: () => void;
  onClose: () => void;
}

const TherapistModal: React.FC<TherapistModalProps> = ({
  isOpen,
  refresh,
  sentAlert,
  onClose,
}) => {
  const { user, fetchUser } = useAuth();
  const [therapists, setTherapists] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust the number of therapists per page

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

  useEffect(() => {
    if (isOpen && user) fetchTherapists();
  }, [isOpen, user, refresh]);

  const fetchTherapists = async () => {
    try {
      const response1 = await fetch("/api/therapists/available");
      if (!response1.ok) throw new Error("Failed to fetch therapists");
      const data1 = await response1.json();
      setTherapists(data1.therapists || []);

      const response2 = await fetch(`/api/relationships/${user.id}`);
      if (!response2.ok) setRelations([]);
      const data2 = await response2.json();
      setRelations(data2.relationship || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTherapists = therapists.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const requestStatus = (therapistId: number) => {
    if (
      relations.requested_therapist_id != null &&
      therapistId === relations.requested_therapist_id
    ) {
      return (
        <span className="text-blue-600 text-sm font-medium">
          Request Status: {relations.status}
        </span>
      );
    } else {
      return <></>;
    }
  };

  const requestTherapist = async (studentId: number, therapistId: number) => {
    try {
      const response = await axios.post("/api/relationships/request", {
        studentId: studentId,
        therapistId: therapistId,
      });
      console.log("Request successful:", response.data);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const switchTherapist = async (studentId: number, therapistId: number) => {
    try {
      const response = await axios.put(
        `/api/relationships/${studentId}/request-switch`,
        {
          requestedTherapistId: therapistId,
        }
      );
      console.log("Request successful:", response.data);
    } catch (error) {
      console.error("Error making PUT request:", error);
    }
  };

  const checkPending = () => relations.status === "pending";

  const sentConfirm = () => {
    sentAlert();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-[#5E9ED9] font-bold">Available Therapists</h2>
            <button
              className="text-black px-2 rounded hover:text-gray-900"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <div className="h-[520px] overflow-y-auto">
            {therapists.length === 0 ? (
              <p className="text-center text-gray-500">
                No therapists available at the moment.
              </p>
            ) : (
              <ul className="space-y-4">
                {currentTherapists.map((therapist) => (
                  <li
                    key={therapist.id}
                    className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <ProfilePicture
                        userRole="therapist"
                        therapistId={therapist.id}
                        className="rounded-full shadow-md"
                        style={{ width: "60px", height: "60px" }}
                      />
                      <div>
                        <p className="font-bold text-gray-800">{`${therapist.first_name} ${therapist.last_name}`}</p>
                        <p className="text-sm text-gray-500">{`Specialization: ${therapist.specialization}`}</p>
                        <p className="text-sm text-gray-500">{`Experience: ${therapist.experience_years} years`}</p>
                        <p className="text-sm text-gray-500">{`Rate: $${therapist.monthly_rate}/month`}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {requestStatus(therapist.id)}
                      {relations.current_therapist_id != null ? (
                        <button
                          disabled={checkPending()}
                          onClick={() => {
                            switchTherapist(user.id, therapist.id);
                            sentConfirm();
                            onClose();
                          }}
                          className="bg-[#5E9ED9] text-white py-2 px-4 rounded-lg shadow hover:bg-[#5996cf] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Switch Therapist
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            requestTherapist(user.id, therapist.id);
                            sentConfirm();
                            onClose();
                          }}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700"
                        >
                          Request Therapist
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg w-32 hover:bg-gray-400 disabled:bg-gray-100"
            >
              Previous
            </button>
            <span className="text-sm text-black">
              Page {currentPage} of {Math.ceil(therapists.length / itemsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(therapists.length / itemsPerPage)
                  )
                )
              }
              disabled={currentPage === Math.ceil(therapists.length / itemsPerPage)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg w-32 hover:bg-gray-400 disabled:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default TherapistModal;

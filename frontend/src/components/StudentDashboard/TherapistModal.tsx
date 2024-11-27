import React, { useState, useEffect } from "react";
import { FaArrowRightArrowLeft, FaArrowRightToBracket } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const TherapistModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, fetchUser } = useAuth();
  const [therapists, setTherapists] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const initializeUser = async () => {
      if (!user) {
        try {
          await fetchUser();
          console.log("User fetched successfully:", user); // Debugging after fetch
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    initializeUser();
  }, [user, fetchUser]);

  useEffect(() => {
    if (isOpen && user) fetchTherapists();
  }, [isOpen, user]);

  const fetchTherapists = async () => {
    try {
      const response1 = await fetch("/api/therapists/available");
      if (!response1.ok) throw new Error("Failed to fetch therapists");
      const data1 = await response1.json();
      setTherapists(data1.therapists || []);

      const response2 = await fetch(`api/relationships/${user.id}`);
      if (!response2.ok) throw new Error("Failed to Fetch relationships");
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
      return <h1>Request Status: {relations.status}</h1>;
    } else {
      return <div></div>;
    }
  };

  const requestTherapist = async (studentId: number, therapistId: number) => {
    try {
      const response = await axios.post("/api/relationships", {
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

  const checkPending = () => {
    if (relations.status === "pending") {
      return true;
    } else {
      return false;
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Available Therapists</h2>
          {therapists.length === 0 ? (
            <p className="text-center text-gray-500">
              No therapists available at the moment.
            </p>
          ) : (
            <ul className="space-y-4">
              {currentTherapists.map((therapist) => (
                <div className="flex flex-row items-center justify-between">
                  <li
                    key={therapist.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold">{`${therapist.first_name} ${therapist.last_name}`}</p>
                      <p className="text-sm text-gray-500">{`Specialization: ${therapist.specialization}`}</p>
                      <p className="text-sm text-gray-500">{`Experience: ${therapist.experience_years} years`}</p>
                      <p className="text-sm text-gray-500">{`Rate: $${therapist.monthly_rate}/month`}</p>
                    </div>
                  </li>
                  {relations.current_therapist_id != null ? (
                    <div className="w-80 flex flex-row items-center justify-between">
                      {requestStatus(therapist.id)}
                      <button
                        disabled={checkPending()}
                        onClick={() => {
                          switchTherapist(user.id, therapist.id);
                          onClose();
                        }}
                        className="mt-4 w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
                      >
                        <div className="flex justify-center items-center space-x-2 p-1">
                          <div className="font-bold">Switch Request</div>
                          <FaArrowRightArrowLeft className="mt-0.5" />
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="w-80 flex flex-row items-center justify-between">
                      {requestStatus(therapist.id)}
                      <button
                        onClick={() => {
                          requestTherapist(user.id, therapist.id);
                          onClose();
                        }}
                        className="mt-4 w-60 bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
                      >
                        <div className="flex justify-center items-center space-x-2 p-1">
                          <div className="font-bold">Request Therapist</div>
                          <FaArrowRightToBracket className="mt-0.5" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(therapists.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(therapists.length / itemsPerPage)
              }
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default TherapistModal;

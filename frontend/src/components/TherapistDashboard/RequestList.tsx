import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaX } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";

interface TherapistHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestList: React.FC<TherapistHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, fetchUser } = useAuth();
  const [therapistId, setTherapistId] = useState<{ id: number } | null>(null);
  const [relations, setRelations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure user is initialized
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

  // Fetch therapist ID when modal opens
  useEffect(() => {
    const fetchTherapistId = async () => {
      if (!isOpen || !user) return;
      try {
        const response = await axios.get(`/api/therapists/find/${user.id}`);
        console.log("Therapist ID Response:", response.data); // Debugging
        setTherapistId(response.data.therapist);
      } catch (error) {
        console.error("Error making GET request:", error);
      }
    };

    fetchTherapistId();
  }, [isOpen, user]);

  // Automatically fetch requests when therapistId changes
  useEffect(() => {
    const fetchRequests = async () => {
      if (!therapistId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/relationships/therapist/${therapistId.id}`
        );
        console.log("Relationships Response:", response.data); // Debugging
        setRelations(response.data.relationships || []);
      } catch (error) {
        console.error("Error retrieving relationships", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [therapistId]);

  const approveSwitch = async (studentId: number) => {
    try {
      const response = await axios.put(
        `/api/relationships/${studentId}/approve-switch`
      );
      console.log("PUT successful:", response.data);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const rejectSwitch = async (studentId: number) => {
    try {
      const response = await axios.delete(`/api/relationships/${studentId}`);
      console.log("DELETE successful:", response.data);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  if (!isOpen) return null;

  // Filter relationships where status = "switched"
  const pendingRelations = relations.filter(
    (relation) => relation.status === "pending"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 w-250 max-w-xl outline outline-white outline-2 outline-offset-2">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
        >
          &#x2715;
        </button>
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">
          List of Patient Requests
        </h2>
        {therapistId ? (
          <>
            <h1 className="text-center">Therapist ID: {therapistId.id}</h1>
            {isLoading ? (
              <p className="text-center text-gray-500">Loading requests...</p>
            ) : pendingRelations.length > 0 ? (
              <div className="flex flex-row items-center justify-between gap-4">
                <ul className="mt-4">
                  {pendingRelations.map((relation) => (
                    <div className="flex flex-row items-baseline justify-between gap-4">
                      <li
                        key={relation.id}
                        className="flex grow w-40 text-center text-gray-700"
                      >
                        <strong>
                          {relation.student_first_name}{" "}
                          {relation.student_last_name}
                        </strong>
                      </li>
                      <button
                        onClick={() => {
                          approveSwitch(relation.student_id);
                          onClose();
                        }}
                        className="mt-4 w-40 bg-green-500 text-white py-2 rounded hover:bg-green-500"
                      >
                        <div className="flex justify-center items-center space-x-2 p-1">
                          <div className="font-bold">Accept</div>
                          <FaCheck className="mt-0.5" />
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          rejectSwitch(relation.student_id);
                          onClose();
                        }}
                        className="mt-4 w-40 bg-red-500 text-white py-2 rounded hover:bg-red-500"
                      >
                        <div className="flex justify-center items-center space-x-2 p-1">
                          <div className="font-bold">Reject</div>
                          <FaX className="mt-0.5" />
                        </div>
                      </button>
                    </div>
                  ))}
                </ul>
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
        <div className="flex justify-center">
          <button
            className="mt-6 bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestList;

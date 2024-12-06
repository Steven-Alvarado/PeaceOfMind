import React, { useState, useEffect } from "react";
import { FaX } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

interface DropModalProps {
  isOpen: boolean;
  sentDrop: () => void;
  onClose: () => void;
}

const DropModal: React.FC<DropModalProps> = ({ isOpen, sentDrop, onClose }) => {
  const { user, fetchUser } = useAuth();

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

  const rejectSwitch = async (studentId: number) => {
    try {
      const response = await axios.delete(`/api/relationships/${studentId}`);
      console.log("DELETE successful:", response.data);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const confirmDrop = () => {
    sentDrop();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Drop Assigned Therapist?</h2>
          {user ? (
            <div className="flex flex-col items-center">
              <h1>THIS ACTION CANNOT BE UNDONE</h1>
              <button
                onClick={() => {
                  rejectSwitch(user.id);
                  confirmDrop();
                  onClose();
                }}
                className="mt-4 w-40 bg-red-500 text-white py-2 rounded hover:bg-red-500"
              >
                <div className="flex justify-center items-center space-x-2 p-1">
                  <div className="font-bold">Drop Therapist</div>
                  <FaX className="mt-0.5" />
                </div>
              </button>
            </div>
          ) : (
            <span>Loading info...</span>
          )}
          <button
            onClick={() => {
              onClose();
            }}
            className="mt-20 w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default DropModal;

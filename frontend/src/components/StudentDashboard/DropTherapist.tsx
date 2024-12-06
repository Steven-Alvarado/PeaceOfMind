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
        <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#5E9ED9] font-bold">Drop Assigned Therapist</h2>
            <button
              className="text-black px-2 rounded hover:text-gray-900"
              onClick={onClose}
            >
              X
            </button>
          </div>
          {user ? ( 
            <div className="flex flex-col justify-center">
              <h1 className="text-center font-extrabold">This action can not be undone!</h1>
              <div className="flex mt-3 justify-center">
                <button
                  onClick={() => {
                    rejectSwitch(user.id);
                    confirmDrop();
                    onClose();
                  }}
                  className=" w-40 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Drop Therapist
              </button>
              </div>
            </div>
          ) : (
            <span>Loading info...</span>
          )}
        </div>
      </div>
    )
  );
};

export default DropModal;

import React from "react";
import { FaUserPlus, FaTasks, FaFileInvoice } from "react-icons/fa";


interface TherapistHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TherapistHelpModal: React.FC<TherapistHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-[#5E9ED9] font-bold">Help</h2>
          <button
            className="text-black px-2 rounded hover:text-gray-900"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <ul className="text-black space-y-5">
          <li>
            <FaUserPlus className="inline mr-2 mb-1" /> <strong>View New Patient Requests:</strong> <br></br> Access and accept or decline requests from possible new patients.
          </li>
          <li>
            <FaTasks className="inline mr-2 mb-1" />{" "}
            <strong>Manage Scheduling:</strong> <br></br> Manage your calendar and view upcoming sessions with patients.
          </li>
          <li>
            <FaFileInvoice className="inline mr-2 mb-1" />{" "}
            <strong>Invoices:</strong><br></br> Used to view your current sent out invoices, the payment status, and handling the creation of new invoices for current patients.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TherapistHelpModal;

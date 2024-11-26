import React from "react";
import { FaUser, FaCalendarAlt, FaComments, FaFileInvoice } from "react-icons/fa";

interface TherapistHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TherapistHelpModal: React.FC<TherapistHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md outline outline-white outline-2 outline-offset-2">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
        >
          &#x2715;
        </button>
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">
          Help
        </h2>
        <ul className="text-gray-700 space-y-3">
          <li>
            <FaUser className="inline mr-2" /> <strong>Manage Patients:</strong> Access and update
            patient records, chats, and notes.
          </li>
          <li>
            <FaCalendarAlt className="inline mr-2" />{" "}
            <strong>View Appointments:</strong> Manage your calendar and upcoming sessions.
          </li>
          <li>
            <FaComments className="inline mr-2" />{" "}
            <strong>New Patient Requests:</strong> Review and accept new patient inquiries.
          </li>
          <li>
            <FaFileInvoice className="inline mr-2" /> <strong>Invoices:</strong> View and manage
            billing for your services.
          </li>
        </ul>
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

export default TherapistHelpModal;

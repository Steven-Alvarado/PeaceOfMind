import { FaBook, FaClipboardList, FaFileInvoice} from "react-icons/fa";
import { FaClipboardQuestion } from "react-icons/fa6"
const StudentHelpModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg outline outline-white outline-2 outline-offset-2">
          <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">Help</h2>
          <ul className="text-gray-700 space-y-3">
            <li>
              <FaBook className="inline mr-2" /> <strong>Journal:</strong> Reflect on your thoughts and emotions.
            </li>
            <li>
              <FaClipboardList className="inline mr-2" /> <strong>View Therapists:</strong> Look for a new therapist.
            </li>
            <li>
              <FaFileInvoice className="inline mr-2" /> <strong>Invoices:</strong> View and manage your payment details.
            </li>
            <li>
              <FaClipboardQuestion className="inline mr-2" /> <strong>Surveys:</strong> Answer weekly survey.
            </li>
            <li>
              <FaFileInvoice className="inline mr-2" /> <strong>Invoices:</strong> View and manage your payment details.
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

  export default StudentHelpModal;
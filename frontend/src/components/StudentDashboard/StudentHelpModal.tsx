import { FaBook, FaChartPie, FaFileInvoiceDollar} from "react-icons/fa";
import { FaClipboardQuestion } from "react-icons/fa6"
const StudentHelpModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#5E9ED9] font-bold">Help</h2>
            <button
              className="text-black px-2 rounded hover:text-gray-900"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <ul className="text-black space-y-4">
            <li>
              <FaBook className="inline mr-2" /> <strong>Journal:</strong> <br></br> Option to take the time and write journal entries on how you are feeling, with a way to select a mood, which is used to view overtime progress in analytics.
            </li>
            <li>
              <FaChartPie className="inline mr-2" /> <strong>Analytics:</strong> <br></br> Acces to see journal moods and surevy results overtime.
            </li>
            <li>
              <FaClipboardQuestion className="inline mr-2" /> <strong>Surveys:</strong> <br></br> Answer weekly surveys, and view previous survey results.
            </li>
            <li>
              <FaFileInvoiceDollar className="inline mr-2" /> <strong>Invoices:</strong> <br></br>View sent invoices from your therapist, the payment status, and pay invoices through here.
            </li>
          </ul>
        </div>
      </div>
    );
  };

  export default StudentHelpModal;
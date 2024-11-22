import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

import HeaderStudentDashboard from "../components/headerStudentDashboard";
import Footer from "../components/Footer";
import {
  FaUser,
  FaBriefcase,
  FaChevronDown,
  FaMapMarkerAlt,
  FaCalendar,
  FaComments,
  FaBook,
  FaChartBar,
  FaFileInvoice,
  FaQuestionCircle,
  FaClipboardList,
} from "react-icons/fa";
import { FaClipboardQuestion } from "react-icons/fa6";

import Lottie from "lottie-react";
import StudentDashboardAnimation from "../assets/lotties/StudentDashboardAnimation.json";

interface JournalEntry {
  id: number;
  date: string;
  content: string;
  mood: string;
}

const JournalingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user } = useAuth(); // Use `user` instead of `currentUser`
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch journals when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchJournals();
    }
  }, [isOpen, user?.id]);

  const fetchJournals = async () => {
    try {
      const response = await axios.get(`/api/journal/user/${user.id}`);
      setEntries(response.data.journals);
      setActiveEntry(response.data.journals[response.data.journals.length - 1] || {});
    } catch (error) {
      console.error("Error fetching journals:", error);
      setErrorMessage("Failed to fetch journal entries.");
    }
  };
  

  const handleSave = async () => {
    if (!activeEntry.content.trim()) {
      setErrorMessage("Entry cannot be blank.");
      return;
    }
    try {
      if (newEntry) {
        const response = await axios.post(`/api/journal/`, {
          userId: user.id,
          mood: activeEntry.mood || "Neutral",
          content: activeEntry.content,
        });
        setEntries([...entries, response.data.journal]);
        setNewEntry(false);
      } else {
        const response = await axios.put(`/api/journal/${activeEntry.id}`, {
          mood: activeEntry.mood || "Neutral",
          content: activeEntry.content,
        });
        setEntries(entries.map((entry) =>
          entry.id === activeEntry.id ? response.data.journal : entry
        ));
      }
      setSuccessMessage("Entry saved successfully.");
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setErrorMessage("Failed to save journal entry.");
    }
  };
  

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`/api/journal/${activeEntry?.id}`);
        setEntries(entries.filter((entry) => entry.id !== activeEntry?.id));
        setActiveEntry(entries[0] || null);
        setSuccessMessage("Entry deleted successfully.");
      } catch (error) {
        console.error("Error deleting journal entry:", error);
        setErrorMessage("Failed to delete journal entry.");
      }
    }
  };

  const handleNewEntry = () => {
    setNewEntry(true);
    setActiveEntry({ id: 0, date: new Date().toISOString().split("T")[0], content: "", mood: "" });
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl">
          <div className="flex">
            {/* Left Panel: Entry List */}
            <div className="w-1/3 bg-blue-100 p-4 rounded-l-lg">
              <h2 className="text-lg font-bold text-blue-600 mb-4">Previous Entries</h2>
              <ul className="space-y-2">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className={`p-2 rounded cursor-pointer ${
                      activeEntry?.id === entry.id ? "bg-blue-300" : "hover:bg-blue-200"
                    }`}
                    onClick={() => setActiveEntry(entry)}
                  >
                    Journal Entry {entry.id}: {entry.date}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
                onClick={handleNewEntry}
              >
                New Entry
              </button>
            </div>

            {/* Right Panel: Entry Editor */}
            <div className="w-2/3 p-4">
              <h2 className="text-lg font-bold text-blue-600 mb-2">
                {newEntry ? "New Journal Entry" : `Journal Entry ${activeEntry?.id}`}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{activeEntry?.date}</p>
              <textarea
                className="w-full h-64 border border-gray-300 rounded p-2"
                value={activeEntry?.content || ""}
                onChange={(e) =>
                  setActiveEntry({ ...activeEntry, content: e.target.value } as JournalEntry)
                }
              />
              <div className="flex justify-between items-center mt-4">
                <div>
                  {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                  {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </div>
                <div className="space-x-4">
                  {!newEntry && activeEntry && (
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                      onClick={handleDelete}
                    >
                      Delete Entry
                    </button>
                  )}
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    onClick={handleSave}
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
    )
  );
};

//Journaling Component
// const JournalingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   const [entries, setEntries] = useState([
//     { id: 1, date: "2024-11-01", content: "My first journal entry." },
//     { id: 2, date: "2024-11-02", content: "Today's reflection was insightful." },
//   ]);
//   const [activeEntry, setActiveEntry] = useState(entries[entries.length - 1]); // Default to last entry
//   const [newEntry, setNewEntry] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSave = () => {
//     if (!activeEntry.content.trim()) {
//       setErrorMessage("Entry cannot be blank.");
//       return;
//     }
//     setErrorMessage("");
//     setSuccessMessage("Entry saved successfully.");
//     // Mock save: Update state
//     if (newEntry) {
//       setEntries([...entries, activeEntry]);
//       setNewEntry(false);
//     } else {
//       setEntries(entries.map((entry) => (entry.id === activeEntry.id ? activeEntry : entry)));
//     }
//   };

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this entry?")) {
//       setEntries(entries.filter((entry) => entry.id !== activeEntry.id));
//       setActiveEntry(entries[0] || { id: 0, date: "", content: "" }); // Default to first entry
//       setSuccessMessage("Entry deleted successfully.");
//     }
//   };

//   const handleNewEntry = () => {
//     setNewEntry(true);
//     setActiveEntry({ id: Date.now(), date: new Date().toISOString().split("T")[0], content: "" });
//     setErrorMessage("");
//     setSuccessMessage("");
//   };

//   return (
//     isOpen && (
//       <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//         <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl">
//           <div className="flex">
//             {/* Left Panel: Entry List */}
//             <div className="w-1/3 bg-blue-100 p-4 rounded-l-lg">
//             <div className='flex space-x-5 mb-2'>
//                 <button
//                     className=" text-black bg-red-400 rounded-md px-2 hover:bg-red-500"
//                     onClick={onClose}
//                   >
//                     X
//                 </button>
//                 <h2 className="text-lg font-bold text-[#5E9ED9] ">Previous Entries</h2>
//               </div>
//               <ul className="space-y-2">
//                 {entries.map((entry) => (
//                   <li
//                     key={entry.id}
//                     className={`p-2 rounded cursor-pointer ${
//                       activeEntry.id === entry.id ? "bg-blue-300" : "hover:bg-blue-200"
//                     }`}
//                     onClick={() => {
//                       setActiveEntry(entry);
//                       setNewEntry(false);
//                       setErrorMessage("");
//                       setSuccessMessage("");
//                     }}
//                   >
//                     Journal Entry {entry.id}: {entry.date}
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 className="mt-4 w-full bg-[#5E9ED9] text-white py-2 rounded hover:bg-[#4d80b0]"
//                 onClick={handleNewEntry}
//               >
//                 New Entry
//               </button>
//             </div>

//             {/* Right Panel: Entry Editor */}
//             <div className="w-2/3 p-4">
//               <h2 className="text-lg font-bold text-[#5E9ED9] mb-2">
//                 {newEntry ? "New Journal Entry" : `Journal Entry ${activeEntry.id}`}
//               </h2>
//               <p className="text-sm text-gray-500 mb-4">{activeEntry.date}</p>
//               <textarea
//                 className="w-full h-64 border border-gray-300 rounded p-2"
//                 value={activeEntry.content}
//                 onChange={(e) =>
//                   setActiveEntry({ ...activeEntry, content: e.target.value })
//                 }
//               />
//               <div className="flex justify-between items-center mt-4">
//                 <div>
//                   {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
//                   {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
//                 </div>
//                 <div className="space-x-4">
//                   {!newEntry && (
//                     <button
//                       className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
//                       onClick={handleDelete}
//                     >
//                       Delete Entry
//                     </button>
//                   )}
//                   <button
//                     className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4d80b0]"
//                     onClick={handleSave}
//                   >
//                     Save Entry
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// Help Modal Component
const HelpModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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

// Therapist Section Component
const TherapistSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="flex justify-center bg-blue-100 rounded-lg border border-[#5E9ED9] shadow-lg mb-12">
        <Lottie
          animationData={StudentDashboardAnimation}
          loop={true}
          style={{ width: "45%", height: "45%" }}
        />
      </div>

      <div className="bg-blue-100 rounded-lg shadow-lg p-6 border border-[#5E9ED9]">
        <h2 className="text-2xl text-center font-bold text-[#5E9ED9] mb-10">Your Therapist</h2>

        <p className="text-xl text-center font-medium text-gray-800 mb-10">[Therapist's Name]</p>

        <div className="mb-14">
          <button
            className="w-full bg-[#5E9ED9] text-white px-4 py-2 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            View Details
            <FaChevronDown
              className={`ml-2 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {isExpanded && (
            <div className="mt-4 flex space-x-5 justify-center text-gray-700">
              <p>
                <FaUser className="inline mr-2 text-[#5E9ED9]" /> 
                <span className="font-medium">Years of Experience:</span> 10
              </p>
              <p>
                <FaBriefcase className="inline mr-2 text-[#5E9ED9]" /> 
                <span className="font-medium">Specialty:</span> Anxiety & Depression
              </p>
              <p>
                <FaMapMarkerAlt className="inline mr-2 text-[#5E9ED9]" /> 
                <span className="font-medium">Location:</span> California
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center space-x-4 mb-5">
          <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9] transition">
            <FaCalendar className="inline mr-2" /> Schedule Appointment
          </button>
          <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9] transition">
            <FaComments className="inline mr-2" /> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

// Menu Section Component
const MenuSection = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isJournalOpen, setIsJornalOpen] = useState(false);

  return (
    <div className="bg-blue-100 border border-[#5E9ED9] rounded-lg p-6 shadow-lg">
      <div className="items-center justify-between mb-6">
        <h2 className="text-4xl text-center font-bold text-[#5E9ED9] mt-5">Menu</h2>
        <div className="flex justify-center md:mt-7 md:mb-20">
          <button
            className="bg-[#5E9ED9] text-white px-4 py-1 rounded-2xl hover:bg-[#4a8ac9] text-sm"
            onClick={() => setIsHelpOpen(true)}
          >
            <div className="flex justify-center space-x-2 p-1">
              <div className="font-bold">
                Help
              </div> 
              <FaQuestionCircle className="mt-0.5"/>
            </div>
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <button 
          className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
          onClick={() => setIsJornalOpen(true)}
        >
          <FaBook className="mr-3" /> Journal
        </button>
        <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
          <FaClipboardList className="mr-3" /> View Therapists
        </button>
        <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
          <FaChartBar className="mr-3" /> Analytics
        </button>
        <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
          <FaClipboardQuestion className="mr-3" /> Surveys
        </button>
        <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
          <FaFileInvoice className="mr-3" /> Invoices
        </button>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <JournalingModal isOpen={isJournalOpen} onClose={() => setIsJornalOpen(false)} />
    </div>
  );
};

// Main Dashboard Component
const StudentDashboard = () => {
  const { user } = useAuth(); // Get user from AuthContext

  return (
    <div className="student-dashboard flex flex-col min-h-screen">
      <HeaderStudentDashboard />
      <header>
        <h1 className="text-4xl font-bold text-center text-blue-500">
        Welcome, {user?.id ? user.email : "Loading..."}
        </h1>
      </header>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
        <TherapistSection />
        <MenuSection />
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;

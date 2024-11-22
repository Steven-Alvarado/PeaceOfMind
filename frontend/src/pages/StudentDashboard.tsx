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
  mood: string;
  content: string;
  date: string;
}

const JournalingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  const totalPages = Math.ceil(entries.length / entriesPerPage);


  // Fetch journals when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchJournals();
    }
  }, [isOpen, user?.id]);

  const fetchJournals = async () => {
    try {
      const response = await axios.get(`/api/journals/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
  
      // Extract the 'journals' array from the response
      const fetchedJournals = response.data.journals.map((journal: any) => ({
        id: journal.id,
        mood: journal.mood,
        content: journal.document_content.entry, // Adjust based on your data structure
        date: journal.created_at,
      }));
  
      if (fetchedJournals.length === 0) {
        setErrorMessage("No journal entries found. Create your first entry!");
      }
  
      setEntries(fetchedJournals);
      setActiveEntry(fetchedJournals[fetchedJournals.length - 1] || null);
    } catch (error) {
      console.error("Error fetching journals:", error);
      setErrorMessage("Failed to fetch journal entries.");
    }
  };

  const handleSave = async () => {
    if (!activeEntry?.content.trim()) {
      setErrorMessage("Entry cannot be blank.");
      return;
    }
  
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      if (newEntry) {
        // POST: Create a new journal entry
        const response = await axios.post(
          `/api/journals/`,
          {
            userId: user?.id,
            mood: activeEntry.mood || "Neutral",
            content: { entry: activeEntry.content },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
  
        // Update state with the new journal entry
        const newJournal = {
          id: response.data.journal.id,
          mood: response.data.journal.mood,
          content: response.data.journal.document_content.entry || "",
          date: response.data.journal.created_at,
        };
  
        setEntries((prevEntries) => [...prevEntries, newJournal]);
        setActiveEntry(newJournal);
        setNewEntry(false);
        setSuccessMessage("New entry saved successfully.");
      } else {
        // PUT: Update an existing journal entry
        const response = await axios.put(
          `/api/journals/${activeEntry.id}`,
          {
            mood: activeEntry.mood,
            content: { entry: activeEntry.content },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
  
        // Update the entry in the state
        const updatedJournal = {
          id: response.data.journal.id,
          mood: response.data.journal.mood,
          content: activeEntry.content,
          date: response.data.journal.updated_at,
        };
  
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === updatedJournal.id ? updatedJournal : entry
          )
        );
        setActiveEntry(updatedJournal);
        setSuccessMessage("Entry updated successfully.");
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setErrorMessage("Failed to save journal entry.");
    }
  };

  const handleNewEntry = async () => {
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      // POST: Create a new journal entry
      const response = await axios.post(
        `/api/journals/`,
        {
          userId: user?.id, // Send the user ID
          mood: "Neutral", // Default mood
          content: { entry: "This is a new journal entry." }, // Initial content
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
  
      // Extract the new journal entry from the response
      const newJournal = {
        id: response.data.journal.id,
        mood: response.data.journal.mood,
        content: response.data.journal.document_content.entry || "",
        date: response.data.journal.created_at,
      };
  
      // Update state to include the new journal entry
      setEntries((prevEntries) => [...prevEntries, newJournal]);
      setActiveEntry(newJournal); // Set the active entry to the new journal
      setNewEntry(false); // Exit "new entry" mode
      setSuccessMessage("New entry created successfully.");
    } catch (error: any) {
      console.error("Error creating new journal entry:", error.response || error.message);
  
      // Log error details for debugging
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
  
      // Handle any error by updating the error message
      setErrorMessage("Failed to create a new journal entry.");
    }
  };

  const getCurrentPageEntries = () => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return entries.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl">
          {/* Left Panel: Entry List */}
          <div className="flex">
            <div className="w-1/3 bg-blue-100 p-4 rounded-l-lg">
              <div className='flex space-x-5 mb-2'>
                <button
                    className=" text-black bg-red-400 rounded-md px-2 hover:bg-red-500"
                    onClick={onClose}
                  >
                    X
                </button>
                <h2 className="text-lg font-bold text-[#5E9ED9] ">Previous Entries</h2>
              </div>
              {entries.length === 0 ? (
                <p className="text-center text-gray-500">No journal entries available. Start a new one!</p>
              ) : (
                <ul className="space-y-2">
                  {getCurrentPageEntries().map((entry) => (
                    <li
                      key={entry.id}
                      className={`p-2 rounded cursor-pointer ${
                        activeEntry?.id === entry.id
                          ? "bg-blue-300"
                          : "hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setActiveEntry(entry);
                        setNewEntry(false);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                    >
                      Journal Entry {entry.id}: {entry.date}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
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

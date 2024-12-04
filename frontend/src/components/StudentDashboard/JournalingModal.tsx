import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

interface JournalEntry {
  id: number;
  mood: string;
  content: string;
  date: string;
  entryNumber: number;
}

interface JournalingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JournalingModal: React.FC<JournalingModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 9;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("date");
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>(entries);  

  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchJournals();
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries);
      return;
    }
  
    const query = searchQuery.toLowerCase();
  
    const filtered = entries.filter((entry) => {
      if (filterBy === "date") {
        const entryDate = new Date(entry.date).toLocaleDateString().toLowerCase();
        return entryDate.includes(query);
      }
      if (filterBy === "entry") {
        return entry.entryNumber.toString().includes(query);
      }
      return false;
    });
  
    setFilteredEntries(filtered);
  }, [searchQuery, filterBy, entries]);

  const fetchJournals = async () => {
    if (!user?.id) {
      setErrorMessage("User ID is not available.");
      return;
    }
  
    try {
      const response = await axios.get(`/api/journals/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const fetchedJournals = response.data.journals
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((journal: any, index: number, arr: any[]) => ({
          id: journal.id,
          mood: journal.mood,
          content: journal.document_content?.entry || "",
          date: journal.created_at,
          entryNumber: arr.length - index,
        }));
  
      if (fetchedJournals.length === 0) {
        setErrorMessage("No journal entries found. Create your first entry!");
      } else {
        setErrorMessage("");
      }
  
      setEntries(fetchedJournals);
      setActiveEntry(fetchedJournals[0] || null);
    } catch (error: any) {
      console.error("Error fetching journals:", error.message);
      setErrorMessage(error.response?.data?.error || "Failed to fetch journal entries.");
    }
  };

  const handleSave = async () => {
    if (!activeEntry?.content.trim()) {
      setErrorMessage("Entry content cannot be blank.");
      return;
    }
  
    try {
      if (newEntry) {
        console.log("Saving a new entry:", activeEntry);
        await createJournalEntry();
      } else {
        console.log("Updating an existing entry:", activeEntry);
        await updateJournalEntry();
      }
    } catch (error: any) {
      console.error("Error saving journal entry:", error.message);
      setErrorMessage(error.response?.data?.error || "Failed to save journal entry.");
    }
  };

  const createJournalEntry = async () => {
    try {
      const response = await axios.post(
        `/api/journals`,
        {
          userId: user?.id,
          mood: activeEntry?.mood || "Neutral",
          content: { entry: activeEntry?.content || "" },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
  
      const newJournal = {
        id: response.data.journal.id,
        mood: response.data.journal.mood,
        content: activeEntry?.content || "",
        date: response.data.journal.created_at,
        entryNumber: entries.length > 0 ? entries[0].entryNumber + 1 : 1,
      };
  
      setEntries([newJournal, ...entries]);
      setActiveEntry(newJournal);
      setNewEntry(false);
      setSuccessMessage("New entry created successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating journal entry:", error);
      setErrorMessage("Failed to create a new journal entry.");
    }
  };
  
  const handleDelete = () => {
    if (!activeEntry) {
      setErrorMessage("No journal entry selected to delete.");
      return;
    }
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!activeEntry) return;
  
    try {
      await axios.delete(`/api/journals/delete/${activeEntry.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
  
      const updatedEntries = entries
        .filter((entry) => entry.id !== activeEntry.id)
        .map((entry, index, arr) => ({
          ...entry,
          entryNumber: arr.length - index,
        }));
  
      setEntries(updatedEntries);
  
      if (updatedEntries.length > 0) {
        setActiveEntry(updatedEntries[0]);
      } else {
        setActiveEntry(null);
      }
  
      setSuccessMessage("Journal entry deleted successfully.");
      setErrorMessage("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting journal entry:", error.message);
      } else {
        console.error("Error deleting journal entry:", error);
      }
      setErrorMessage("Failed to delete journal entry.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const updateJournalEntry = async () => {
    try {
      const response = await axios.put(
        `/api/journals/${activeEntry?.id}`,
        {
          mood: activeEntry?.mood,
          content: { entry: activeEntry?.content },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
  
      const updatedJournal = {
        id: response.data.journal.id,
        mood: response.data.journal.mood,
        content: activeEntry?.content || "",
        date: response.data.journal.updated_at,
        entryNumber: activeEntry?.entryNumber || 0,
      };
  
      setEntries((prev) =>
        prev.map((entry) => (entry.id === updatedJournal.id ? updatedJournal : entry))
      );
      setActiveEntry(updatedJournal);
      setSuccessMessage("Entry updated successfully.");
      setErrorMessage("");
    } catch (error: any) {
      console.error("Error updating journal entry:", error.message);
      setErrorMessage(error.response?.data?.error || "Failed to update journal entry.");
    }
  };

  const handleNewEntry = () => {
    const newEntryData = {
      id: 0,
      mood: "Neutral",
      content: "",
      date: new Date().toISOString(),
      entryNumber: entries.length > 0 ? entries[0].entryNumber + 1 : 1,
    };
    setActiveEntry(newEntryData);
    setNewEntry(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    console.log("New entry initialized:", newEntryData);
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
        <div className="bg-white rounded-lg shadow-lg w-4/5 h-4/5 max-w-6xl max-h-[90vh]">
          <div className="flex h-full">
            <div className="w-1/4 bg-blue-100 p-4 rounded-l-lg flex flex-col">
              <h2 className="text-lg font-bold mt-2 text-[#5E9ED9]">Journal Entries</h2>
              <div className="mb-4 mt-2 flex space-x-1">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="p-2 border border-[#5E9ED9] rounded"
                >
                  <option value="date">Date</option>
                  <option value="entry">Entry</option>
                </select>
                <input
                  type="text"
                  placeholder={`${filterBy === "date" ? "Date (MM/DD/YYYY)" : "Entry number"}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=" w-44 p-2 border border-[#5E9ED9] rounded"
                />
              </div>
              {entries.length === 0 ? (
                <p className="text-center text-sm text-gray-500 flex-grow">
                  Click on <button disabled className="bg-[#5E9ED9] p-2 text-white rounded-lg text-sm">+ New Entry</button> to add a new journal entry.</p>
              ) : (
                <ul className="flex-grow overflow-y-auto space-y-2">
                  {filteredEntries
                    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
                    .map((entry) => (
                      <li
                        key={entry.id}
                        className={`p-2 rounded cursor-pointer text-black border shadow-lg border-[#5E9ED9]
                        ${activeEntry?.id === entry.id ? "bg-[#5E9ED9]" : "hover:bg-[#90bce5]"}`}
                        onClick={() => {
                          setActiveEntry(entry);
                          setNewEntry(false);
                        }}
                      >
                        <div>
                          <div className="flex justify-between">
                            <p>
                              <strong>Journal Entry {entry.entryNumber}</strong>
                            </p>
                            <p>{new Date(entry.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex justify-between">
                            <p>
                              <strong>{entry.mood}</strong>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
              <div className="flex mb-2 mt-2 flex-col space-y-2">
                <div className="flex justify-between space-x-2">
                  <button
                    className="px-4 py-2 bg-white shadow-lg rounded hover:bg-gray-100"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    ←
                  </button>
                  <button
                    className=" px-4 py-2 shadow-lg bg-[#5E9ED9] text-white rounded hover:bg-[#4a7caa]"
                    onClick={handleNewEntry}
                  >
                    + New Entry
                  </button>
                  <button
                    className="px-4 py-2 bg-white shadow-lg rounded hover:bg-gray-100"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </button>
              
                </div>
              </div>
            </div>
  
            <div className="w-3/4 p-6 flex flex-col">
              <div className={`flex justify-between items-center mb-4`}>
                <h2 className="text-lg font-bold text-[#5E9ED9]">
                  {activeEntry
                    ? `Journal Entry ${activeEntry.entryNumber}`
                    : "No Journal Entries Available."}
                </h2>
                <button
                  className="text-black px-2 rounded hover:text-gray-900"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
              {activeEntry && (
                <div className=" mb-4">
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(activeEntry.date).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-7 bg-[#5E9ED9] rounded-lg p-2 w-80 shadow-lg">
                    <p className="text-white">How are you feeling today? </p>
                    <select
                      value={activeEntry.mood}
                      onChange={(e) =>
                        setActiveEntry((prev) => ({ ...prev!, mood: e.target.value }))
                      }
                      className=" border border-blue-100 bg-[#5E9ED9] text-white rounded"
                    >
                      <option value="Happy">Happy</option>
                      <option value="Anxious">Anxious</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Angry">Angry</option>
                      <option value="Sad">Sad</option>
                    </select>
                  </div>
                </div>
              )}
              <textarea
                className="flex-grow shadow-lg border-[#5E9ED9] border-2 rounded p-2"
                value={activeEntry?.content || ""}
                onChange={(e) =>
                  setActiveEntry((prev) => ({ ...prev!, content: e.target.value }))
                }
              />
              <div className="flex justify-between items-center mt-4">
                <div>
                  {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                  {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </div>
                <div className="space-x-4">
                  {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white rounded-lg shadow-lg text-center p-6 w-2/12">
                        <h2 className="text-lg font-extrabold text-red-500">Confirm Deletion</h2>
                        <p className=" my-4">
                          Are you sure you want to delete this journal entry?
                        </p>
                        <p className="text-black font-extrabold my-4 mb-5">
                          This action cannot be undone.
                        </p>
                        <div className="flex justify-center space-x-4">
                          <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            onClick={cancelDelete}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={confirmDelete}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    className="bg-red-500 shadow-lg text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-[#5E9ED9] shadow-lg text-white px-4 py-2 rounded hover:bg-[#4879a7]"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default JournalingModal;
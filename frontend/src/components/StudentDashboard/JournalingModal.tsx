import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

interface JournalEntry {
  id: number;
  mood: string;
  content: string;
  date: string;
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
  const entriesPerPage = 4;

  const totalPages = Math.ceil(entries.length / entriesPerPage);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchJournals();
    }
  }, [isOpen, user?.id]);

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

      const fetchedJournals = response.data.journals.map((journal: any) => ({
        id: journal.id,
        mood: journal.mood,
        content: journal.document_content?.entry || "",
        date: journal.created_at,
      }));

      if (fetchedJournals.length === 0) {
        setErrorMessage("No journal entries found. Create your first entry!");
      } else {
        setErrorMessage("");
      }

      setEntries(fetchedJournals);
      setActiveEntry(fetchedJournals[fetchedJournals.length - 1] || null);
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
        await createJournalEntry();
      } else {
        await updateJournalEntry();
      }
    } catch (error: any) {
      console.error("Error saving journal entry:", error.message);
      setErrorMessage(error.response?.data?.error || "Failed to save journal entry.");
    }
  };

  const createJournalEntry = async () => {
    const response = await axios.post(
      `/api/journals/`,
      {
        userId: user?.id,
        mood: activeEntry?.mood || "Neutral",
        content: { entry: activeEntry?.content },
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
      content: response.data.journal.document_content?.entry || "",
      date: response.data.journal.created_at,
    };

    setEntries((prev) => [...prev, newJournal]);
    setActiveEntry(newJournal);
    setNewEntry(false);
    setSuccessMessage("New entry created successfully.");
    setErrorMessage("");
  };

  const updateJournalEntry = async () => {
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
    };

    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedJournal.id ? updatedJournal : entry))
    );
    setActiveEntry(updatedJournal);
    setSuccessMessage("Entry updated successfully.");
    setErrorMessage("");
  };

  const getCurrentPageEntries = () => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return entries.slice(startIndex, endIndex);
  };

  const handleNewEntry = () => {
    setActiveEntry({ id: 0, mood: "Neutral", content: "", date: new Date().toISOString() });
    setNewEntry(true);
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
          <div className="flex">
            {/* Left Panel: Entry List */}
            <div className="w-1/3 bg-blue-100 p-4 rounded-l-lg">
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-bold text-blue-600">Journal Entries</h2>
                <button
                  className="bg-red-400 text-white px-2 rounded hover:bg-red-500"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
              {entries.length === 0 ? (
                <p className="text-center text-gray-500">No journal entries available.</p>
              ) : (
                <ul>
                  {getCurrentPageEntries().map((entry) => (
                    <li
                      key={entry.id}
                      className={`p-2 cursor-pointer ${
                        activeEntry?.id === entry.id ? "bg-blue-300" : "hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setActiveEntry(entry);
                        setNewEntry(false);
                      }}
                    >
                      <p className="font-bold">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleTimeString()}
                      </p>
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
              {activeEntry && (
                <p className="text-sm text-gray-500 mb-4">
                  Created on: {new Date(activeEntry.date).toLocaleString()}
                </p>
              )}
              <textarea
                className="w-full h-64 border rounded p-2"
                value={activeEntry?.content || ""}
                onChange={(e) =>
                  setActiveEntry((prev) => ({ ...prev!, content: e.target.value }))
                }
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                onClick={handleSave}
              >
                Save
              </button>
              {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default JournalingModal;

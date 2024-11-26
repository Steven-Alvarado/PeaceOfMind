import React, { useState, useEffect } from "react";

const TherapistModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    if (isOpen) fetchTherapists();
  }, [isOpen]);

  const fetchTherapists = async () => {
    try {
      const response = await fetch("/api/therapists/available");
      if (!response.ok) throw new Error("Failed to fetch therapists");
      const data = await response.json();
      setTherapists(data.therapists || []); // Default to empty array
    } catch (error) {
      console.error("Error fetching therapists:", error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTherapists = therapists.slice(startIndex, startIndex + itemsPerPage);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Available Therapists</h2>
          {therapists.length === 0 ? (
            <p className="text-center text-gray-500">No therapists available at the moment.</p>
          ) : (
            <ul className="space-y-4">
              {currentTherapists.map((therapist) => (
                <li key={therapist.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{`${therapist.first_name} ${therapist.last_name}`}</p>
                    <p className="text-sm text-gray-500">{`Specialization: ${therapist.specialization}`}</p>
                    <p className="text-sm text-gray-500">{`Experience: ${therapist.experience_years} years`}</p>
                    <p className="text-sm text-gray-500">{`Rate: $${therapist.monthly_rate}/month`}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(therapists.length / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(therapists.length / itemsPerPage)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default TherapistModal;

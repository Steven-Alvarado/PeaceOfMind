
import React, { useState } from "react";
import { User, ClipboardList, MessageCircle, FileText, X } from "lucide-react";

const PatientSection: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const patients = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `FirstName LastName ${i + 1}`,
    email: `patient${i + 1}@example.com`,
    condition: "Condition Details",
    notes: "Notes about the patient...",
  }));

  return (
    <div className="flex flex-row w-full h-full p-6 space-x-4">
      <div className="flex-grow bg-blue-100 border-2 border-[#5E9ED9] rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
          My Patients
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <select
            className="border border-[#5E9ED9] rounded-md p-2.5 text-black focus:outline-none focus:ring-2 focus:ring-[#5E9ED9]"
            defaultValue="firstName"
          >
            <option value="null">Select</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="w-2/3 border border-[#5E9ED9] rounded-md p-2.5 text-black focus:outline-none focus:ring-2 focus:ring-[#5E9ED9]"
          />
        </div>

        <div className="space-y-4 mb-5">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 rounded-lg shadow-md bg-blue-50 hover:bg-blue-100 transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {patient.name}
                </h3>
                <p className="text-sm text-gray-600">{patient.email}</p>
              </div>
              <button
                className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-lg hover:bg-[#4b8bc4] transition"
                onClick={() => setSelectedPatient(patient)}
              >
                <User className="w-5 h-5" />
                <span>View Details</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-8 max-w-xl w-full shadow-lg">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-semibold text-center text-[#5E9ED9] mb-4">
              {selectedPatient.name}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p className="text-gray-700">
                <strong>Condition:</strong> {selectedPatient.condition}
              </p>
              <p className="text-gray-700">
                <strong>Notes:</strong> {selectedPatient.notes}
              </p>
            </div>
            <div className="flex justify-around mt-6">
              <button className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4b8bc4] transition">
                <ClipboardList className="w-5 h-5" />
                <span>Records</span>
              </button>
              <button className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4b8bc4] transition">
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button className="flex items-center space-x-2 bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4b8bc4] transition">
                <FileText className="w-5 h-5" />
                <span>Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSection;



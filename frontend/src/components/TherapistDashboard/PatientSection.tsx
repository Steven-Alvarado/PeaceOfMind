import React, { useState } from "react";

const PatientSection: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const patients = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    name: `FirstName LastName ${i + 1}`,
  }));

  return (
    <div className="bg-blue-100 rounded-lg shadow-lg p-6 border border-[#5E9ED9]">
      <h2 className="text-2xl text-center font-bold text-[#5E9ED9] mb-4">
        Patients
      </h2>
      <div>
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="flex justify-between items-center p-2 border-b border-gray-300"
          >
            <span>Patient: {patient.name}</span>
            <button
              className="bg-[#5E9ED9] text-white px-4 py-1 rounded hover:bg-[#4a8ac9]"
              onClick={() => setSelectedPatient(patient)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-10 w-full max-w-xl outline outline-white outline-2 outline-offset-2">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-0 right-0 text-black text-lg p-2 m-2"
            >
              &#x2715;
            </button>
            <h2 className="text-3xl font-bold text-center text-[#5E9ED9]">
              {selectedPatient.name}
            </h2>
            <p className="text-gray-700 mt-4">
              Patient details: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Praesent mattis ex ac laoreet tempus. Vestibulum sapien ligula,
              venenatis et orci in, auctor feugiat massa.
            </p>
            <div className="flex justify-around mt-4">
              <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4a8ac9]">
                Records
              </button>
              <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4a8ac9]">
                Chat
              </button>
              <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded-full hover:bg-[#4a8ac9]">
                Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSection;

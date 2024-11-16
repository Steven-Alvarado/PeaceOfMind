import React from "react";

const TherapistDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-600">Therapist Dashboard</h1>
      <p className="mt-4 text-gray-700">Welcome to your dashboard! Here, you can:</p>
      <ul className="list-disc list-inside mt-4 text-gray-700">
        <li>View your upcoming appointments</li>
        <li>Manage your availability</li>
        <li>Review feedback from students</li>
      </ul>
      <div className="mt-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          View Appointments
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 ml-4">
          Update Availability
        </button>
      </div>
    </div>
  );
};

export default TherapistDashboard;

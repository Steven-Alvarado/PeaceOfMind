import React from "react";

const StudentDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">Student Dashboard</h1>
      <p className="mt-4 text-gray-700">Welcome to your dashboard! Here, you can:</p>
      <ul className="list-disc list-inside mt-4 text-gray-700">
        <li>View and update your journal entries</li>
        <li>Take surveys and track your progress</li>
        <li>Schedule appointments with therapists</li>
      </ul>
      <div className="mt-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          View Journals
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-4">
          Take a Survey
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;

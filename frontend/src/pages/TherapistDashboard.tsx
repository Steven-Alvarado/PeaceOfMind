import React from "react";
import HeaderLandingPage from "../components/headerLandingPage";
import FooterLandingPage from "../components/Footer";
import { FaCalendarAlt, FaUserPlus, FaTasks, FaCog, FaBell } from "react-icons/fa";
import { BsPersonCircle } from 'react-icons/bs';

const TherapistDashboard = () => {

  const handleViewDetails = () => {
    alert('Redirecting to patient details...');
  };

  const handleViewAppointments = () => {
    alert('Redirecting to view appointments...');
  };

  const handleNewPatientRequests = () => {
    alert('Redirecting to new patient requests...');
  };

  const handleManageScheduling = () => {
    alert('Redirecting to manage scheduling...');
  };

  const handleSettings = () => {
    alert('Redirecting to settings...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderLandingPage />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#5E9ED9]">Welcome, [Therapist's Name]</h1>
          <div className="space-x-4">
            <button className="text-[#5E9ED9] text-lg p-2 rounded-full hover:bg-blue-100" onClick={() => alert('You have no new notifications.')}>
              <FaBell />
            </button>
            <button className="text-[#5E9ED9] text-lg p-2 rounded-full hover:bg-blue-100" onClick={handleSettings}>
              <FaCog />
            </button>
            <button className="text-[#5E9ED9] text-lg p-2 rounded-full hover:bg-blue-100" onClick={() => alert('Redirecting to your profile...')}>
              <BsPersonCircle />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-5 divide-y divide-gray-200">
            <h2 className="text-2xl font-semibold text-[#5E9ED9] mb-4">Patients</h2>
            <div className="space-y-4 pt-4">
              {/*Array needs to change depending on how many patients the therapist has*/}
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 hover:bg-blue-50 rounded-md transition duration-300 ease-in-out">
                  <span className="font-medium">Patient: FirstName LastName</span>
                  <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]" onClick={handleViewDetails}>View Details</button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-5 space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-300 ease-in-out" onClick={handleViewAppointments}>
              <span className="font-medium">View Appointments</span>
              <FaCalendarAlt className="text-[#5E9ED9]" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-300 ease-in-out" onClick={handleNewPatientRequests}>
              <span className="font-medium">New Patient Requests</span>
              <FaUserPlus className="text-[#5E9ED9]" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-300 ease-in-out" onClick={handleManageScheduling}>
              <span className="font-medium">Manage Scheduling</span>
              <FaTasks className="text-[#5E9ED9]" />
            </button>
          </div>
        </div>
      </div>
      <FooterLandingPage />
    </div>
  );
};

export default TherapistDashboard;

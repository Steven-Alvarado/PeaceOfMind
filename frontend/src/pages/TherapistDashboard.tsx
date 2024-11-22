import React, { useState } from "react";
import HeaderTherapistDashboard from "../components/HeaderTherapistDashboard";
import Footer from "../components/Footer";
import {
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaComments,
  FaQuestionCircle,
  FaFileInvoice,
  FaUserPlus,
  FaTasks,
} from "react-icons/fa";

import Lottie from "lottie-react";
import TherapistDashboardAnimation from "../assets/lotties/TherapistDashboardAnimation.json";
import Switch from "@mui/material/Switch";
import NameOfPerson from "../components/nameOfPerson";
import { useAuth } from "../hooks/useAuth";

// Help Modal Component
const HelpModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md outline outline-white outline-2 outline-offset-2">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
        >
          &#x2715;
        </button>
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">
          Help
        </h2>
        <ul className="text-gray-700 space-y-3">
          <li>
            <FaUser className="inline mr-2" /> <strong>Manage Patients:</strong>{" "}
            Access and update patient records, chats, and notes.
          </li>
          <li>
            <FaCalendarAlt className="inline mr-2" />{" "}
            <strong>View Appointments:</strong> Manage your calendar and
            upcoming sessions.
          </li>
          <li>
            <FaComments className="inline mr-2" />{" "}
            <strong>New Patient Requests:</strong> Review and accept new patient
            inquiries.
          </li>
          <li>
            <FaFileInvoice className="inline mr-2" /> <strong>Invoices:</strong>{" "}
            View and manage billing for your services.
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

// Patient Request Modal Component
const RequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md outline outline-white outline-2 outline-offset-2">
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">
          Patient Requests
        </h2>
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

const PatientDetailsPopup = ({ onClose, patient }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-10 w-full max-w-xl outline outline-white outline-2 outline-offset-2">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2"
        >
          &#x2715;
        </button>
        <h2 className="text-3xl font-bold text-center text-[#5E9ED9]">
          {patient.name}
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
  );
};

// Lottie Animation Component
const LottieAnimation = () => {
  return (
    <div
      className="bg-blue-100 rounded-lg shadow-lg mb-4 border border-[#5E9ED9] p-2"
      style={{ height: "300px" }}
    >
      <Lottie
        animationData={TherapistDashboardAnimation}
        loop={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

// Patient Section Component
const PatientSection = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

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
        <PatientDetailsPopup
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

// Main Dashboard Component
const TherapistDashboard = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const { user } = useAuth();
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <div className="therapist-dashboard flex flex-col min-h-screen">
      <HeaderTherapistDashboard />
      <header>
        <h1 className="text-4xl font-bold text-center text-blue-500">
          <NameOfPerson userId={user?.id || null} />
        </h1>
      </header>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
        <div className="col-span-1">
          <LottieAnimation />
          <PatientSection />
        </div>
        <div className="col-span-1 bg-blue-100 rounded-lg shadow-lg p-6 border border-[#5E9ED9]">
          <h2 className="text-4xl text-center font-bold text-[#5E9ED9]">
            Menu
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-center space-x-2">
              <span>Not Available</span>
              <Switch checked={isAvailable} onChange={toggleAvailability} />
              <span>Available</span>
            </div>
            <div className="flex justify-center md:mt-7 md:mb-20">
              <button
                className="bg-[#5E9ED9] text-white px-4 py-1 rounded-2xl hover:bg-[#4a8ac9] text-sm"
                onClick={() => setIsHelpOpen(true)}
              >
                <div className="flex justify-center space-x-2 p-1">
                  <div className="font-bold">Help</div>
                  <FaQuestionCircle className="mt-0.5" />
                </div>
              </button>
            </div>
            <button
              className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
              onClick={() => setIsRequestOpen(true)}
            >
              <FaUserPlus className="mr-3" /> View New Patient Requests
            </button>
            <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
              <FaTasks className="mr-3" /> Manage Scheduling
            </button>
            <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
              <FaFileInvoice className="mr-3" /> Invoices
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <RequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
    </div>
  );
};

export default TherapistDashboard;

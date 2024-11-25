import React, { useState } from "react";
import HeaderTherapistDashboard from "../components/HeaderTherapistDashboard";
import Footer from "../components/Footer";
import PatientSection from "../components/PatientSection";
import Lottie from "lottie-react";
import TherapistDashboardAnimation from "../assets/lotties/TherapistDashboardAnimation.json";
import Switch from "@mui/material/Switch";
import { useAuth } from "../hooks/useAuth";
import TherapistHelpModal from "../components/TherapistHelpModal"; // Import your existing TherapistHelpModal component
import {
  FaUserPlus,
  FaTasks,
  FaFileInvoice,
} from "react-icons/fa";

// Lottie Animation Component
const LottieAnimation: React.FC = () => (
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

const TherapistDashboard: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const { user } = useAuth();

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <div className="therapist-dashboard flex flex-col min-h-screen">
      <HeaderTherapistDashboard />
      <header>
        <h1 className="text-4xl font-bold text-center text-blue-500">
          Welcome, {user?.first_name} {user?.last_name}
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
                Help
              </button>
            </div>
            <button
              className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
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
      <TherapistHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default TherapistDashboard;

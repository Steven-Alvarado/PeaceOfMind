import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderTherapistDashboard from "../components/TherapistDashboard/HeaderTherapistDashboard";
import Footer from "../components/Footer";
import PatientSection from "../components/TherapistDashboard/PatientSection";
//import Lottie from "lottie-react";
import Switch from "@mui/material/Switch";
import { useAuth } from "../hooks/useAuth";

import TherapistHelpModal from "../components/TherapistDashboard/TherapistHelpModal"; // Import your existing TherapistHelpModal component
import RequestList from "../components/TherapistDashboard/RequestList";
import InvoicingModal from "../components/TherapistDashboard/InvoicingModal";

import { FaUserPlus, FaTasks, FaFileInvoice } from "react-icons/fa";

const TherapistDashboard: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isInvoicingOpen, setIsInvoicingOpen] = useState(false);

  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined);
  const [therapistId, setTherapistId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { user } = useAuth();

  const toggleAvailability = async () => {
    try {
        const response = await axios.put(`/api/therapists/${therapistId.id}/availability`, {
            availability: !isAvailable,
        });
        setIsAvailable(response.data.availability);
    } catch (error) {
        console.error("Failed to toggle availability:", error);
    }
};

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  // Fetch therapist ID when modal opens
  useEffect(() => {
    const fetchTherapistId = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`/api/therapists/find/${user.id}`);
        console.log("Therapist ID Response:", response.data); // Debugging
        setTherapistId(response.data.therapist);
      } catch (error) {
        console.error("Error making GET request:", error);
      }
    };

    fetchTherapistId();
  }, [user]);

  return (
    <div className="therapist-dashboard flex flex-col min-h-screen">
      <HeaderTherapistDashboard />
      <header className="bg-blue-100 p-3">
        <h1 className="text-4xl font-bold text-center text-[#5E9ED9]">
          Welcome, {user?.first_name} {user?.last_name}!
        </h1>
        <h2>
          Therapist ID:{" "}
          {therapistId != null ? (
            <span>{therapistId.id}</span>
          ) : (
            <span>Getting Id...</span>
          )}
        </h2>
      </header>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 px-6 py-10">
        {/* Patients Section */}
        <div className="col-span-2">
          <PatientSection
            therapistId={therapistId ? therapistId.id : null}
            refresh={refresh}
          />
        </div>
        <div className="col-span-1 bg-blue-100 rounded-lg shadow-lg p-6 border-2 border-[#5E9ED9]">
          <h2 className="text-4xl text-center font-bold text-[#5E9ED9]">
            Menu
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex justify-center md:mt-7 md:mb-20">
              <button
                className="bg-[#5E9ED9] text-white px-4 py-1 rounded-2xl hover:bg-[#4a8ac9] text-sm"
                onClick={() => setIsHelpOpen(true)}
              >
                Help
              </button>
            </div>
            <div className="flex justify-center">              
              <div className="text-center p-2 text-[#5E9ED9] rounded-2xl w-2/3"> Set your availability for Patient Requests.</div>
            </div>
            <div className="flex items-center justify-center space-x-2 border-[#5E9ED9] border-2 rounded-2xl">
              <span className=" p-2 rounded-3xl text-[#5E9ED9] font-bold">Not Available</span>
              <Switch className="" checked={isAvailable} onChange={toggleAvailability} />
              <span className=" p-2 rounded-3xl text-[#5E9ED9] font-bold">Available</span>
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
            <button 
              className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
              onClick={() => setIsInvoicingOpen(true)}
            >
              <FaFileInvoice className="mr-3" /> Invoices
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <TherapistHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
      <RequestList
        therapistId={therapistId ? therapistId.id : null}
        isOpen={isRequestOpen}
        refresh={refresh}
        onClose={() => {
          setIsRequestOpen(false);
          handleRefresh();
          //window.location.reload(); Refreshes page
        }}
      />
      <InvoicingModal 
        isOpen={isInvoicingOpen}
        onClose={() => setIsInvoicingOpen(false)} 
        therapistId={therapistId ? therapistId.id : null}
      />

    </div>
  );
};

export default TherapistDashboard;

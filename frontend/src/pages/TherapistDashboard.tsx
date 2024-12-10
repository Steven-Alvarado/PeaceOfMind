import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderTherapistDashboard from "../components/TherapistDashboard/HeaderTherapistDashboard";
import Footer from "../components/Footer";
import PatientSection from "../components/TherapistDashboard/PatientSection";
import Switch from "@mui/material/Switch";
import { useAuth } from "../hooks/useAuth";
import TherapistHelpModal from "../components/TherapistDashboard/TherapistHelpModal";
import RequestList from "../components/TherapistDashboard/RequestList";
import InvoicingModal from "../components/TherapistDashboard/InvoicingModal";
import SchedulingForTherapists from "../components/TherapistDashboard/SchedulingForTherapists"; // Import SchedulingForTherapists
import { FaUserPlus, FaTasks, FaFileInvoice , FaQuestionCircle} from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const TherapistDashboard: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isInvoicingOpen, setIsInvoicingOpen] = useState(false);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false); // State for scheduling modal

  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined);
  const [therapistId, setTherapistId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { user } = useAuth();

  const toggleAvailability = async () => {
    try {
      if (!therapistId) return;

      const response = await axios.put(
        `${API_BASE_URL}/therapists/toggleAvailability/${therapistId.id}`
      );

      setIsAvailable(response.data.therapist.availability);
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
        setTherapistId(response.data.therapist);
        setIsAvailable(response.data.therapist.availability);
      } catch (error) {
        console.error("Error making GET request:", error);
      }
    };

    fetchTherapistId();
  }, [user]);

  return (
    <div className="therapist-dashboard flex flex-col min-h-screen">
      <HeaderTherapistDashboard /> 
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 px-6 py-10">
        {/* Patients Section */}
        <div className="col-span-2">
          <PatientSection
            therapistId={therapistId ? therapistId.id : null}
            refresh={refresh}
          />
        </div>
        <div className="col-span-1 backdrop-blur-lg bg-blue-100 shadow-lg rounded-2xl p-8 border-2 border-[#5E9ED9] mt-7 mb-6">
  {/* Header */}
  <header className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-semibold text-center text-[#5E9ED9]">Menu</h2>
    <button
      onClick={() => setIsHelpOpen(true)}
      className="text-[#5E9ED9] hover:text-blue-700 transition-colors duration-200"
      aria-label="Help"
    >
      <FaQuestionCircle className="w-5 h-5" />
    </button>
  </header>

  {/* Availability Toggle */}
  <div className="flex flex-col items-center bg-blue-100 p-4 rounded-lg border border-[#5E9ED9] mb-6">
    <span className="text-gray-700 font-medium text-lg mb-2">
      Set your availability for Patient Requests
    </span>
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">Not Available</span>
      <Switch checked={isAvailable || false} onChange={toggleAvailability} />
      <span className="text-sm text-gray-700">Available</span>
    </div>
  </div>

  {/* Menu Buttons */}
  <div className="space-y-4">
    <button
      onClick={() => setIsRequestOpen(true)}
      className="w-full flex items-center justify-between px-4 py-3 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200"
    >
      <span>View New Patient Requests</span>
      <FaUserPlus className="w-5 h-5" />
    </button>
    <button
      onClick={() => setIsSchedulingModalOpen(true)}
      className="w-full flex items-center justify-between px-4 py-3 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200"
    >
      <span>Manage Scheduling</span>
      <FaTasks className="w-5 h-5" />
    </button>
    <button
      onClick={() => setIsInvoicingOpen(true)}
      className="w-full flex items-center justify-between px-4 py-3 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200"
    >
      <span>Invoices</span>
      <FaFileInvoice className="w-5 h-5" />
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
        }}
      />
      <InvoicingModal
        isOpen={isInvoicingOpen}
        onClose={() => setIsInvoicingOpen(false)}
        therapistId={therapistId ? therapistId.id : null}
      />
      {/* Scheduling Modal */}
      {isSchedulingModalOpen && (
        <SchedulingForTherapists
          therapistId={therapistId ? therapistId.id : null}
          isOpen={isSchedulingModalOpen}
          onClose={() => setIsSchedulingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TherapistDashboard;
import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaUserPlus,
  FaTasks,
  FaFileInvoice,
} from "react-icons/fa";
import Switch from "@mui/material/Switch";
import SchedulingForTherapists from "./SchedulingForTherapists";

interface TherapistMenuSectionProps {
  isAvailable: boolean;
  toggleAvailability: () => void;
  onHelpClick: () => void;
  onRequestClick: () => void;
  therapistId: number;
}

const TherapistMenuSection: React.FC<TherapistMenuSectionProps> = ({
  isAvailable,
  toggleAvailability,
  onHelpClick,
  onRequestClick,
  therapistId,
}) => {
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);

  console.log("TherapistMenuSection rendered with therapistId:", therapistId);

  return (
    <div className="bg-blue-100 rounded-lg shadow-lg p-6 border-2 border-[#5E9ED9]">
      <h2 className="text-4xl text-center max-h-full font-bold text-[#5E9ED9]">
        Menu
      </h2>
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-center space-x-2">
          <span>Not Available</span>
          <Switch checked={isAvailable} onChange={toggleAvailability} />
          <span>Available</span>
        </div>
        <button
          className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
          onClick={() => {
            console.log("Manage Scheduling button clicked");
            setIsSchedulingModalOpen(true);
          }}
        >
          <FaTasks className="mr-3" /> Manage Scheduling
        </button>
      </div>

      {isSchedulingModalOpen && (
        <SchedulingForTherapists
          therapistId={therapistId}
          isOpen={isSchedulingModalOpen}
          onClose={() => {
            console.log("Closing scheduling modal");
            setIsSchedulingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TherapistMenuSection;

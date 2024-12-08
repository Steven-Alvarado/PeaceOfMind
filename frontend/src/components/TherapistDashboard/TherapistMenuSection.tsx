import React, { useState } from "react";
import { ClipboardList, Calendar, HelpCircle } from "lucide-react";
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

  return (
    <div className="bg-blue-100 border-2 py-24 border-[#5E9ED9] rounded-lg shadow-lg p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-center text-[#5E9ED9]">
          Menu
        </h1>
        <button
          onClick={onHelpClick}
          className="text-[#5E9ED9] hover:text-blue-700 transition-colors duration-200"
          aria-label="Help"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <span className="text-gray-700">Not Available</span>
        <Switch checked={isAvailable} onChange={toggleAvailability} />
        <span className="text-gray-700">Available</span>
      </div>

      {/* Menu Buttons */}
      <div className="space-y-6">
        <button
          onClick={() => setIsSchedulingModalOpen(true)}
          className="w-full flex items-center p-4 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Calendar className="w-6 h-6 mr-3" />
          <span className="text-lg font-medium">Manage Scheduling</span>
        </button>

        <button
          onClick={onRequestClick}
          className="w-full flex items-center p-4 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ClipboardList className="w-6 h-6 mr-3" />
          <span className="text-lg font-medium">View Requests</span>
        </button>
      </div>

      {/* Modals */}
      {isSchedulingModalOpen && (
        <SchedulingForTherapists
          therapistId={therapistId}
          isOpen={isSchedulingModalOpen}
          onClose={() => setIsSchedulingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TherapistMenuSection;

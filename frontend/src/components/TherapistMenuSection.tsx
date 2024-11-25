import React from "react";
import { FaQuestionCircle, FaUserPlus, FaTasks, FaFileInvoice } from "react-icons/fa";
import Switch from "@mui/material/Switch";

interface TherapistMenuSectionProps {
  isAvailable: boolean;
  toggleAvailability: () => void;
  onHelpClick: () => void;
  onRequestClick: () => void;
}

const TherapistMenuSection: React.FC<TherapistMenuSectionProps> = ({
  isAvailable,
  toggleAvailability,
  onHelpClick,
  onRequestClick,
}) => {
    return (
        <div className="bg-blue-100 rounded-lg shadow-lg p-6 border border-[#5E9ED9]">
          <h2 className="text-4xl text-center font-bold text-[#5E9ED9]">Menu</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-center space-x-2">
              <span>Not Available</span>
              <Switch checked={isAvailable} onChange={toggleAvailability} />
              <span>Available</span>
            </div>
            <div className="flex justify-center md:mt-7 md:mb-20">
              <button
                className="bg-[#5E9ED9] text-white px-4 py-1 rounded-2xl hover:bg-[#4a8ac9] text-sm"
                onClick={onHelpClick}
              >
                <div className="flex justify-center space-x-2 p-1">
                  <div className="font-bold">Help</div>
                  <FaQuestionCircle className="mt-0.5" />
                </div>
              </button>
            </div>
            <button
              className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
              onClick={onRequestClick}
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
      );
    };
    
    export default TherapistMenuSection;
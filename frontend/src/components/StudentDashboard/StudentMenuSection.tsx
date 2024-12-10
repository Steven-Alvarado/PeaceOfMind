import React, { useState } from "react";
import {
  Book,
  PieChart,
  ClipboardList,
  FileText,
  HelpCircle,
} from "lucide-react";
import HelpModal from "./StudentHelpModal";
import JournalingModal from "./JournalingModal";
import JournalAnalyticsModal from "./JournalAnalyticsModal";
import DailySurvey from "./DailySurvey";
import InvoicingModal from "./InvoicingModal";
import { User } from "../../context/AuthContext";

interface StudentMenuSectionProps {
  user: User;
  onSurveyClick: () => void;
}

const StudentMenuSection: React.FC<StudentMenuSectionProps> = ({
  user,
  onSurveyClick,
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isInvoicingOpen, setIsInvoicingOpen] = useState(false);

  return (
    <div className="bg-blue-100 border-2 py-24 border-[#5E9ED9] rounded-lg shadow-lg p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-center text-[#5E9ED9]">
          Menu
        </h1>
        <button
          onClick={() => setIsHelpOpen(true)}
          className="text-[#5E9ED9] hover:text-blue-700 transition-colors duration-200"
          aria-label="Help"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Menu Buttons */}
      <div className="space-y-6">
        <button
          onClick={() => setIsJournalOpen(true)}
          className="w-full flex items-center p-4 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Book className="w-6 h-6 mr-3" />
          <span className="text-lg font-medium">Journal</span>
        </button>

        <button
          onClick={() => setIsAnalyticsOpen(true)}
          className="w-full flex items-center p-4 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PieChart className="w-6 h-6 mr-3" />
          <span className="text-lg font-medium">Analytics</span>
        </button>

        <button
          onClick={() => setIsSurveyOpen(true)}
          className="w-full flex items-center p-4 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ClipboardList className="w-6 h-6 mr-3" />
          <span className="text-lg font-medium">Surveys</span>
        </button>

        <button
          onClick={() => setIsInvoicingOpen(true)}
          className="w-full flex items-center p-4 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FileText className="w-6 h-6 mr-3" />
          <span className="text-lg font-medium">Invoices</span>
        </button>
      </div>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <JournalingModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
      <JournalAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        user={{ id: user.id, name: `${user.firstName} ${user.lastName}` }}
      />
      <DailySurvey
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        user={user}
      />
      <InvoicingModal
        isOpen={isInvoicingOpen}
        onClose={() => setIsInvoicingOpen(false)}
      />
    </div>
  );
};

export default StudentMenuSection;

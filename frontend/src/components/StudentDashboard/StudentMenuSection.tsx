import React, { useState } from "react";
import { FaBook, FaChartPie, FaFileInvoiceDollar, FaQuestionCircle} from "react-icons/fa";
import { FaClipboardQuestion } from "react-icons/fa6"
import HelpModal from "./StudentHelpModal";
import JournalingModal from "./JournalingModal";
import JournalAnalyticsModal from "./JournalAnalyticsModal";
import WeeklySurvey from "./WeeklySurvey";
import InvoicingModal from "./InvoicingModal";
import {User} from "../../context/AuthContext";

interface StudentMenuSectionProps {
    user: User;
    onSurveyClick: () => void; // Ensure other props are also typed
};
  
const StudentMenuSection: React.FC<StudentMenuSectionProps> = ({ user, onSurveyClick }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isInvoicingOpen, setIsInvoicingOpen] = useState(false);


    return (
      <div className="">
        <div className="bg-blue-100 border-2 border-[#5E9ED9] rounded-lg shadow-lg p-10">
          <h2 className="text-2xl text-center font-bold text-[#5E9ED9] ">Menu</h2>
          <div className="flex justify-center md:mt-5 md:mb-8">
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
          <div className="space-y-7 mb-4">
              <div className="justify-center flex">
                  <button
                      className=" w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
                      onClick={() => setIsJournalOpen(true)}
                  >
                      <FaBook className="mr-3" /> Journal
                  </button>
              </div>
              <div className="justify-center flex">
                  <button
                      className=" w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
                      onClick={() => setIsAnalyticsOpen(true)}
                  >
                      <FaChartPie className="mr-3" /> Analytics
                  </button>
              </div>
              <div className="justify-center flex">
                  <button
                      className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
                      onClick={()=> setIsSurveyOpen(true)}
                  >
                      <FaClipboardQuestion className="mr-3" /> Surveys
                  </button>
              </div>
              <div className="justify-center flex">
                  <button
                      className=" w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
                      onClick={() => setIsInvoicingOpen(true)}
                  >
                      <FaFileInvoiceDollar className="mr-3" /> Invoices
                  </button>
              </div>
          </div>
          <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
          <JournalingModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
          <JournalAnalyticsModal isOpen={isAnalyticsOpen} onClose={() =>setIsAnalyticsOpen(false)} />
          <WeeklySurvey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} user={user} />
          <InvoicingModal isOpen={isInvoicingOpen} onClose={() => setIsInvoicingOpen(false)} />
        </div>
      </div>
    );
};

export default StudentMenuSection;

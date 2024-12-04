import React, { useState } from "react";
import {  FaBook, FaClipboardQuestion } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";

import HelpModal from "./StudentHelpModal";
import JournalingModal from "./JournalingModal";
import InvoicingModal from "./InvoicingModal";

import {User} from "../../context/AuthContext";

interface StudentMenuSectionProps {
    user: User;
    onSurveyClick: () => void; // Ensure other props are also typed
};
  
const StudentMenuSection: React.FC<StudentMenuSectionProps> = ({ user, onSurveyClick }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [isInvoicingOpen, setIsInvoicingOpen] = useState(false);

    return (
        <div className="bg-blue-100 border border-[#5E9ED9] flex-grow rounded-lg p-6 shadow-lg">
            <div className="items-center justify-between mb-6">
                <h2 className="text-2xl text-center font-bold text-[#5E9ED9] mt-2">Menu</h2>
                <div className="flex justify-center md:mt-5 md:mb-5">
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
            </div>
            <div className="space-y-6">
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
                    >
                        <FaBook className="mr-3" /> Analytics
                    </button>
                </div>
                <div className="justify-center flex">
                    <button
                        className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
                        onClick={onSurveyClick}
                    >
                        <FaClipboardQuestion className="mr-3" /> Surveys
                    </button>
                </div>
                <div className="justify-center flex">
                    <button
                        className=" w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
                        onClick={() => setIsInvoicingOpen(true)}
                    >
                        <FaBook className="mr-3" /> Invoices
                    </button>
                </div>
            </div>
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
            <JournalingModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
            <InvoicingModal isOpen={isInvoicingOpen} onClose={() => setIsInvoicingOpen(false)} />
        </div>
    );
};

export default StudentMenuSection;
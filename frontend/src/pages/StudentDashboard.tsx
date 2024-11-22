import React, { useState, useEffect } from "react";
import HeaderStudentDashboard from "../components/headerStudentDashboard";
import Footer from "../components/Footer";
import {
  FaUser,
  FaBriefcase,
  FaChevronDown,
  FaMapMarkerAlt,
  FaCalendar,
  FaComments,
  FaBook,
  FaChartBar,
  FaFileInvoice,
  FaQuestionCircle,
  FaClipboardList,
  FaDollarSign,
  FaBookReader,
  FaRestroom,
} from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaClipboardQuestion } from "react-icons/fa6";

import Lottie from "lottie-react";
import StudentDashboardAnimation from "../assets/lotties/StudentDashboardAnimation.json";
import WeeklySurvey from "../components/weeklySurvey";
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
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg outline outline-white outline-2 outline-offset-2">
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
            <FaBook className="inline mr-2" /> <strong>Journal:</strong> Reflect
            on your thoughts and emotions.
          </li>
          <li>
            <FaClipboardList className="inline mr-2" />{" "}
            <strong>View Therapists:</strong> Look for a new therapist.
          </li>
          <li>
            <FaFileInvoice className="inline mr-2" /> <strong>Invoices:</strong>{" "}
            View and manage your payment details.
          </li>
          <li>
            <FaClipboardQuestion className="inline mr-2" />{" "}
            <strong>Surveys:</strong> Answer weekly survey.
          </li>
          <li>
            <FaFileInvoice className="inline mr-2" /> <strong>Invoices:</strong>{" "}
            View and manage your payment details.
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

// Therapist List Popup
const TherapistModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [message, setMessage] = useState<string>(""); // State for displaying the message
  const [therapists, setTherapists] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const itemsPerPage = 2; // Number of therapists to show per page

  const handleSwitchRequest = (therapistName: string) => {
    setMessage(`Switch Request Sent for ${therapistName}`); // Set the message with therapist's name
  };

  useEffect(() => {
    if (isOpen) {
      const fetchTherapists = async () => {
        setLoading(true);
        try {
          setError(null); // Reset error on new request
          const response = await fetch("/api/therapists/available");
          if (!response.ok) {
            throw new Error("Failed to fetch therapists");
          }
          const data = await response.json();
          setTherapists(data.therapists); // Assuming the response structure has a 'therapists' field
        } catch (err: any) {
          setError(err.message || "An error occurred");
        } finally {
          setLoading(false); // Set loading to false once done
        }
      };

      fetchTherapists();
    }
  }, [isOpen]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTherapists = therapists.slice(startIndex, endIndex);
  const totalPages = Math.ceil(therapists.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl outline outline-white outline-2 outline-offset-2">
        <h2 className="text-3xl font-extrabold text-center text-[#5E9ED9] mb-4">
          Available Therapists
        </h2>
        {loading && <p className="text-center text-gray-700"></p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {therapists.length === 0 && !loading && !error && (
          <p className="text-center text-gray-700">
            No therapists available at the moment.
          </p>
        )}
        <ul className="text-gray-700 space-y-3">
          {currentTherapists.map((therapist: any) => (
            <li
              key={therapist.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <div className="flex items-center space-x-3 mt-2">
                  <FaUser className="text-[#5E9ED9]" />
                  <span className="font-medium">Therapist Name:</span>
                  <span className="ml-2">
                    {therapist.first_name} {therapist.last_name}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <FaRestroom className="text-[#5E9ED9]" />
                  <span className="font-medium">Gender:</span>
                  <span className="ml-2">
                    {therapist.gender.charAt(0).toUpperCase() +
                      therapist.gender.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <FaBriefcase className="text-[#5E9ED9]" />
                  <span className="font-medium">Specialty:</span>
                  <span className="ml-2">{therapist.specialization}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <FaBookReader className="text-[#5E9ED9]" />
                  <span className="font-medium">Years of Experience:</span>
                  <span className="ml-2">{therapist.experience_years}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <FaDollarSign className="text-[#5E9ED9]" />
                  <span className="font-medium">Monthly Rate:</span>
                  <span className="ml-2">${therapist.monthly_rate}</span>
                </div>
              </div>

              <div className="ml-4 flex items-center">
                <button
                  className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9] transition"
                  onClick={() =>
                    handleSwitchRequest(
                      `${therapist.first_name} ${therapist.last_name}`
                    )
                  }
                >
                  <FaArrowRightArrowLeft className="inline mr-2" /> Switch
                  Request
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Empty space for message */}
        <div className="text-center text-gray-700 mt-6">{message}</div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Therapist Section Component
const TherapistSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="flex justify-center bg-blue-100 rounded-lg border border-[#5E9ED9] shadow-lg mb-12">
        <Lottie
          animationData={StudentDashboardAnimation}
          loop={true}
          style={{ width: "45%", height: "45%" }}
        />
      </div>

      <div className="bg-blue-100 rounded-lg shadow-lg p-6 border border-[#5E9ED9]">
        <h2 className="text-2xl text-center font-bold text-[#5E9ED9] mb-10">
          Your Therapist
        </h2>

        <p className="text-xl text-center font-medium text-gray-800 mb-10">
          [Therapist's Name]
        </p>

        <div className="mb-14">
          <button
            className="w-full bg-[#5E9ED9] text-white px-4 py-2 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            View Details
            <FaChevronDown
              className={`ml-2 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          {isExpanded && (
            <div className="mt-4 flex space-x-5 justify-center text-gray-700">
              <p>
                <FaUser className="inline mr-2 text-[#5E9ED9]" />
                <span className="font-medium">Years of Experience:</span> 10
              </p>
              <p>
                <FaBriefcase className="inline mr-2 text-[#5E9ED9]" />
                <span className="font-medium">Specialty:</span> Anxiety &
                Depression
              </p>
              <p>
                <FaMapMarkerAlt className="inline mr-2 text-[#5E9ED9]" />
                <span className="font-medium">Location:</span> California
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center space-x-4 mb-5">
          <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9] transition">
            <FaCalendar className="inline mr-2" /> Schedule Appointment
          </button>
          <button className="bg-[#5E9ED9] text-white px-4 py-2 rounded hover:bg-[#4a8ac9] transition">
            <FaComments className="inline mr-2" /> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

// Menu Section Component
const MenuSection = ({ onSurveyClick }: { onSurveyClick: () => void }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTherListOpen, setIsTherListOpen] = useState(false);

  return (
    <div className="bg-blue-100 border border-[#5E9ED9] rounded-lg p-6 shadow-lg">
      <div className="items-center justify-between mb-6">
        <h2 className="text-4xl text-center font-bold text-[#5E9ED9] mt-5">
          Menu
        </h2>
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
      </div>
      <div className="space-y-6">
        <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
          <FaBook className="mr-3" /> Journal
        </button>
        <button
          className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
          onClick={() => setIsTherListOpen(true)}
        >
          <FaClipboardList className="mr-3" /> View Therapists
        </button>
        <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
          <FaChartBar className="mr-3" /> Analytics
        </button>
        <button
          className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
          onClick={onSurveyClick}
        >
          <FaClipboardQuestion className="mr-3" /> Surveys
        </button>
        <button className="w-full bg-[#5E9ED9] text-white px-6 py-4 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center">
          <FaFileInvoice className="mr-3" /> Invoices
        </button>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <TherapistModal
        isOpen={isTherListOpen}
        onClose={() => setIsTherListOpen(false)} // Pass studentId to fetch the therapist list
      />
    </div>
  );
};

// Main Dashboard Component
const StudentDashboard: React.FC = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="student-dashboard flex flex-col min-h-screen">
      <HeaderStudentDashboard />
      <header>
        <h1 className="text-4xl font-bold text-center text-blue-500">
          <NameOfPerson userId={user?.id || null} />
        </h1>
      </header>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
        <TherapistSection />
        <MenuSection onSurveyClick={() => setIsSurveyOpen(true)} />
      </div>
      <Footer />
      <WeeklySurvey
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        user={user}
      />
    </div>
  );
};

export default StudentDashboard;

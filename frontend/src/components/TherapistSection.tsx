import React, { useState } from 'react';
import Lottie from 'lottie-react';
import StudentDashboardAnimation from '../assets/lotties/StudentDashboardAnimation.json';
import { FaChevronDown, FaUser, FaBriefcase, FaMapMarkerAlt, FaCalendar, FaComments } from 'react-icons/fa';

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
          <p className="text-xl text-center font-medium text-gray-800 mb-10">[Therapist's Name]</p>
          <div className="mb-14">
            <button
              className="w-full bg-[#5E9ED9] text-white px-4 py-2 text-lg font-semibold rounded hover:bg-[#4a8ac9] flex items-center justify-center"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              View Details
              <FaChevronDown className={`ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            {isExpanded && (
              <div className="mt-4 flex space-x-5 justify-center text-gray-700">
                <p>
                  <FaUser className="inline mr-2 text-[#5E9ED9]" />
                  <span className="font-medium">Years of Experience:</span> 10
                </p>
                <p>
                  <FaBriefcase className="inline mr-2 text-[#5E9ED9]" />
                  <span className="font-medium">Specialty:</span> Anxiety & Depression
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
 
export default TherapistSection;
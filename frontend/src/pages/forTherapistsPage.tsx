import React, { useState } from "react";
import HeaderLandingPage from "../components/headerLandingPage";
import FooterLandingPage from "../components/footerLandingPage";
import { FaMale, FaFemale, FaGenderless } from 'react-icons/fa';
import Lottie from "lottie-react";
import SignUpPageAnimation from "../lotties/SignUpPageAnimation.json"; // Placeholder until another Lottie is found

const TherapistSignUp = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <HeaderLandingPage />
      <div style={{ paddingBottom: '100px' }}>
        <TherapistSignUpSection />
      </div>
      <FooterLandingPage style={{ position: 'absolute', bottom: 0, width: '100%' }} />
    </div>
  );
};

function TherapistSignUpSection() {
  const [gender, setGender] = useState(''); // State for handling gender selection

  const handleGenderSelect = (selectedGender) => setGender(selectedGender);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
  };

  return (
    <section className="flex flex-col items-center justify-center py-10 px-6 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-center mb-10 w-full max-w-5xl">
        <div className="text-left md:w-1/2 p-6">
          <h1 className="text-4xl font-bold text-[#5E9ED9] text-center mb-4">
            Join Our Therapist Community
          </h1>
          <p className="text-gray-700 font-bold mb-6">
            Empower your career and help college students by providing tailored mental health support:
          </p>
          <ul className="space-y-3 font-semibold text-gray-700">
            <li>💼 Build your practice with access to a dedicated student base.</li>
            <li>🎓 Specialize in academic and student-life stressors.</li>
            <li>🛠 Use our platform's tools for scheduling and client management.</li>
            <li>📚 Access to continuous learning and professional development.</li>
            <li>🤝 Be part of a community of mental health professionals.</li>
          </ul>
        </div>

        <div className="md:w-1/2 w-3/4 max-w-sm mx-auto md:ml-8">
          <Lottie animationData={SignUpPageAnimation} loop={true} />
        </div>
      </div>

      <div className="bg-blue-100 rounded-lg shadow-md p-6 w-full border border-[#5E9ED9] max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-[#5E9ED9] mb-4">Sign Up as a Therapist</h2>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="First Name" 
            className="w-full p-3 mb-2 border border-[#5E9ED9] rounded-md" 
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            className="w-full p-3 mb-2 border border-[#5E9ED9] rounded-md" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 mb-2 border border-[#5E9ED9] rounded-md" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 mb-2 border border-[#5E9ED9] rounded-md" 
          />
          <input 
            type="text" 
            placeholder="Address" 
            className="w-full p-3 mb-2 border border-[#5E9ED9] rounded-md" 
          />
          <input 
            type="text" 
            placeholder="License Number" 
            className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md" 
          />

          {/* Gender selection area */}
          <div className="w-full mb-6">
            <label className="block mb-2 text-[#5E9ED9] font-semibold">Gender</label>
            <div className="flex justify-around">
              <GenderOption
                icon={<FaMale />}
                label="Male"
                isSelected={gender === 'male'}
                onClick={() => handleGenderSelect('male')}
              />
              <GenderOption
                icon={<FaFemale />}
                label="Female"
                isSelected={gender === 'female'}
                onClick={() => handleGenderSelect('female')}
              />
              <GenderOption
                icon={<FaGenderless />}
                label="Other"
                isSelected={gender === 'unspecified'}
                onClick={() => handleGenderSelect('unspecified')}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5E9ED9] text-white font-semibold p-3 rounded-md hover:bg-[#4a8ac9]"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
}

function GenderOption({ icon, label, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-col items-center justify-center w-24 h-24 p-4 border rounded-md transition ${isSelected ? 'bg-[#5E9ED9] text-white' : 'bg-white border-[#5E9ED9] text-[#5E9ED9]'}`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

export default TherapistSignUp;

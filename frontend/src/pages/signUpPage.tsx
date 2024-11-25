import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import HeaderSignUpLoginPage from "../components/HeaderSignUpLoginPage";
import FooterLandingPage from "../components/Footer";
import { FaMale, FaFemale, FaGenderless } from "react-icons/fa";
import Lottie from "lottie-react";
import SignUpPageAnimation from "../assets/lotties/SignUpPageAnimation.json";

type GenderOptionType = "male" | "female" | "other" | "";

const SignUp = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <HeaderSignUpLoginPage />
      <div className="pb-36">
        <SignUpSection />
      </div>
      <div className="absolute bottom-0 w-full">
        <FooterLandingPage />
      </div>
    </div>
  );
};

function SignUpSection() {
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (selectedGender: GenderOptionType) =>
    setFormData((prev) => ({ ...prev, gender: selectedGender }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if gender is selected
    if (!formData.gender) {
      setError("Please select a gender.");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await registerUser(
        formData.firstName,
        formData.lastName,
        formData.gender,
        formData.email,
        formData.password,
        "student" // Default role as "student"
      );
      setIsRegistered(true);
      setError(null);

      // Delay navigation by 3 seconds
      setTimeout(() => 3000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-10 px-6 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-center mb-10 w-full max-w-5xl">
        <div className="text-left md:w-1/2 p-6">
          <h1 className="text-4xl font-bold text-[#5E9ED9] text-center mb-4">
            Join Peace of Mind
          </h1>
          <p className="text-gray-700 font-bold mb-6">
            Discover the benefits of being a part of our supportive community tailored for
            college students:
          </p>
          <ul className="space-y-3 font-semibold text-gray-700">
            <li>🌟 Access to licensed therapists who understand student life.</li>
            <li>📅 Daily mental health check-ins to keep you on track.</li>
            <li>📚 Personalized advice and resources to handle academic and social stress.</li>
            <li>📝 Private journaling features to track your progress over time.</li>
            <li>🌍 Community resources to learn from others' experiences.</li>
          </ul>
        </div>

        <div className="md:w-1/2 w-3/4 max-w-sm mx-auto md:ml-8">
          <Lottie animationData={SignUpPageAnimation} loop={true} />
        </div>
      </div>

      <div className="bg-blue-100 rounded-lg shadow-md p-6 w-full border border-[#5E9ED9] max-w-md text-center">
        {isRegistered ? (
          // Success Message
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#5E9ED9] mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-700 font-semibold">
              Redirecting to the login page...
            </p>
          </div>
        ) : (
          // Registration Form
          <>
            <h2 className="text-3xl font-extrabold text-[#5E9ED9] mb-4">Sign Up</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 mb-6 border border-[#5E9ED9] rounded-md"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />

              <div className="w-full mb-6">
                <label className="block mb-2 text-[#5E9ED9] font-semibold">Gender</label>
                <div className="flex justify-around">
                  <GenderOption
                    icon={<FaMale />}
                    label="Male"
                    isSelected={formData.gender === "male"}
                    onClick={() => handleGenderSelect("male")}
                  />
                  <GenderOption
                    icon={<FaFemale />}
                    label="Female"
                    isSelected={formData.gender === "female"}
                    onClick={() => handleGenderSelect("female")}
                  />
                  <GenderOption
                    icon={<FaGenderless />}
                    label="Other"
                    isSelected={formData.gender === "other"}
                    onClick={() => handleGenderSelect("other")}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5E9ED9] text-white font-semibold p-3 rounded-md hover:bg-[#4a8ac9]"
              >
                Sign Up
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}


interface GenderOptionProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function GenderOption({ icon, label, isSelected, onClick }: GenderOptionProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-col items-center justify-center w-24 h-24 p-4 border rounded-md transition ${
        isSelected ? "bg-[#5E9ED9] text-white" : "bg-white border-[#5E9ED9] text-[#5E9ED9]"
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

export default SignUp;

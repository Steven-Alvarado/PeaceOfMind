import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts"; // Custom hook for accessing AuthContext
import HeaderSignUpLoginPage from "../components/HeaderSignUpLoginPage.tsx";
import FooterLandingPage from "../components/Footer";

const Login: React.FC = () => {
  return (
    <div>
      <HeaderSignUpLoginPage />
      <LoginSection />
      <div className="absolute bottom-0 w-full">
        <FooterLandingPage />
      </div>
    </div>
  );
};

const LoginSection: React.FC = () => {
  const { login } = useAuth(); // Access the login function from AuthContext
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for showing loading spinner

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true); // Set loading to true during login process
    setError(null); // Clear any previous errors

    try {
      await login(email, password); // Call the login function
      setLoading(false); // Reset loading state
    } catch (err) {
      setLoading(false); // Reset loading state
      setError("Invalid email or password"); // Display error message
    }
  };

  return (
    <section className="flex flex-row justify-center py-10 px-6 mt-48 bg-white h-full">
      <div className="bg-blue-100 rounded-lg shadow-md p-6 w-full border border-[#5E9ED9] max-w-lg text-center">
        <h2 className="text-3xl font-extrabold text-[#5E9ED9] mb-4">Log in</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 border border-[#5E9ED9] rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full bg-[#5E9ED9] text-white font-semibold p-3 rounded-md ${
              loading ? "cursor-not-allowed opacity-75" : "hover:bg-[#4a8ac9]"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;

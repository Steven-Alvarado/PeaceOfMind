import React, { useState } from "react";
import axios from "axios";
import HeaderSignUpLoginPage from "../components/HeaderSignUpLoginPage";
import FooterLandingPage from "../components/Footer";
import Lottie from "lottie-react";
import ForgotPasswordAnimation from "../assets/lotties/ForgotPasswordAnimation.json";

const ForgotPassword: React.FC = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <HeaderSignUpLoginPage />
      <ForgotPasswordSection />
      <div className="absolute bottom-0 w-full">
        <FooterLandingPage />
      </div>
    </div>
  );
};

const ForgotPasswordSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("/api/auth/check-email", { email });
      setEmailVerified(true);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Email does not exist in our system.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("/api/auth/reset-password-direct", { email, newPassword: password });
      setSuccessMessage("Your password has been reset successfully!");
      setEmailVerified(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row justify-center items-center py-10 px-6 bg-white h-full min-h-[80vh]">
      <div className="md:w-1/2 flex flex-col items-center text-center md:pr-8 mb-6 md:mb-0">
        <h1 className="text-4xl font-bold text-[#5E9ED9] mb-4">Forgot Your Password?</h1>
        <p className="text-gray-700 font-semibold mb-6">
          Don't worry! Enter your email address and reset your password easily.
        </p>
        <Lottie
          animationData={ForgotPasswordAnimation}
          loop={true}
          style={{ width: "300px", height: "300px" }}
        />
      </div>
      <div className="bg-blue-100 rounded-lg shadow-md p-6 w-full border border-[#5E9ED9] max-w-lg text-center">
        <h2 className="text-3xl font-extrabold text-[#5E9ED9] mb-4">Reset Password</h2>
        {successMessage ? (
          <p className="text-green-500">{successMessage}</p>
        ) : emailVerified ? (
          <>
            <input
              type="password"
              placeholder="New password"
              className="w-full p-3 mb-2 border border-[#5E9ED9] rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handlePasswordReset}
              className={`w-full bg-[#5E9ED9] text-white font-semibold p-3 rounded-md ${
                loading ? "cursor-not-allowed opacity-75" : "hover:bg-[#4a8ac9]"
              }`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleEmailSubmit}
              className={`w-full bg-[#5E9ED9] text-white font-semibold p-3 rounded-md ${
                loading ? "cursor-not-allowed opacity-75" : "hover:bg-[#4a8ac9]"
              }`}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </>
        )}
        {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
      </div>
    </section>
  );
};

export default ForgotPassword;

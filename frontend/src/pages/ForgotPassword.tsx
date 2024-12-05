import React from "react";
import HeaderSignUpLoginPage from "../components/HeaderSignUpLoginPage";
import FooterLandingPage from "../components/Footer";

const ForgotPassword: React.FC = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <HeaderSignUpLoginPage />
      <div className="flex items-center justify-center py-16 px-6 h-full">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-[#5E9ED9] mb-6">Forgot Password</h2>
          <p className="text-gray-600 mb-4">This is a placeholder for the Forgot Password page.</p>
        </div>
      </div>
      <FooterLandingPage />
    </div>
  );
};

export default ForgotPassword;

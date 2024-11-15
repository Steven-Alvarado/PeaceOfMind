import React from "react";
import HeaderSignUpLoginPage from "../components/headerSignUpLoginPage";
import FooterLandingPage from "../components/footerLandingPage";

const Login = () => {
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

function LoginSection() {
  return (
    <section className="flex flex-row justify-center py-10 px-6 mt-48 bg-white h-full">
      <div className="bg-blue-100 rounded-lg shadow-md p-6 w-full border border-[#5E9ED9] max-w-lg text-center">
        <h2 className="text-3xl font-extrabold text-[#5E9ED9] mb-4">Log in</h2>
        <form className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-[#5E9ED9] rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 border border-[#5E9ED9] rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-[#5E9ED9] text-white font-semibold p-3 rounded-md hover:bg-[#4a8ac9]"
          >
            Log in
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;

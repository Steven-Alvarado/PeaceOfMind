import React from "react";
import HeaderLandingPage from "../components/headerLandingPage";
import FooterLandingPage from "../components/footerLandingPage";

import Lottie from "lottie-react";
import SignUpPageAnimation from "../lotties/SignUpPageAnimation.json";

const SignUp = () => {
  return (
    <div>
      <HeaderLandingPage />
      <SignUpSection />
      <div className=" md:w-full md:fixed md:bottom-0">
        <FooterLandingPage />
      </div>
    </div>
  );
};

function SignUpSection() {
  return (
    <section className="flex flex-col items-center justify-center py-10 px-6 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-center mb-10 w-full max-w-5xl">
        <div className="text-left md:w-1/2 p-6">
          <h1 className="text-4xl font-bold text-[#5E9ED9] text-center mb-4">
            Join Peace of Mind
          </h1>
          <p className="text-gray-700 font-bold mb-6">
            Discover the benefits of being a part of our supportive community
            tailored for college students:
          </p>
          <ul className="space-y-3 font-semibold text-gray-700">
            <li>
              🌟 Access to licensed therapists who understand student life.
            </li>
            <li>📅 Daily mental health check-ins to keep you on track.</li>
            <li>
              📚 Personalized advice and resources to handle academic and social
              stress.
            </li>
            <li>
              📝 Private journaling features to track your progress over time.
            </li>
            <li>🌍 Community resources to learn from others' experiences.</li>
          </ul>
        </div>

        <div className="md:w-1/2 w-3/4 max-w-sm mx-auto md:ml-8">
          <Lottie animationData={SignUpPageAnimation} loop={true} />
        </div>
      </div>

      <div className="bg-blue-100 rounded-lg shadow-md p-6 w-full border border-[#5E9ED9] max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-[#5E9ED9] mb-4">Sign Up</h2>
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
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}

export default SignUp;

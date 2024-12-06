import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
//import ReactSpinner from "react-spinners/ClipLoader"; // React Spinners for loading

const LandingPage = lazy(() => import("../pages/landingPage"));
const ForTherapists = lazy(() => import("../pages/forTherapistsPage"));
const Login = lazy(() => import("../pages/loginPage"));
const SignUp = lazy(() => import("../pages/signUpPage"));
const SignUpSurveyPage = lazy(() => import("../pages/signUpSurveyPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const TherapistDashboard = lazy(() => import("../pages/TherapistDashboard"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));

const fadeVariants = {
  initial: { opacity: 0 }, // Start fully transparent
  animate: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } }, // Fade in
  exit: { opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }, // Fade out
};

/*const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <ReactSpinner color="#5E9ED9" size={60} />
    <p className="ml-4 text-lg font-semibold text-gray-600">Loading...</p>
  </div>
);*/

const AppRouter: React.FC = () => {
  const location = useLocation(); // Get current location for transitions

  return (
    <Suspense > 
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <LandingPage />
              </motion.div>
            }
          />
          <Route
            path="/for-therapists"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <ForTherapists />
              </motion.div>
            }
          />
          <Route
            path="/login"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/sign-up"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <SignUp />
              </motion.div>
            }
          />
          <Route
            path="/sign-up-survey"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <SignUpSurveyPage />
              </motion.div>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <ForgotPassword />
              </motion.div>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/student-dashboard"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <StudentDashboard />
              </motion.div>
            }
          />
          <Route
            path="/therapist-dashboard"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <TherapistDashboard />
              </motion.div>
            }
          />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <motion.div variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                <ErrorPage />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AppRouter;

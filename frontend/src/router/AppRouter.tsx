import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const LandingPage = lazy(() => import("../pages/landingPage"));
const ForTherapists = lazy(() => import("../pages/forTherapistsPage"));
const Login = lazy(() => import("../pages/loginPage"));
const SignUp = lazy(() => import("../pages/signUpPage"));
const SignUpSurveyPage = lazy(() => import("../pages/signUpSurveyPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const TherapistDashboard = lazy(() => import("../pages/TherapistDashboard"));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/for-therapists" element={<ForTherapists />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-up-survey" element={<SignUpSurveyPage />} />
        {/* <Route path="/student-dashboard" element={<StudentDashboard />} /> */}

        {/* Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/therapist-dashboard"
          element={
            <PrivateRoute role="therapist">
              <TherapistDashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

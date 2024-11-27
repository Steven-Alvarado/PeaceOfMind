import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import HeaderStudentDashboard from "../components/StudentDashboard/HeaderStudentDashboard";
import Footer from "../components/Footer";
import StudentMenuSection from "../components/StudentDashboard/StudentMenuSection";
import TherapistSection from "../components/StudentDashboard/TherapistSection";
import WeeklySurvey from "../components/StudentDashboard/WeeklySurvey";

const StudentDashboard: React.FC = () => {
  const { user, fetchUser } = useAuth();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (!user) {
        try {
          await fetchUser();
          console.log("User fetched successfully:", user); // Debugging after fetch
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, [user, fetchUser]);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <div>Error: Unable to load user data</div>;
  }
  

  
  return (
    <div className="student-dashboard flex flex-col min-h-screen">
      <HeaderStudentDashboard />
      <header className="bg-blue-50 p-4">
        <h1 className="text-4xl font-bold text-center text-blue-500">
          Welcome, {user.first_name} {user.last_name}!
        </h1>
      </header>
      <main className="flex flex-col-1 items-center justify-center px-6 py-10 space-y-6">
        <div className="w-full max-w-2xl">
          <TherapistSection user={user} /> {/* Pass user as a prop */}
        </div>
        <div className="w-full max-w-2xl">
          <StudentMenuSection user={user} onSurveyClick={() => setIsSurveyOpen(true)} />
        </div>
      </main>
      <Footer />
      <WeeklySurvey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} user={user} />
    </div>
  );
};

export default StudentDashboard;

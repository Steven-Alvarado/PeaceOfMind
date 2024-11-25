import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import HeaderStudentDashboard from "../components/HeaderStudentDashboard";
import Footer from "../components/Footer";
import StudentMenuSection from "../components/StudentMenuSection";
import TherapistSection from "../components/TherapistSection";
import WeeklySurvey from "../components/WeeklySurvey";

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
          Welcome, {user.first_name} {user.last_name}
        </h1>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
        <TherapistSection user={user} /> {/* Pass user as a prop */}
        <StudentMenuSection user={user} onSurveyClick={() => setIsSurveyOpen(true)} />
      </main>
      <Footer />
      <WeeklySurvey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} user={user} />
    </div>
  );
};

export default StudentDashboard;

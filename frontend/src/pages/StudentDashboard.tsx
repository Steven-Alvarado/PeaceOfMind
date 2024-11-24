import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import HeaderStudentDashboard from "../components/HeaderStudentDashboard";
import Footer from "../components/Footer";
import StudentMenuSection from "../components/StudentMenuSection";
import TherapistSection from "../components/TherapistSection";
import WeeklySurvey from "../components/WeeklySurvey";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="student-dashboard flex flex-col min-h-screen">
      <HeaderStudentDashboard />
      <header className="bg-blue-50 p-4">
        <h1 className="text-4xl font-bold text-center text-blue-500">
          Welcome, {user.firstName} {user.lastName}
        </h1>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
        <TherapistSection />
        <StudentMenuSection onSurveyClick={() => setIsSurveyOpen(true)} />
      </main>
      <Footer />
      <WeeklySurvey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} user={user} />
    </div>
  );
};

export default StudentDashboard;

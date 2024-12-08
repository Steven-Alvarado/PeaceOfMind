import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import HeaderStudentDashboard from "../components/StudentDashboard/HeaderStudentDashboard";
import Footer from "../components/Footer";
import StudentMenuSection from "../components/StudentDashboard/StudentMenuSection";
import TherapistSection from "../components/StudentDashboard/TherapistSection";

const StudentDashboard: React.FC = () => {
  const { user, fetchUser } = useAuth();
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
    <div 
    /*  className="student-dashboard flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #5E93F3, #ffffff)",
        backgroundAttachment: "fixed",
      }} */
    >
      <HeaderStudentDashboard /> 
      <main className="flex flex-col-1 items-center justify-center px-6 py-10 space-y-6 mb-11">
        <div className="w-full max-w-3xl">
          <TherapistSection user={user} /> {/* Pass user as a prop */}
        </div>
        <div className="w-full max-w-3xl">
          <StudentMenuSection user={user} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
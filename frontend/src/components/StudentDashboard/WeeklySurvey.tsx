import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { AuthContext, User } from "../../context/AuthContext";

type QuestionType = {
  id: number;
  question: string;
  answer: string | null;
};

type WeeklySurveyProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
};

const weeklyQuestions: QuestionType[] = [
  { id: 1, question: "I felt well-rested throughout the week.", answer: null },
  { id: 2, question: "I was able to manage my workload effectively this week.", answer: null },
  { id: 3, question: "I maintained meaningful connections with friends or family this week.", answer: null },
  { id: 4, question: "I could stay focused on my tasks this week.", answer: null },
  { id: 5, question: "I felt motivated to achieve my goals this week.", answer: null },
];

const assignedSurveys = [
  { id: 1, title: "Stress Management Assessment", description: "Assess your current stress levels." },
  { id: 2, title: "Weekly Mood Tracker", description: "Track your mood and emotions over the week." },
  { id: 3, title: "Anxiety Level Evaluation", description: "Evaluate your anxiety levels for this week." },
];

const WeeklySurvey: React.FC<WeeklySurveyProps> = ({ isOpen, onClose, user }) => {
  const { user: authUser } = useContext(AuthContext);
  const effectiveUser = user || authUser;

  const [questions, setQuestions] = useState<QuestionType[]>(weeklyQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [hasSubmittedThisWeek, setHasSubmittedThisWeek] = useState<boolean>(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        if (!effectiveUser) return;

        const response = await axios.get<{ surveys: any[] }>(`http://localhost:5000/api/surveys/${effectiveUser.id}`);
        const surveys = response.data.surveys;

        const thisWeek = new Date();
        const startOfWeek = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()));

        // Check if a weekly survey exists in the current week
        const hasWeeklySurvey = surveys.some((survey) => {
          const surveyDate = new Date(survey.survey_date);
          const isThisWeek = surveyDate >= startOfWeek;

          // Parse survey content to identify weekly survey questions
          const surveyContent = JSON.parse(survey.document_content || "{}");
          const questions = Object.keys(surveyContent);

          // Check for the unique weekly survey questions
          const isWeeklySurvey =
            questions.includes("I felt well-rested throughout the week.") &&
            questions.includes("I was able to manage my workload effectively this week.");

          return isThisWeek && isWeeklySurvey;
        });

        setHasSubmittedThisWeek(hasWeeklySurvey);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, [effectiveUser]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentQuestionIndex(0);
      setSubmitStatus("idle");
      setQuestions(weeklyQuestions.map((q) => ({ ...q, answer: null })));
    }
  }, [isOpen]);

  const handleAnswer = (id: number, answer: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!effectiveUser) return;

    setIsSubmitting(true);
    try {
      const surveyContent = questions.reduce((content, q) => {
        content[q.question] = q.answer;
        return content;
      }, {} as Record<string, string>);

      await axios.post(
        "http://localhost:5000/api/surveys",
        {
          userId: effectiveUser.id,
          content: JSON.stringify(surveyContent),
        },
        {
          headers: {
            Authorization: `Bearer ${effectiveUser.token}`,
          },
        }
      );
      setSubmitStatus("success");
      setHasSubmittedThisWeek(true);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !effectiveUser) {
    return null;
  }

  if (hasSubmittedThisWeek) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-lg w-full max-w-2xl shadow-lg p-6"
        >
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">This week's survey has already been submitted!</h3>
            <p className="text-gray-600 mt-2">Please check back next week to complete another survey.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">Weekly Survey</h2>

          {submitStatus === "idle" ? (
            <>
              <div className="mb-8">
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-[#5E9ED9] rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <motion.div key={currentQuestionIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex].question}</h3>
                <div className="space-y-3">
                  {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(questions[currentQuestionIndex].id, option)}
                      className={`block w-full text-left px-4 py-2 rounded-md ${
                        questions[currentQuestionIndex].answer === option
                          ? "bg-blue-100 border border-blue-500"
                          : "bg-gray-100 border border-gray-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={currentQuestionIndex === questions.length - 1 ? handleSubmit : handleNext}
                  disabled={!questions[currentQuestionIndex].answer || isSubmitting}
                  className="px-6 py-2 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] disabled:opacity-50"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit"
                    : "Next"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              {submitStatus === "success" ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Thank you for your feedback!</h3>
                  <p className="text-gray-600 mt-2">Your responses have been recorded successfully.</p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Submission failed</h3>
                  <p className="text-gray-600 mt-2">Please try again later.</p>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WeeklySurvey;

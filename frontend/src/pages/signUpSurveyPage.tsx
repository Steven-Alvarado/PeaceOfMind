import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import HeaderSignUpLoginPage from "../components/HeaderSignUpLoginPage";
import FooterLandingPage from "../components/Footer";
import axios from "axios";

type QuestionType = {
  id: number;
  question: string;
  answer: string | null;
};

const initialQuestions: QuestionType[] = [
  { id: 1, question: "I often feel sad, restless, or emotionally drained.", answer: null },
  { id: 2, question: "I spend a significant amount of time alone and disconnected from others.", answer: null },
  { id: 3, question: "I feel confident in myself and my abilities.", answer: null },
  { id: 4, question: "I experience challenges in building and maintaining relationships.", answer: null },
  { id: 5, question: "I frequently express emotions through yelling, complaining, or crying.", answer: null },
  { id: 6, question: "I have noticed sudden changes in my eating patterns.", answer: null },
  { id: 7, question: "I have engaged in behaviors involving drugs or alcohol.", answer: null },
  { id: 8, question: "I often feel overwhelmed or stressed by my responsibilities.", answer: null },
  { id: 9, question: "I frequently feel anxious or overly worried about things.", answer: null },
];

const answerOptions = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const SignUpSurveyPage = () => {
  const [questions, setQuestions] = useState<QuestionType[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAnswer = (id: number, answer: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer } : q))
    );
    setError(null); // Clear error when an answer is provided
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
    // Validate that all questions have been answered
    if (questions.some((q) => q.answer === null)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const surveyContent = questions.reduce((content, q) => {
        content[`question${q.id}`] = q.answer;
        return content;
      }, {} as Record<string, string>);

      await axios.post("/api/surveys", {
        userId: user?.id,
        content: surveyContent,
      });

      setSubmitStatus("success");
      setTimeout(() => {
        navigate("/student-dashboard"); // Redirect after success
      }, 2000);
    } catch (err: any) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
    
    <div className="flex-grow flex items-center justify-center py-48">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto p-8 mb-20"
      >
        {submitStatus === "idle" ? (
          <>
            <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
              New User Survey
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-[#5E9ED9] rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 mb-4 text-center">{error}</p>
            )}

            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold mb-4">
                {questions[currentQuestionIndex].question}
              </h3>
              <div className="space-y-3">
                {answerOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      handleAnswer(questions[currentQuestionIndex].id, option)
                    }
                    className={`w-full px-4 py-2 rounded-md text-left ${
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

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={
                  currentQuestionIndex === questions.length - 1
                    ? handleSubmit
                    : handleNext
                }
                disabled={
                  questions[currentQuestionIndex].answer === null ||
                  isSubmitting
                }
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
          <div className="text-center max-w-2xl py-48">
            {submitStatus === "success" ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">
                  Thank you for completing the survey!
                </h3>
                <p className="text-gray-600 mt-2">
                  Redirecting to your dashboard...
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Submission failed</h3>
                <p className="text-gray-600 mt-2">
                  Please try again later.
                </p>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
    <FooterLandingPage />
  </div>
);
};

export default SignUpSurveyPage;

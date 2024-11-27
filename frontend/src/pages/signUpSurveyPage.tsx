import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Assuming this handles user authentication
import HeaderSignUpLoginPage from "../components/HeaderSignUpLoginPage";
import FooterLandingPage from "../components/Footer";
import axios from "axios";

type QuestionType = {
  id: number;
  question: string;
  answer: boolean | null;
};

const initialQuestions: QuestionType[] = [
  { id: 1, question: "Do you often seem sad, tired, restless, or out of sorts?", answer: null },
  { id: 2, question: "Do you spend a lot of time alone?", answer: null },
  { id: 3, question: "Have low self-esteem?", answer: null },
  { id: 4, question: "Have trouble getting along with family, friends, and peers?", answer: null },
  { id: 5, question: "Have frequent outbursts of shouting, complaining, or crying?", answer: null },
  { id: 6, question: "Show sudden changes of eating patterns?", answer: null },
  { id: 7, question: "Show signs of using drugs and/or alcohol?", answer: null },
  { id: 8, question: "Feel overwhelmed or stressed often?", answer: null },
  { id: 9, question: "Feel anxious or worried frequently?", answer: null },
];

const SignUpSurveyPage = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming user is available after sign-up

  const handleAnswer = (id: number, answer: boolean) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)));
    setError(null); // Clear error when an answer is provided
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all questions have been answered
    if (questions.some((q) => q.answer === null)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    // Prepare survey content for submission
    const surveyContent = questions.reduce((content, q) => {
      content[`question${q.id}`] = q.answer ? "Yes" : "No";
      return content;
    }, {} as Record<string, string>);

    try {
      await axios.post("/api/surveys", {
        userId: user?.id,
        content: surveyContent,
      });
      navigate("/student-dashboard"); // Redirect to the dashboard or desired page
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit survey. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSignUpLoginPage />
      <div className="flex-grow flex items-center justify-center bg-blue-50 py-10">
        <SurveySection questions={questions} onAnswer={handleAnswer} onSubmit={handleSubmit} error={error} />
      </div>
      <FooterLandingPage />
    </div>
  );
};

const SurveySection = ({
  questions,
  onAnswer,
  onSubmit,
  error,
}: {
  questions: QuestionType[];
  onAnswer: (id: number, answer: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}) => {
  return (
    <section className="bg-blue-100 p-6 rounded-lg shadow-md w-full max-w-3xl">
      <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
        New User - Survey
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form className="space-y-4" onSubmit={onSubmit}>
        {questions.map(({ id, question, answer }) => (
          <div
            key={id}
            className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm"
          >
            <span className="text-lg">{question}</span>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => onAnswer(id, true)}
                className={`px-4 py-2 rounded-md ${
                  answer === true
                    ? "bg-blue-100 border border-[#44719b]"
                    : "bg-gray-100 border border-gray-400"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onAnswer(id, false)}
                className={`px-4 py-2 rounded-md ${
                  answer === false
                    ? "bg-blue-100 border border-[#44719b]"
                    : "bg-gray-100 border border-gray-400"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-2/4 bg-[#5E9ED9] text-white font-semibold p-3 rounded-md hover:bg-[#4a8ac9]"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignUpSurveyPage;

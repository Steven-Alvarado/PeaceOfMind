import React, { useState } from "react";
import axios from "axios";
import { User } from "../../context/AuthContext"; // Use the User type from AuthContext

type QuestionType = {
  id: number;
  question: string;
  answer: boolean | null;
};

type WeeklySurveyProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // Use the User type from AuthContext
};

const weeklyQuestions: QuestionType[] = [
  { id: 1, question: "Are you feeling well-rested this week?", answer: null },
  { id: 2, question: "Did you feel overwhelmed at work or school?", answer: null },
  { id: 3, question: "Have you been able to connect with friends or family?", answer: null },
  { id: 4, question: "Are you able to focus on your tasks?", answer: null },
  { id: 5, question: "Do you feel motivated to achieve your goals?", answer: null },
];

const WeeklySurvey: React.FC<WeeklySurveyProps> = ({ isOpen, onClose, user }) => {
  const [questions, setQuestions] = useState<QuestionType[]>(weeklyQuestions);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) {
    return null;
  }

  const handleAnswer = (id: number, answer: boolean) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)));
    setError(null);
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
      setIsSubmitting(true);
      await axios.post(
        "http://localhost:5000/api/surveys",
        {
          userId: user.id,
          content: JSON.stringify(surveyContent),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Use token for authentication
          },
        }
      );
      alert("Survey submitted successfully!");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
        >
          &#x2715;
        </button>
        <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
          Weekly Survey
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map(({ id, question, answer }) => (
            <div
              key={id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm"
            >
              <span className="text-lg">{question}</span>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleAnswer(id, true)}
                  className={`px-4 py-2 rounded-md ${
                    answer === true
                      ? "bg-blue-100 border border-blue-500"
                      : "bg-gray-100 border border-gray-400"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer(id, false)}
                  className={`px-4 py-2 rounded-md ${
                    answer === false
                      ? "bg-blue-100 border border-blue-500"
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
              disabled={isSubmitting}
              className="bg-[#5E9ED9] text-white px-6 py-2 rounded-md hover:bg-[#4a8ac9] disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklySurvey;

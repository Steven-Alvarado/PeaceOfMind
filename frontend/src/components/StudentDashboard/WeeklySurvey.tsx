import React, { useState, useContext } from "react";
import axios from "axios";
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !effectiveUser) {
    return null;
  }

  const handleAnswer = (id: number, answer: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer } : q))
    );
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (questions.some((q) => !q.answer)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const surveyContent = questions.reduce((content, q) => {
      content[q.question] = q.answer;
      return content;
    }, {} as Record<string, string>);

    try {
      setIsSubmitting(true);
      await axios.post(
        "http://localhost:5000/api/surveys",
        {
          userId: effectiveUser.id,
          content: JSON.stringify(surveyContent),
        },
        {
          headers: {
            Authorization: `Bearer ${effectiveUser.token}`, // Use token for authentication
          },
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative bg-white rounded-lg w-full max-w-3xl shadow-lg overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
        >
          &#x2715;
        </button>
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
            Weekly Survey
          </h2>

          {isSubmitted ? (
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-green-600">
                Survey Submitted!
              </h3>
              <p className="text-gray-700 mt-4">
                You have successfully submitted your survey for this week. Thank you for your time!
              </p>
            </div>
          ) : (
            <>
              {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                {questions.map(({ id, question, answer }) => (
                  <div
                    key={id}
                    className="flex flex-col items-start bg-gray-100 p-4 rounded-md shadow-sm"
                  >
                    <span className="text-lg">{question}</span>
                    <div className="flex space-x-2 mt-2">
                      {[
                        "Strongly Disagree",
                        "Disagree",
                        "Neutral",
                        "Agree",
                        "Strongly Agree",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleAnswer(id, option)}
                          className={`px-4 py-2 rounded-md ${
                            answer === option
                              ? "bg-blue-100 border border-blue-500"
                              : "bg-gray-100 border border-gray-400"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
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
            </>
          )}

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-center text-[#5E9ED9] mb-4">
              Therapist Assigned Surveys
            </h3>
            <div className="grid gap-4">
              {assignedSurveys.map(({ id, title, description }) => (
                <div
                  key={id}
                  className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{title}</h4>
                    <p className="text-gray-600">{description}</p>
                  </div>
                  <button
                    className="bg-[#5E9ED9] text-white px-4 py-2 rounded-md hover:bg-[#4a8ac9]"
                    onClick={() => alert(`Viewing ${title}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySurvey;

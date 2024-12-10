import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { AuthContext, User } from "../../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

type QuestionType = {
  id: number;
  question: string;
  answer: string | null;
};

type SurveyHistoryType = {
  id: number;
  document_type: string;
  survey_date: string;
  document_content: Record<string, string>;
};

type DailySurveyProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
};

const dailyQuestions: QuestionType[] = [
  { id: 1, question: "I felt well-rested today.", answer: null },
  { id: 2, question: "I was able to manage my workload effectively today.", answer: null },
  { id: 3, question: "I maintained meaningful connections with friends or family today.", answer: null },
  { id: 4, question: "I could stay focused on my tasks today.", answer: null },
  { id: 5, question: "I felt motivated to achieve my goals today.", answer: null },
];

const DailySurvey: React.FC<DailySurveyProps> = ({ isOpen, onClose, user }) => {
  const { user: authUser } = useContext(AuthContext);
  const effectiveUser = user || authUser;

  const [activeTab, setActiveTab] = useState<"takeSurvey" | "history">("takeSurvey");
  const [questions, setQuestions] = useState<QuestionType[]>(dailyQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [surveyHistory, setSurveyHistory] = useState<SurveyHistoryType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const checkTodaySubmission = async () => {
      if (!effectiveUser) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/surveys/weekly/user/${effectiveUser.id}`
        );

        const today = new Date().toISOString().slice(0, 10);
        const todaySurvey = response.data.surveys.find(
          (survey: any) =>
            new Date(survey.survey_date).toISOString().slice(0, 10) === today
        );

        setHasSubmittedToday(!!todaySurvey);
      } catch (error) {
        console.error("Error checking today's survey:", error);
      }
    };

    if (isOpen) {
      checkTodaySubmission();
    }
  }, [isOpen, effectiveUser]);

  const fetchSurveyHistory = async (date: Date) => {
    if (!effectiveUser) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/surveys/weekly/user/${effectiveUser.id}`
      );

      const selectedDateStr = date.toISOString().slice(0, 10);
      const filteredSurvey = response.data.surveys.find(
        (survey: any) =>
          new Date(survey.survey_date).toISOString().slice(0, 10) === selectedDateStr
      );

      setSurveyHistory(filteredSurvey ? [filteredSurvey] : []);
    } catch (error) {
      console.error("Error fetching survey history:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "history" && isOpen) {
      fetchSurveyHistory(selectedDate);
    }
  }, [activeTab, selectedDate, isOpen]);

  const handleAnswer = (id: number, answer: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer } : q)));
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
        `${API_BASE_URL}/api/surveys/weekly`,
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
      setHasSubmittedToday(true);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSurveyHistory = () => (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Date</label>
        <input
          type="date"
          value={selectedDate.toISOString().slice(0, 10)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {surveyHistory.length > 0 ? (
        surveyHistory.map((survey) => (
          <div key={survey.id} className="relative">
            <motion.div
              className="relative flex gap-4 mb-4 bg-white p-4 rounded-lg shadow-md cursor-pointer"
              onClick={() => setExpandedId(expandedId === survey.id ? null : survey.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-[#5E9ED9] rounded-full flex items-center justify-center text-white">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{survey.document_type}</h3>
                  {expandedId === survey.id ? <ChevronUp /> : <ChevronDown />}
                </div>
                <p className="text-gray-600">{new Date(survey.survey_date).toLocaleDateString()}</p>
              </div>
            </motion.div>
            <AnimatePresence>
              {expandedId === survey.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50 rounded-lg p-4 shadow-inner"
                >
                  {Object.entries(survey.document_content).map(([question, answer]) => (
                    <div key={question} className="mb-2">
                      <p className="text-sm font-medium text-gray-600">{question}</p>
                      <p className="text-sm text-gray-800">{answer}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No survey found for the selected date.</p>
      )}
    </div>
  );

  if (!isOpen || !effectiveUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg w-full max-w-3xl shadow-lg"
        style={{ height: "60vh", overflowY: "auto" }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full">
          <X size={20} className="text-gray-500" />
        </button>
        <div className="flex justify-center border-b">
          <button
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "takeSurvey" ? "text-[#5E9ED9] border-b-2 border-[#5E9ED9]" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("takeSurvey")}
          >
            Take Survey
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "history" ? "text-[#5E9ED9] border-b-2 border-[#5E9ED9]" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Survey History
          </button>
        </div>
        <div className="p-6">{activeTab === "takeSurvey" ? hasSubmittedToday ? (
          <div className="text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Today's survey has already been submitted!</h3>
          </div>
        ) : (
          <>
            <div className="h-2 bg-gray-100 rounded-full mb-4">
              <div
                className="h-2 bg-[#5E9ED9] rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex].question}</h3>
              <div className="space-y-3">
                {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(questions[currentQuestionIndex].id, option)}
                    className={`block w-full px-4 py-2 rounded-md ${
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
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={
                  currentQuestionIndex === questions.length - 1
                    ? handleSubmit
                    : () => setCurrentQuestionIndex((prev) => prev + 1)
                }
                disabled={!questions[currentQuestionIndex].answer || isSubmitting}
                className="px-6 py-2 bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4a8ac9] disabled:opacity-50"
              >
                {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </>
        ) : renderSurveyHistory()}</div>
      </motion.div>
    </div>
  );
};

export default DailySurvey;

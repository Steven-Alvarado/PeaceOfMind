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

const normalizeSurveyDateToEST = (date: string | Date): string => {
  // Parse the UTC date string to a Date object
  const utcDate = new Date(date);

  // Subtract one day from the UTC date
  const adjustedDate = new Date(utcDate);
  adjustedDate.setUTCDate(adjustedDate.getUTCDate() );

  // Convert the adjusted date to the local EST timezone
  const localDate = new Date(
    adjustedDate.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  // Format the adjusted date to YYYY-MM-DD
  return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
};


const normalizeDate = (date: string | Date): string => {
  const dateObject = new Date(date); // Parse the UTC date
  // Convert the date to the user's local timezone (e.g., EST)
  const localDate = new Date(
    dateObject.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  // Format the date to YYYY-MM-DD
  return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
};


const DailySurvey: React.FC<DailySurveyProps> = ({ isOpen, onClose, user }) => {
  const { user: authUser } = useContext(AuthContext);
  const effectiveUser = user || authUser;

  const [activeTab, setActiveTab] = useState<"takeSurvey" | "history">("takeSurvey");
  const [questions, setQuestions] = useState<QuestionType[]>(dailyQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyHistory, setSurveyHistory] = useState<SurveyHistoryType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkIfSurveyExistsForToday();
      fetchSurveyHistory();
    }
  }, [isOpen]);

  const fetchSurveyHistory = async () => {
    if (!effectiveUser) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/surveys/weekly/user/${effectiveUser.id}`, {
        headers: { Authorization: `Bearer ${effectiveUser.token}` },
      });
      setSurveyHistory(response.data.surveys);
    } catch (error) {
      console.error("Error fetching survey history:", error);
    }
  };

  const checkIfSurveyExistsForToday = async () => {
    if (!effectiveUser) return;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/api/surveys/weekly/user/${effectiveUser.id}`, {
        headers: { Authorization: `Bearer ${effectiveUser.token}` },
      });
  
      const today = normalizeDate(new Date());
      console.log("Normalized today's date (EST):", today);
  
      const surveys = response.data.surveys;
      console.log("Fetched surveys from API:", surveys);
  
      const surveyForToday = surveys.find((survey: SurveyHistoryType) => {
        const normalizedSurveyDate = normalizeSurveyDateToEST(survey.survey_date);
        console.log(
          `Comparing survey date (UTC: ${survey.survey_date} | Normalized: ${normalizedSurveyDate}) with today's date (${today})`
        );
        return normalizedSurveyDate === today;
      });
  
      console.log("Survey for today (if found):", surveyForToday);
  
      setHasSubmittedToday(!!surveyForToday);
    } catch (error) {
      console.error("Error checking today's survey:", error);
    }
  };
  
  


  const handleSubmit = async () => {
    if (!effectiveUser) return;

    setIsSubmitting(true);

    const content = questions.reduce((acc, question) => {
      if (question.answer) {
        acc[question.question] = question.answer;
      }
      return acc;
    }, {} as Record<string, string>);

    if (Object.keys(content).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      userId: effectiveUser.id,
      content,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/surveys/weekly`, payload, {
        headers: {
          Authorization: `Bearer ${effectiveUser.token}`,
          "Content-Type": "application/json",
        },
      });

      setHasSubmittedToday(true);
      setQuestions(dailyQuestions.map((q) => ({ ...q, answer: null })));
      fetchSurveyHistory();
    } catch (error) {
      console.error("Error submitting survey:", error.response || error.message);
      alert("Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSurveyHistory = () => {
    const filteredSurvey = surveyHistory.find((survey) => {
      if (!selectedDate) return true;
  
      // Adjust the survey date and selected date to EST
      const surveyDateAdjusted = normalizeDate(new Date(survey.survey_date));
      const selectedDateNormalized = normalizeDate(selectedDate);
  
      // Debugging logs
      console.log("Filtering by date:");
      console.log("Survey Date (Adjusted to EST):", surveyDateAdjusted);
      console.log("Selected Date (Normalized to EST):", selectedDateNormalized);
  
      // Compare the adjusted dates
      return surveyDateAdjusted === selectedDateNormalized;
    });
  
    return (
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by date</label>
          <input
            type="date"
            value={selectedDate ? normalizeDate(selectedDate) : ""}
            onChange={(e) => {
              const inputDate = e.target.value;
              if (inputDate) {
                const [year, month, day] = inputDate.split("-");
                setSelectedDate(new Date(Number(year), Number(month) - 1, Number(day)));
              }
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
  
        <div className="bg-gray-100 p-4 rounded-lg shadow-md" style={{ minHeight: "200px" }}>
          {filteredSurvey ? (
            <div>
              <motion.div
                className="flex gap-4 bg-white p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => setExpandedId(expandedId === filteredSurvey.id ? null : filteredSurvey.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-[#5E9ED9] rounded-full flex items-center justify-center text-white">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{filteredSurvey.document_type}</h3>
                  <p className="text-gray-600">
                    {normalizeDate(new Date(filteredSurvey.survey_date))}
                  </p>
                </div>
                {expandedId === filteredSurvey.id ? <ChevronUp /> : <ChevronDown />}
              </motion.div>
              <AnimatePresence>
                {expandedId === filteredSurvey.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-gray-50 rounded-lg shadow-inner"
                  >
                    {Object.entries(filteredSurvey.document_content).map(([question, answer]) => (
                      <div key={question} className="mb-2">
                        <p className="text-sm font-medium text-gray-600">{question}</p>
                        <p className="text-sm text-gray-800">{answer}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-gray-500">No survey found for the selected date.</p>
          )}
        </div>
      </div>
    );
  };
  
  
  

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
        <div className="p-6">
          {activeTab === "takeSurvey" ? (
            hasSubmittedToday ? (
              <div className="text-center">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">You've already submitted today's survey.</h3>
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
                        onClick={() =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === questions[currentQuestionIndex].id ? { ...q, answer: option } : q
                            )
                          )
                        }
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
            )
          ) : (
            renderSurveyHistory()
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DailySurvey;

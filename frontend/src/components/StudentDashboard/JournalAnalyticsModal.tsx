import React, { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as chartjs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import axios from "axios";

chartjs.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

interface JournalAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: number; name: string }; 
}

interface JournalEntry {
  mood: string;
  created_at: string;
}

interface SurveyEntry {
  survey_date: string;
  document_content: Record<string, string>;
}

const answerMapping = {
  "Strongly Disagree": 1,
  "Disagree": 2,
  "Neutral": 3,
  "Agree": 4,
  "Strongly Agree": 5,
};

const reverseMapping = ["", "Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

const JournalAnalyticsModal: React.FC<JournalAnalyticsModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<"journalAnalytics" | "surveyAnalytics">("journalAnalytics");
  const [moodData, setMoodData] = useState<Record<string, { count: number; dates: string[] }>>({});
  const [surveyData, setSurveyData] = useState<SurveyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    if (isOpen && user?.id) {
      if (activeTab === "journalAnalytics") {
        fetchMoodData();
      } else if (activeTab === "surveyAnalytics") {
        fetchSurveyData();
      }
    }
  }, [isOpen, activeTab, user?.id]);

  const fetchMoodData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/journals/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });

      const journals: JournalEntry[] = response.data.journals;

      const moodCounts = journals.reduce(
        (acc: Record<string, { count: number; dates: string[] }>, journal) => {
          if (!acc[journal.mood]) {
            acc[journal.mood] = { count: 0, dates: [] };
          }
          acc[journal.mood].count += 1;
          acc[journal.mood].dates.push(new Date(journal.created_at).toLocaleDateString());
          return acc;
        },
        {}
      );

      setMoodData(moodCounts);
      setTotalEntries(journals.length);
    } catch (error) {
      console.error("Failed to fetch journal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/surveys/weekly/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });

      const surveys: SurveyEntry[] = response.data.surveys;
      setSurveyData(surveys);
    } catch (error) {
      console.error("Failed to fetch survey data:", error);
    } finally {
      setLoading(false);
    }
  };

  const moodChartData = {
    labels: Object.keys(moodData),
    datasets: [
      {
        data: Object.values(moodData).map((mood) => mood.count),
        backgroundColor: ["#FFD700", "#87CEFA", "#D3D3D3", "#FF6347", "#6495ED"],
        hoverBackgroundColor: ["#FFC700", "#76BEEA", "#C3C3C3", "#FF5247", "#5485D5"],
      },
    ],
  };

  const surveyChartData = {
    labels: surveyData.map((survey) => new Date(survey.survey_date).toLocaleDateString()),
    datasets: Object.keys(surveyData[0]?.document_content || {}).map((question, index) => ({
      label: question,
      data: surveyData.map((survey) => answerMapping[survey.document_content[question]] || 0),
      borderColor: `hsl(${(index * 50) % 360}, 70%, 50%)`,
      fill: false,
      tension: 0.2,
    })),
  };

  const surveyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          callback: function (value: number) {
            return reverseMapping[value];
          },
        },
      },
    },
    plugins: {
      legend: { position: "bottom" },
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg w-full max-w-3xl shadow-lg" style={{ height: "70vh" }}>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
        >
          &#x2715;
        </button>
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab("journalAnalytics")}
              className={`px-4 py-2 text-lg font-semibold ${
                activeTab === "journalAnalytics" ? "text-[#5E9ED9] border-b-2 border-[#5E9ED9]" : "text-gray-600"
              }`}
            >
              Journal Analytics
            </button>
            <button
              onClick={() => setActiveTab("surveyAnalytics")}
              className={`px-4 py-2 text-lg font-semibold ${
                activeTab === "surveyAnalytics" ? "text-[#5E9ED9] border-b-2 border-[#5E9ED9]" : "text-gray-600"
              }`}
            >
              Survey Analytics
            </button>
          </div>

          {activeTab === "journalAnalytics" ? (
            loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div>
                <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">Mood Analysis</h2>
                <div className="flex justify-center">
                  <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
                    <Pie data={moodChartData} />
                  </div>
                </div>
                <p className="mt-6 text-center text-gray-700">
                  The chart above provides insights into your mood trends based on journal entries.
                </p>
              </div>
            )
          ) : loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div>
              <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">Survey Analysis</h2>
              <div className="relative" style={{ height: "400px" }}>
                <Line data={surveyChartData} options={surveyChartOptions} />
              </div>
              <p className="mt-6 text-center text-gray-700">
                The graph above shows your survey responses over time. Each line represents a question.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalAnalyticsModal;

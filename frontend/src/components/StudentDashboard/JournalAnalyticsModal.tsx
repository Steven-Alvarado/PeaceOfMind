import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as chartjs, ArcElement, Tooltip, Legend } from "chart.js";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

chartjs.register(ArcElement, Tooltip, Legend);

interface JournalAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JournalEntry {
  mood: string;
  created_at: string;
}

const JournalAnalyticsModal: React.FC<JournalAnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<
    Record<string, { count: number; dates: string[] }>
  >({});
  const [loading, setLoading] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchMoodData();
    }
  }, [isOpen, user?.id]);

  const fetchMoodData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/journals/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const journals: JournalEntry[] = response.data.journals;

      const moodCounts = journals.reduce(
        (acc: Record<string, { count: number; dates: string[] }>, journal) => {
          if (!acc[journal.mood]) {
            acc[journal.mood] = { count: 0, dates: [] };
          }
          acc[journal.mood].count += 1;
          acc[journal.mood].dates.push(
            new Date(journal.created_at).toLocaleDateString()
          );
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

  const data = {
    labels: Object.keys(moodData),
    datasets: [
      {
        data: Object.values(moodData).map((mood) => mood.count),
        backgroundColor: ["#FFD700", "#87CEFA", "#D3D3D3", "#FF6347", "#6495ED"],
        hoverBackgroundColor: ["#FFC700", "#76BEEA", "#C3C3C3", "#FF5247", "#5485D5"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const mood = tooltipItem.label;
            const value = tooltipItem.raw;
            const percentage = ((value / totalEntries) * 100).toFixed(2);
            const dates = moodData[mood]?.dates.join(", ") || "No dates available";
            return `${mood}: ${value} entries (${percentage}%)\nDates: ${dates}`;
          },
        },
      },
    },
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{ marginTop: "80px" }}
    >
      <div
        className="relative bg-white rounded-lg w-full max-w-3xl shadow-lg"
        style={{ height: "auto", maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black text-lg p-2 m-2 hover:text-gray-900"
        >
          &#x2715;
        </button>
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
            Mood Analysis
          </h2>
          <div className="border-t border-gray-300 mt-2 mb-6"></div>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="flex justify-center">
              <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
                <Pie data={data} options={options} />
              </div>
            </div>
          )}
          {!loading && (
            <p className="mt-6 text-center text-gray-700">
              The chart above provides insights into your mood
              trends based on journal entries. 
              Hover over a section to see the number of entries, their percentage, and the dates they were made.
              You may also click on any mood in the legend to toggle visibility.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalAnalyticsModal;

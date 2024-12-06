import React, { useState, useEffect } from "react";
import { FaDiscourse } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

interface ReviewModalProps {
  isOpen: boolean;
  therapistId: number;
  sentReview: () => void;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  therapistId,
  sentReview,
  onClose,
}) => {
  const { user, fetchUser } = useAuth();
  const [reviewText, setReviewText] = useState(""); // State to hold the typed text
  const [rating, setRating] = useState(1); // State to hold the selected rating

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
    };
    initializeUser();
  }, [user, fetchUser]);

  const submitReview = async (
    studentId: number,
    therapistId: number,
    rating: number,
    review: string
  ) => {
    try {
      const response = await axios.post("/api/reviews/submitReview", {
        student_id: studentId,
        therapist_id: therapistId,
        rating: rating,
        review_text: review,
      });
      console.log("Request successful:", response.data);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const confirmReview = () => {
    sentReview();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Review Assigned Therapist</h2>
          {user ? (
            <div className="flex flex-col items-center w-full">
              <h1 className="mb-4 text-lg">
                Use this space to submit a review
              </h1>
              <div className="flex items-center w-full mb-4">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded"
                  placeholder="Type your review here..."
                  rows={5}
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="ml-4 p-2 border border-gray-300 rounded bg-white"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  submitReview(user.id, therapistId, rating, reviewText);
                  confirmReview();
                  onClose();
                }}
                className="mt-4 w-40 bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                <div className="flex justify-center items-center space-x-2 p-1">
                  <div className="font-bold">Submit Review</div>
                  <FaDiscourse className="mt-0.5" />
                </div>
              </button>
            </div>
          ) : (
            <span>Loading review space...</span>
          )}
          <button
            onClick={() => {
              onClose();
            }}
            className="mt-20 w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default ReviewModal;

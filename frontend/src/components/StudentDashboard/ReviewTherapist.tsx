import React, { useState, useEffect } from "react";
import { FaDiscourse } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface ReviewModalProps {
  isOpen: boolean;
  therapistId: number;
  sentReview: () => void;
  onClose: () => void;
  therapistName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  therapistId,
  sentReview,
  onClose,
}) => {
  const { user, fetchUser } = useAuth();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  

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
      const response = await axios.post(`${API_BASE_URL}/api/reviews/submitReview`, {
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

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#5E9ED9] font-bold">Review Your Therapist</h2>
            <button
              className="text-black px-2 rounded hover:text-gray-900"
              onClick={onClose}
            >
              X
            </button>
          </div>
          {user ? (
            <div className="">
              <div className="flex items-center space-x-2">
                <p className="text-lg mr-2">Rating:</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FaStar
                      key={value}
                      className={`text-3xl cursor-pointer ${
                        value <= rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      onClick={() => handleStarClick(value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mt-5 text-lg">Review:</p>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="flex-grow p-2 border w-full border-[#5E9ED9] rounded"
                  placeholder="Type your review here..."
                  rows={5}
                />
              </div>

              <div className="justify-center flex">
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
            </div>
          ) : (
            <span>Loading review space...</span>
          )}
        </div>
      </div>
    )
  );
};

export default ReviewModal;

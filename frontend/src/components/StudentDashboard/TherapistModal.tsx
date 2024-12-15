import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import ProfilePicture from "../ProfilePicture";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, AlertCircle } from "lucide-react";
interface TherapistModalProps {
  isOpen: boolean;
  refresh: boolean;
  sentAlert: () => void;
  onClose: () => void;
}
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TherapistModal: React.FC<TherapistModalProps> = ({
  isOpen,
  refresh,
  sentAlert,
  onClose,
}) => {
  const { user, fetchUser } = useAuth();
  const [therapists, setTherapists] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(
    null
  );
  const itemsPerPage = 4;

  useEffect(() => {
    const initializeUser = async () => {
      if (!user) {
        try {
          await fetchUser();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    initializeUser();
  }, [user, fetchUser]);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      if (user) fetchTherapists();
    }
  }, [isOpen, user, refresh]);

  const fetchTherapists = async () => {
    try {
      const response1 = await fetch(
        `${API_BASE_URL}/api/therapists/available`
      );
      if (!response1.ok) throw new Error("Failed to fetch therapists");
      const data1 = await response1.json();

      let relationshipData = null;
      try {
        const response2 = await fetch(
          `${API_BASE_URL}/api/relationships/${user.id}`
        );
        if (response2.ok) {
          const data2 = await response2.json();
          relationshipData = data2.relationship || null;
        } else if (response2.status === 404) {
          console.log("No existing relationship found for user.");
        } else {
          throw new Error("Failed to fetch relationships");
        }
      } catch (error) {
        console.error("Error fetching relationships:", error);
      }

      const activeTherapistId = relationshipData?.current_therapist_id || null;
      const filteredTherapists = data1.therapists.filter(
        (therapist: any) => therapist.id !== activeTherapistId
      );

      setTherapists(filteredTherapists || []);
      setRelations(relationshipData || {});
    } catch (error) {
      console.error("Error fetching therapists:", error);
    }
  };

  const requestStatus = (therapistId: number) => {
    if (
      relations.requested_therapist_id != null &&
      therapistId === relations.requested_therapist_id
    ) {
      return (
        <span className="text-blue-600 text-sm font-medium">
          Request Status: {relations.status}
        </span>
      );
    } else {
      return <></>;
    }
  };

  const requestTherapist = async (studentId: number, therapistId: number) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/relationships/request`,
        {
          studentId: studentId,
          therapistId: therapistId,
        }
      );
      setRelations({
        ...relations,
        requested_therapist_id: therapistId,
        status: "pending",
      });
      sentAlert();
      onClose(); // Close the modal after sending the request
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const switchTherapist = async (studentId: number, therapistId: number) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/relationships/${studentId}/request-switch`,
        {
          requestedTherapistId: therapistId,
        }
      );
      sentAlert();
      onClose();
    } catch (error) {
      console.error("Error making PUT request:", error);
    }
  };

  const openReviewsModal = (therapistId: number) => {
    setSelectedTherapistId(therapistId);
    setIsReviewsModalOpen(true);
  };

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setSelectedTherapistId(null);
  };

  const checkPending = () => relations.status === "pending";

  const filteredTherapists = therapists.filter(
    (therapist) =>
      therapist.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      therapist.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTherapists = filteredTherapists.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-[#5E9ED9] font-bold">
              Available Therapists
            </h2>
            <button
              className="text-black px-2 rounded hover:text-gray-900"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-[#5E9ED9] rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#5E9ED9]"
            />
          </div>
          <div className="h-[480px] overflow-y-auto">
            {filteredTherapists.length === 0 ? (
              <p className="text-center text-gray-500">
                No therapists match your search.
              </p>
            ) : (
              <ul className="space-y-4">
                {currentTherapists.map((therapist) => (
                  <li
                    key={therapist.id}
                    className="flex items-center justify-between bg-blue-100 py-2 px-5 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-4 px-2">
                      <ProfilePicture
                        userRole="therapist"
                        therapistId={therapist.id}
                        className="rounded-full shadow-md"
                        style={{ width: "60px", height: "60px" }}
                      />
                      <div>
                        <p className="font-bold text-gray-800">{`${therapist.first_name} ${therapist.last_name}`}</p>
                        <p className="text-sm text-gray-500">{`Specialization: ${therapist.specialization}`}</p>
                        <p className="text-sm text-gray-500">{`Experience: ${therapist.experience_years} years`}</p>
                        <p className="text-sm text-gray-500">{`Rate: $${therapist.monthly_rate}/month`}</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button
                        onClick={() => openReviewsModal(therapist.id)}
                        className="bg-[#5E9ED9] text-white py-2 px-4 rounded-lg shadow hover:bg-[#5996cf]"
                      >
                        View Reviews
                      </button>
                      {relations.current_therapist_id != null ? (
                        <button
                          disabled={checkPending()}
                          onClick={() => {
                            switchTherapist(user.id, therapist.id);
                          }}
                          className="bg-[#5E9ED9] text-white py-2 px-4 rounded-lg shadow hover:bg-[#5996cf] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Switch Therapist
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            requestTherapist(user.id, therapist.id);
                          }}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700"
                        >
                          Request Therapist
                        </button>
                      )}
                      {requestStatus(therapist.id)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {isReviewsModalOpen && selectedTherapistId && (
            <ReviewsModal
              therapistId={selectedTherapistId}
              onClose={closeReviewsModal}
            />
          )}

          <div className="flex justify-center space-x-3 pt-5 items-center border-t border-[#5E9ED9]">
            <button
              className="p-1 mb-1 bg-gray-100 rounded font-bold text-xl"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            <span className="text-[#5E9ED9] font-bold">
              Page {currentPage} of{" "}
              {Math.ceil(filteredTherapists.length / itemsPerPage)}
            </span>
            <button
              className="p-1 mb-1 bg-gray-100 rounded font-bold text-xl"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredTherapists.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filteredTherapists.length / itemsPerPage)
              }
            >
              →
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const ReviewsModal: React.FC<{ therapistId: number; onClose: () => void }> = ({
  therapistId,
  onClose,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [therapistName, setTherapistName] = useState<string>("");

  useEffect(() => {
    const fetchTherapistName = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/therapists/${therapistId}`
        );
        const therapist = response.data.therapist;
        setTherapistName(`${therapist.first_name} ${therapist.last_name}`);
      } catch (error) {
        console.error("Failed to fetch therapist name:", error);
        setTherapistName("Therapist");
      }
    };

    const fetchReviewsWithUserNames = async () => {
      try {
        const reviewsResponse = await axios.get(
          `${API_BASE_URL}/api/reviews/therapist/${therapistId}`
        );
        const reviewsData = reviewsResponse.data.data;

        const reviewsWithUserNames = await Promise.all(
          reviewsData.map(async (review: any) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/api/users/${review.student_id}`
              );
              const user = userResponse.data;
              return {
                ...review,
                student_name: `${user.first_name} ${user.last_name}`,
              };
            } catch {
              return {
                ...review,
                student_name: "Anonymous",
              };
            }
          })
        );

        setReviews(reviewsWithUserNames);
        setFilteredReviews(reviewsWithUserNames);
      } catch (error) {
        console.error("Failed to fetch reviews or user data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistName();
    fetchReviewsWithUserNames();
  }, [therapistId]);

  const handleRatingFilterChange = (rating: number | null) => {
    setRatingFilter(rating);
    if (rating === null) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter((review) => review.rating === rating));
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 rounded-lg p-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <img
        src="https://illustrations.popsy.co/gray/work-from-home.svg"
        alt="No reviews illustration"
        className="w-48 h-48 mx-auto mb-6"
      />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No Reviews Found
      </h3>
      <p className="text-gray-500">Try selecting a different rating filter.</p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Oops!</h3>
      <p className="text-gray-500">
        Something went wrong while loading reviews.
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Patient Reviews for {therapistName}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
  
          {/* Filter Section */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <label htmlFor="ratingFilter" className="text-gray-700 font-medium">
              Filter by Rating:
            </label>
            <select
              id="ratingFilter"
              value={ratingFilter || ""}
              onChange={(e) =>
                handleRatingFilterChange(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-[#CBD5E1] focus:border-[#CBD5E1]"
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
  
          {/* Content Section */}
          <div
            className="p-6 overflow-y-auto flex-grow"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E1 transparent",
            }}
          >
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorState />
            ) : filteredReviews.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review: any) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <time className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <p className="text-gray-700 mb-2">{review.review_text}</p>
                    <p className="text-sm text-gray-500">
                      {review.student_name || "Anonymous"}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
  
};

export default TherapistModal;

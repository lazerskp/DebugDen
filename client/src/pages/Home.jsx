import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"}`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"}`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"}`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"}`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? "" : "s"}`;
  return `${seconds} second${seconds === 1 ? "" : "s"}`;
}

export default function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/v1/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const toggleDescription = useCallback((id) => {
    setShowDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleVote = useCallback(async (questionId, voteType) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/api/v1/questions/${questionId}/vote`,
        { type: voteType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? res.data : q))
      );
    } catch (err) {
      console.error(`Failed to ${voteType} question:`, err);
    }
  }, []);

  const handleNavigateToQuestion = useCallback(
    (questionId) => {
      navigate(`/question/${questionId}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="w-full max-w-screen-md mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8 border-b border-gray-300 pb-3 text-center animate-fade-in-down">
            Explore Questions
          </h2>

          {loading && (
            <p className="text-gray-600 text-center">Loading questions...</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && !error && questions.length === 0 && (
            <p className="text-gray-600 text-center">
              No questions yet. Be the first to ask!
            </p>
          )}

          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-white rounded-md shadow-md border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Posted {timeSince(new Date(question.createdAt))} ago by{" "}
                    <span className="font-medium">
                      {question.author?.name || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3
                      onClick={() => handleNavigateToQuestion(question._id)}
                      className="text-lg font-semibold text-gray-900 hover:underline cursor-pointer flex-grow"
                    >
                      {question.title}
                    </h3>
                    <button
                      onClick={() => toggleDescription(question._id)}
                      className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      title={
                        showDescription[question._id]
                          ? "Hide Description"
                          : "Show Description"
                      }
                    >
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                          showDescription[question._id] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  {/* Display Image Thumbnail if available */}
                  {question.imageUrl && (
                    <div
                      className="mt-3 cursor-pointer"
                      onClick={() => handleNavigateToQuestion(question._id)}
                    >
                      <img
                        src={question.imageUrl}
                        alt="Question attachment"
                        className="max-h-56 w-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {showDescription[question._id] && (
                    <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                      {question.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vote/Comment UI */}
                <div className="border-t p-3 sm:p-4 flex items-center justify-between text-white bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-b-md shadow-inner transition-colors duration-300">
                  {/* Vote Block */}
                  <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-1 rounded-full backdrop-blur group">
                    <button
                      onClick={() => handleVote(question._id, "upvote")}
                      className="transition-transform duration-150 transform hover:scale-110 active:scale-90"
                    >
                      <svg
                        className="w-5 h-5 text-white group-hover:text-green-400 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-semibold">
                      {question.upvotes || 0}
                    </span>
                    <button
                      onClick={() => handleVote(question._id, "downvote")}
                      className="transition-transform duration-150 transform hover:scale-110 active:scale-90"
                    >
                      <svg
                        className="w-5 h-5 text-white ml-4 group-hover:text-red-400 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-semibold">
                      {question.downvotes || 0}
                    </span>
                  </div>

                  {/* Comment Block */}
                  <div
                    onClick={() => handleNavigateToQuestion(question._id)}
                    className="flex items-center bg-gray-800/80 px-3 py-1 rounded-full group hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-white mr-2 transition-colors duration-200 group-hover:text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                      />
                    </svg>
                    <span className="text-sm font-semibold">
                      {(question.commentCount || 0) > 999
                        ? `${Math.floor(question.commentCount / 1000)}K`
                        : question.commentCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
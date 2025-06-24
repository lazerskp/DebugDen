import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the spinner
import toast from "react-hot-toast";

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

export default function AnswerPage() {
  const { id: questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sort answers by the number of likes in descending order
  const sortedAnswers = useMemo(() => {
    if (!answers) return [];
    // Create a copy before sorting to avoid mutating state directly
    return [...answers].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  }, [answers]);

  const fetchQuestionAndAnswers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/v1/questions/${questionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestion(res.data); // Assuming the backend returns the question object directly
      setAnswers(res.data.comments || []); // Access comments directly from the question object
      setError(null);
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setError("Failed to load the question and answers. Please try again.");
      toast.error("Failed to load question.");
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/v1/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(res.data.user);
        } catch (err) {
          console.error("Could not fetch current user", err);
          // Don't block the page from loading, just log the error
        }
      }
    };

    fetchCurrentUser();
    fetchQuestionAndAnswers();
  }, [fetchQuestionAndAnswers]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/v1/questions/${questionId}/comments`,
        { text: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = res.data.comment; // Assuming the new answer is returned in a 'comment' property
      if (newComment) {
        setAnswers((prevAnswers) => [...prevAnswers, newComment]);
        setNewAnswer("");
        toast.success("Your answer has been posted!");
      } else {
        throw new Error("Invalid response structure from server.");
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!currentUser) {
      toast.error("You must be logged in to like an answer.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/api/v1/answers/${commentId}/like`, // Corrected API endpoint
        {}, // No body needed
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedComment = res.data.answer; // The backend now returns an 'answer' object
      setAnswers((prevAnswers) =>
        prevAnswers.map(answer =>
          answer._id === commentId ? updatedComment : answer
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update like status.");
    }
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!question) return <div className="text-center p-10">Question not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600 transition-all focus:outline-none z-10"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Question Display - Themed like Home.jsx question cards */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{question.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            Asked {timeSince(new Date(question.createdAt))} ago by{" "}
            <span className="font-medium text-gray-700">{question.author?.name || "Anonymous"}</span>
          </div>
          {/* Display Image if available */}
          {question.imageUrl && (
            <div className="my-4">
              <img
                src={question.imageUrl}
                alt="Question attachment"
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
              />
            </div>
          )}
          <p className="text-gray-700 whitespace-pre-wrap mb-4">{question.description}</p>
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Answer Submission Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Answer</h2>
          <form onSubmit={handleAnswerSubmit}>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows="6"
              placeholder="Write your answer here..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              disabled={submitting}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-black text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={submitting || !newAnswer.trim()}
              >
                {submitting ? "Posting..." : "Post Your Answer"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Answers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>
          {sortedAnswers.length > 0 ? (
            sortedAnswers.map((answer) => (
              <div key={answer._id} className="bg-white rounded-lg shadow p-5 transition-shadow hover:shadow-md">
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{answer.text}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Answered {timeSince(new Date(answer.createdAt))} ago by{" "}
                    <span className="font-medium text-gray-700">{answer.author?.name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(answer._id)}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-md"
                      aria-label="Like this answer"
                    >
                      <svg className={`w-5 h-5 transition-colors ${answer.likes?.includes(currentUser?._id) ? 'text-black fill-current' : 'text-black stroke-current'}`}
                           viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span className="font-medium text-sm">{answer.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No answers yet. Be the first to contribute!</p>
          )}
        </div>
      </div>
    </div>
  );
}

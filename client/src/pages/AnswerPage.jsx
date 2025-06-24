import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  return `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? "" : "s"}`;
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

  const fetchQuestionAndAnswers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/v1/questions/${questionId}`,
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
        `http://localhost:3000/api/v1/questions/${questionId}/comments`,
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

  if (loading) return <div className="text-center p-10">Loading question...</div>;
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
          {answers.length > 0 ? (
            answers.map((answer) => (
              <div key={answer._id} className="bg-white rounded-lg shadow p-5">
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{answer.text}</p>
                <div className="text-right text-sm text-gray-500 mt-4">
                  Answered {timeSince(new Date(answer.createdAt))} ago by{" "}
                  <span className="font-medium text-gray-700">{answer.author?.name || "Anonymous"}</span>
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

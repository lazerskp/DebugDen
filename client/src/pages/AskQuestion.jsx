import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AskQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setIsUploading(true);
    const uploadToast = toast.loading('Uploading image...');

    try {
      const token = localStorage.getItem('token');
      // Note: Ensure your upload route is correct and authenticated
      const { data } = await axios.post('http://localhost:3000/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setImageUrl(data.imageUrl);
      toast.success('Image uploaded!', { id: uploadToast });
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Image upload failed.';
      toast.error(errorMessage, { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      toast.error('Please wait for image to finish uploading.');
      return;
    }
    setIsSubmitting(true);
    const loadingToast = toast.loading('Posting your question...');

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/v1/questions/ask',
        { title, description, tags: tagsArray, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Question posted successfully!', { id: loadingToast });
      // Redirect to the home page after successful submission
      navigate('/login/home');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to post question. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Main Content Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600 transition-all focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4 tracking-wide">
          📝 Ask a New Question
        </h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. How to center a div in CSS?"
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              id="description"
              placeholder="Describe your question with enough details..."
              className="w-full h-40 p-3 rounded-lg bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black resize-y transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-gray-700 font-medium mb-1">Tags</label>
            <input
              id="tags"
              type="text"
              placeholder="e.g. javascript, react, css"
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Add up to 10 tags to describe what your question is about.</p>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image-upload" className="block text-gray-700 font-medium mb-1">Attach an Image (Optional)</label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
            />
            {isUploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
            {imageUrl && !isUploading && (
              <div className="mt-4">
                <p className="font-semibold text-sm">Image Preview:</p>
                <img src={imageUrl} alt="Upload preview" className="mt-2 border rounded-lg max-w-xs max-h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="self-end bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Submitting...' : '🚀 Submit Question'}
          </button>
        </form>
      </div>
    </div>
  );
}
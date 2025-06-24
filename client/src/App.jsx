import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";
import AnswerPage from "./pages/AnswerPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import Navbar from "./components/Navbar";
import LoggedInLayout from "./components/LoggedInLayout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const location = useLocation();
  // Define routes where the main Navbar should be hidden (i.e., post-login pages)
  const noNavRoutes = ["/login/home", "/ask", "/question/", "/profile", "/settings"];

  // Show Navbar if the current path doesn't start with any of the noNavRoutes
  const showNav = !noNavRoutes.some(path => location.pathname.startsWith(path));

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Logged-in routes with a consistent layout */}
        <Route element={<LoggedInLayout />}>
          <Route path="/login/home" element={<Home />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/question/:id" element={<AnswerPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

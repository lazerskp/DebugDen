import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isWhyVisible, setIsWhyVisible] = useState(false);
  const [isHowVisible, setIsHowVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);

  // Section refs
  const whyRef = useRef(null);
  const howRef = useRef(null);
  const featuresRef = useRef(null);
  const visionRef = useRef(null);
  const teamRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target.id) {
            case "why-content":
              setIsWhyVisible(true);
              break;
            case "how-content":
              setIsHowVisible(true);
              break;
            case "features-content":
              setIsFeaturesVisible(true);
              break;
            case "vision-content":
              setIsVisionVisible(true);
              break;
            case "team-content":
              setIsTeamVisible(true);
              break;
            default:
              break;
          }
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (whyRef.current) observer.observe(whyRef.current);
    if (howRef.current) observer.observe(howRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (visionRef.current) observer.observe(visionRef.current);
    if (teamRef.current) observer.observe(teamRef.current);

    return () => {
      if (whyRef.current) observer.unobserve(whyRef.current);
      if (howRef.current) observer.unobserve(howRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (visionRef.current) observer.unobserve(visionRef.current);
      if (teamRef.current) observer.unobserve(teamRef.current);
    };
  }, []);

  useEffect(() => {
    const idToScrollTo = location.state?.scrollToId;
    const section = idToScrollTo ? document.getElementById(idToScrollTo) : null;

    setTimeout(() => {
      const navbar = document.querySelector("nav");
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const yOffset = -navbarHeight - 16;

      if (section) {
        const y =
          section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        // Scroll to top if no section is specified, which is default for landing page
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  }, [location]);

  return (
    <div className="font-sans text-black tracking-wide relative bg-white">
      {/* Content Layer */}
      <div className="relative z-10">
        {/* What is DebugDen Section */}
        <section
          id="about-debugden"
          className="pt-32 px-8 min-h-screen flex items-center animate-fade-in"
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-6">
              What is DebugDen
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700 text-justify">
              <p>
                DebugDen was founded on a simple yet powerful idea: to create a
                focused, professional, and collaborative space for developers
                to solve problems. In a world saturated with information,
                finding clear, accurate, and community-vetted answers to
                technical questions can be a challenge. We set out to build a
                platform that cuts through the noise, prioritizing quality over
                quantity.
              </p>
              <p className="font-semibold text-lg text-gray-800">
                Our mission is to foster a respectful and vibrant developer
                community where knowledge sharing drives innovation, growth, and
                mastery. We value clarity, collaboration, and continuous
                learning, empowering developers to build better software
                together.
              </p>
              <p>
                Our mission is to empower developers at every stage of their
                careers. Whether you are a student taking your first steps in
                coding, a seasoned professional tackling complex architectural
                challenges, or an open-source contributor passionate about
                building the future of technology, DebugDen is your dedicated
                hub for knowledge sharing. We believe that by fostering a
                community built on respect, collaboration, and a shared passion
                for problem-solving, we can collectively elevate our skills and
                build better software.
              </p>
            </div>
          </div>
        </section>

        

        {/* Why DebugDen Section */}
        <section id="why" className="px-8 py-40 flex items-center">
          <div
            id="why-content"
            ref={whyRef}
            className={`max-w-3xl mx-auto transition-all duration-1000 ease-out transform ${
              isWhyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
          >
            <h2 className="text-5xl font-extrabold mb-6">Why DebugDen?</h2>
            <p className="text-lg leading-relaxed text-gray-700 text-justify">
              DebugDen is more than just another Q&amp;A site — it's a community-driven hub where clarity meets collaboration. With curated questions, intuitive tag-based filtering, and a distraction-free interface, knowledge sharing becomes effortless and efficient for professionals and learners alike.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 text-justify mt-4">
              Our platform is designed to cut through the noise, providing a focused environment where you can quickly find answers, contribute your expertise, and build a strong reputation within the developer community. We believe in fostering a culture of mutual growth and continuous learning.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-8 py-36 flex items-center bg-gray-50">
          <div
            id="how-content"
            ref={howRef}
            className={`max-w-3xl mx-auto transition-all duration-1000 ease-out transform ${
              isHowVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
          >
            <h2 className="text-4xl font-extrabold mb-6">How It Works</h2>
            <ol className="list-decimal ml-6 text-lg leading-relaxed text-gray-700">
              <li><b>Ask a Question:</b> Post your technical problem or knowledge gap, tagging relevant topics for rapid discovery.</li>
              <li><b>Get Answers:</b> The community jumps in with clear, well-documented solutions, references, and code snippets.</li>
              <li><b>Upvote & Accept:</b> Upvote the best answers and mark one as accepted for future visitors.</li>
              <li><b>Earn Reputation:</b> Helpful participation earns reputation points and unlocks privileges.</li>
              <li><b>Grow & Connect:</b> Build your profile, make connections, and contribute to a growing pool of developer knowledge.</li>
            </ol>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="px-8 py-36 flex items-center">
          <div
            id="features-content"
            ref={featuresRef}
            className={`max-w-4xl mx-auto transition-all duration-1000 ease-out transform ${
              isFeaturesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
          >
            <h2 className="text-4xl font-extrabold mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div>
                <h3 className="text-2xl font-bold mb-2">Curated Q&amp;A</h3>
                <p className="text-base leading-relaxed text-gray-700">
                  Every question and answer is moderated for clarity, ensuring high-quality content for all users.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Tag-Based Filtering</h3>
                <p className="text-base leading-relaxed text-gray-700">
                  Quickly find relevant topics and unanswered questions with a robust tagging system.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Collaborative Editing</h3>
                <p className="text-base leading-relaxed text-gray-700">
                  Improve questions and answers collaboratively to build a lasting knowledge base.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Profile & Reputation</h3>
                <p className="text-base leading-relaxed text-gray-700">
                  Showcase your expertise and contributions, and unlock new privileges as your reputation grows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 text-black py-12 mt-24 border-t border-gray-300 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-extrabold mb-6">Contact Us</h2>
          <p className="text-lg leading-relaxed text-gray-700 text-center mb-4">
            Connect with us on:
          </p>
          <div className="flex gap-8 text-lg font-medium mb-8">
            {["Facebook", "Instagram", "Twitter", "LinkedIn"].map(
              (name, i) => (
                <a
                  key={i}
                  href={`#${name.toLowerCase()}`} // Added a placeholder href for better practice
                  className="underline hover:text-gray-600 transition duration-200 text-center"
                >
                  {name}
                </a>
              )
            )}
          </div>
          <p className="text-lg leading-relaxed text-gray-700 text-center max-w-3xl mb-8">
            Have questions, feedback, or partnership inquiries? We'd love to
            hear from you! Reach out to us through our social media channels or
            visit our dedicated support page for more ways to get in touch.
            Your input helps us continuously improve DebugDen.
          </p>
          <p className="text-center text-gray-600 text-sm max-w-md mb-4">
            DebugDen is dedicated to empowering developers worldwide through a
            collaborative, respectful, and high-quality knowledge-sharing
            platform.
          </p>
          <p className="text-gray-500 text-sm text-center">
            &copy; 2025 DebugDen. Designed for professionals.
          </p>
        </footer>
      </div>
      {/* Custom Styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
        html,
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
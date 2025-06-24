import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation

export default function AboutUs() {
  // State to track visibility of each section for fade-up animation
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);

  // Refs for each section's content div
  const visionRef = useRef(null);
  const teamRef = useRef(null);
  const location = useLocation(); // Get current location to read state

  useEffect(() => {
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.3, // Trigger when 30% of the target is visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target.id) {
            case 'vision-content':
              setIsVisionVisible(true);
              break;
            case 'team-content':
              setIsTeamVisible(true);
              break;
            default:
              break;
          }
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (visionRef.current) observer.observe(visionRef.current);
    if (teamRef.current) observer.observe(teamRef.current);

    return () => {
      if (visionRef.current) observer.unobserve(visionRef.current);
      if (teamRef.current) observer.unobserve(teamRef.current);
    };
  }, []);

  useEffect(() => {
    const idToScrollTo = location.state?.scrollToId; // Get the ID from location state
    const section = idToScrollTo ? document.getElementById(idToScrollTo) : null; // Find the section element

    // Small delay to ensure the Navbar is rendered and its height is correct
    // and to allow the page to fully render before scrolling
    setTimeout(() => {
      const navbar = document.querySelector("nav"); // Get the navbar element
      const navbarHeight = navbar ? navbar.offsetHeight : 0; // Get navbar height
      const yOffset = -navbarHeight - 16; // Calculate offset for fixed navbar

      if (section) {
        // Scroll to specific section if an ID is provided
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        // Scroll to the very top if no specific section is targeted
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100); // 100ms delay
  }, [location]); // Re-run effect when location object changes

  return (
    <div className="font-sans text-black tracking-wide bg-white">
      {/* About DebugDen Section (Initial, no fade-up) */}
      <section
        id="about-debugden"
        className="pt-32 px-8 min-h-screen flex items-center animate-fade-in"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6">
            About DebugDen
          </h1>
          <div className="space-y-6 text-lg leading-relaxed text-gray-700 text-justify">
            <p>
              DebugDen was founded on a simple yet powerful idea: to create a focused, professional, and collaborative space for developers to solve problems. In a world saturated with information, finding clear, accurate, and community-vetted answers to technical questions can be a challenge. We set out to build a platform that cuts through the noise, prioritizing quality over quantity.
            </p>
            <p className="font-semibold text-lg text-gray-800">
              Our mission is to foster a respectful and vibrant developer community where knowledge sharing drives innovation, growth, and mastery. We value clarity, collaboration, and continuous learning, empowering developers to build better software together.
            </p>
            <p>
              Our mission is to empower developers at every stage of their careers. Whether you are a student taking your first steps in coding, a seasoned professional tackling complex architectural challenges, or an open-source contributor passionate about building the future of technology, DebugDen is your dedicated hub for knowledge sharing. We believe that by fostering a community built on respect, collaboration, and a shared passion for problem-solving, we can collectively elevate our skills and build better software.
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section id="our-vision" className="px-8 py-40 flex items-center">
        <div
          id="vision-content"
          ref={visionRef}
          className={`max-w-3xl mx-auto transition-all duration-1000 ease-out transform ${
            isVisionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-5xl font-extrabold mb-6">Our Vision</h2>
          <p className="text-lg leading-relaxed text-gray-700 text-justify">
            We envision a developer community where asking questions is encouraged, and providing thoughtful answers is celebrated. DebugDen is more than just a Q&A site; it's a living repository of technical knowledge, curated and maintained by its members. Our platform is designed with a minimalist aesthetic to ensure a distraction-free experience, allowing you to focus on what truly matters: the code and the concepts behind it.
          </p>
        </div>
      </section>

      {/* The Team Section */}
      <section id="the-team" className="px-8 py-40 flex items-center bg-gray-50">
        <div
          id="team-content"
          ref={teamRef}
          className={`max-w-3xl mx-auto transition-all duration-1000 ease-out transform ${
            isTeamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-5xl font-extrabold mb-6">The Team</h2>
          <p className="text-lg leading-relaxed text-gray-700 text-justify">
            We are a small, dedicated team of engineers, designers, and community managers who are deeply passionate about software development. We built DebugDen because it's the platform we wished we had throughout our own careers. We are committed to continuously improving the platform based on user feedback and the evolving needs of the developer landscape.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 text-justify mt-4">
            Thank you for being a part of our journey. Together, let's make DebugDen the most trusted and valuable resource for developers worldwide.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-black py-12 mt-24 border-t border-gray-300 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-extrabold mb-6">Contact Us</h2>
          <p className="text-lg leading-relaxed text-gray-700 text-center mb-4">Connect with us on:</p>
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
            Have questions, feedback, or partnership inquiries? We'd love to hear from you! Reach out to us through our social media channels or visit our dedicated support page for more ways to get in touch. Your input helps us continuously improve DebugDen.
          </p>
          <p className="text-center text-gray-600 text-sm max-w-md mb-4">
            DebugDen is dedicated to empowering developers worldwide through a collaborative, respectful, and high-quality knowledge-sharing platform.
          </p>
          <p className="text-gray-500 text-sm text-center">
            &copy; 2025 DebugDen. Designed for professionals.
          </p>
        </footer>
      {/* Custom Styles to hide scrollbar */}
      <style>{`
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
        html, body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
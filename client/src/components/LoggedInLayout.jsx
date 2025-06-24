import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './Header';

// Icons for the footer
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M5 10v11a2 2 0 002 2h10a2 2 0 002-2V10l-9-9-9 9z"></path>
  </svg>
);

const CogIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const Sidebar = () => (
  <aside className="fixed top-16 left-0 w-64 h-full bg-white border-r border-gray-200 py-4 px-2 font-sans text-black tracking-wide">
    <nav>
      <ul>
        <li className="mb-2">
          <Link to="/login/home" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md transition duration-150 ease-in-out" title="Home">
            <HomeIcon className="mr-3 text-gray-500" /> Home
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black rounded-md" title="Profile">
            <UserIcon className="mr-3" /> Profile
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md transition duration-150 ease-in-out" title="Settings">
            <CogIcon className="mr-3 text-gray-500" /> Settings
          </Link>
        </li>
      </ul>
    </nav>
  </aside>
);

export default function LoggedInLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-black tracking-wide">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow ml-64 p-6"> {/* Content shifts right by sidebar width */}
          <Outlet />
        </main>
        <style>{`
          .font-sans {
            font-family: 'sans-serif', sans-serif; /* Replace with actual font if known */
          }
          /* Add more global styles from LandingPage.jsx if needed */
        `}</style>
      </div>
    </div>
  );
}

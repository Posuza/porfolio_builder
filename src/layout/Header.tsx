import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b sticky top-0 z-[9999]">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 300 300" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="20" y="20" width="260" height="260" rx="40" fill="#0F172A" />

            <path
              d="M90 80 H140 A30 30 0 0 1 170 110 A30 30 0 0 1 140 140 H115 V190"
              stroke="#38BDF8"
              strokeWidth={20}
              fill="none"
              strokeLinecap="round"
            />

            <path
              d="M210 220 V110"
              stroke="#FFFFFF"
              strokeWidth={20}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M210 190 H170 A30 30 0 0 1 140 160 A30 30 0 0 1 170 130 H210"
              stroke="#FFFFFF"
              strokeWidth={20}
              fill="none"
              strokeLinecap="round"
            />

            <circle cx="230" cy="90" r="10" fill="#38BDF8" />
          </svg>
          <Link to="/studio/builder" className="text-lg font-semibold text-gray-800">Portfolio Builder</Link>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            to="/studio/builder"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Editor
          </Link>
          <Link
            to="/studio/preview"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Preview
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

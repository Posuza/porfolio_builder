import React from "react";
import { Link } from "react-router-dom";
import { usePortfolioStore } from "../store/store";
import { LuNotebookPen, LuEye, LuExternalLink } from 'react-icons/lu';

const Header: React.FC = () => {
  const { pages, currentPageId } = usePortfolioStore();
  const currentPage = pages.find((p) => p.id === currentPageId);
  const liveSlug = currentPage?.slug || currentPage?.id;

  return (
    <header className="w-full bg-white border-b sticky top-0 z-[9999]">
      <div className=" px-2 md:px-4 py-3 flex items-center justify-between">
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
          <Link to="/studio/builder" className="text-lg font-semibold text-gray-800">
            <span className="hidden sm:inline">Portfolio Builder</span>
          </Link>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/studio/builder" className="text-sm text-gray-600 hover:text-gray-900">
            <span className="inline sm:hidden">
              {React.createElement(LuNotebookPen as any, { size: 20 })}
            </span>
            <span className="hidden sm:inline">Editor</span>
          </Link>
          <Link to="/studio/preview" className="text-sm text-gray-600 hover:text-gray-900">
            <span className="inline sm:hidden">
              {React.createElement(LuEye as any, { size: 20 })}
            </span>
            <span className="hidden sm:inline">Preview</span>
          </Link>
          {liveSlug && (
            <Link
              to={`/pages/${liveSlug}`}
              className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="inline sm:hidden">
                {React.createElement(LuExternalLink as any, { size: 18 })}
              </span>
              <span className="hidden sm:inline">View Live</span>

            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

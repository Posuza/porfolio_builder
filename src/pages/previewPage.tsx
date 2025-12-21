import React from 'react';
import { Link } from 'react-router-dom';
import { PreviewMode } from '../components/engine/PreviewMode';

export const PreviewPage: React.FC = () => {
  return (
    <div>
      <div className="fixed inset-x-0 top-0 bg-white p-4 border-b z-40 flex justify-between items-center">
        <h3 className="m-0 text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="18" r="0.5" fill="currentColor" />
          </svg>
          Portfolio Preview
        </h3>
        <Link to="/studio/builder" className="py-2 px-4 bg-gray-600 text-white rounded">← Back to Editor</Link>
      </div>
      <div className="pt-16">
        <PreviewMode />
      </div>
    </div>
  );
};

export default PreviewPage;

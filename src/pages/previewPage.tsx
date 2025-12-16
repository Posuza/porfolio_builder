import React from 'react';
import { Link } from 'react-router-dom';
import { PreviewMode } from '../components/engine/PreviewMode';

export const PreviewPage: React.FC = () => {
  return (
    <div>
      <div className="fixed inset-x-0 top-0 bg-white p-4 border-b z-50 flex justify-between items-center">
        <h3 className="m-0 text-gray-800">📱 Portfolio Preview</h3>
        <Link to="/studio/builder" className="py-2 px-4 bg-gray-600 text-white rounded">← Back to Editor</Link>
      </div>
      <div className="pt-16">
        <PreviewMode />
      </div>
    </div>
  );
};

export default PreviewPage;

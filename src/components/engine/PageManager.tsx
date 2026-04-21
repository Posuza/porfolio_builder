import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../../store/store';
import { HiX } from 'react-icons/hi';

export const PageManager: React.FC = () => {
  const { pages, currentPageId, setCurrentPage, addPage, deletePage, layouts, currentLayoutId } = usePortfolioStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | undefined>(currentLayoutId || undefined);

  const handleAddPage = () => {
    const name = newPageName.trim();
    if (!name) return;
    addPage(name, selectedLayoutId);
    setNewPageName('');
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {pages.map((page) => (
          <div key={page.id} className="relative">
            <Link
              to={`/studio/builder/${page.id}`}
              onClick={() => setCurrentPage(page.id)}
              className={`inline-flex items-center h-8 px-3 rounded text-xs md:text-sm no-underline ${currentPageId === page.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
            >
              {page.name}
            </Link>

            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePage(page.id);
                }}
                aria-label={`Delete ${page.name}`}
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-md bg-red-600 text-white text-xs flex items-center justify-center"
              >
                {React.createElement(
                  HiX as unknown as React.ComponentType<{
                    className?: string;
                    'aria-hidden'?: boolean;
                  }>,
                  { className: 'w-2.5 h-2.5', 'aria-hidden': true },
                )}
              </button>
            )}
            
          
          </div>
        ))}

      {showAddForm ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name"
            className="flex-1 h-8 px-3 border rounded text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddPage()}
          />

          <select
            value={selectedLayoutId}
            onChange={(e) => setSelectedLayoutId(e.target.value || undefined)}
            className="h-8 px-3 border rounded text-sm"
          >
            <option value="">Use current layout</option>
            {layouts.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button onClick={handleAddPage} className="h-8 px-3 bg-green-600 text-white rounded text-sm">Add</button>
          <button onClick={() => setShowAddForm(false)} className="h-8 px-3 bg-gray-600 text-white rounded text-sm">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)} className="h-8 px-2 bg-blue-600 text-white rounded text-sm flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Page
        </button>
      )}
      </div>

    </div>
  );
};

export default PageManager;

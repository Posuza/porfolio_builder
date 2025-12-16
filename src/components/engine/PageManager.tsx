import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../../store/store';

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
              className={`inline-block px-3 py-1 rounded text-sm no-underline ${currentPageId === page.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
            >
              {page.name}
            </Link>

            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePage(page.id);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name"
            className="flex-1 p-2 border rounded text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddPage()}
          />

          <select
            value={selectedLayoutId}
            onChange={(e) => setSelectedLayoutId(e.target.value || undefined)}
            className="p-2 border rounded text-sm"
          >
            <option value="">Use current layout</option>
            {layouts.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button onClick={handleAddPage} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Add</button>
          <button onClick={() => setShowAddForm(false)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">+ Add Page</button>
      )}
    </div>
  );
};

export default PageManager;

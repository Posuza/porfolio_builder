import React, { useState } from 'react';
import { usePortfolioStore } from '../store/store';

export const PageManager: React.FC = () => {
  const { pages, currentPageId, addPage, deletePage, setCurrentPage, updatePage } = usePortfolioStore();
  const [newPageName, setNewPageName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setShowAddForm(false);
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Pages</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {pages.map((page: any) => (
          <div
            key={page.id}
            onClick={() => setCurrentPage(page.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPageId === page.id ? '#007bff' : 'white',
              color: currentPageId === page.id ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              position: 'relative',
            }}
          >
            {page.name}
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePage(page.id);
                }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name"
            style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPage()}
          />
          <button
            onClick={handleAddPage}
            style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
          >
            Add
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
        >
          + Add Page
        </button>
      )}
    </div>
  );
};
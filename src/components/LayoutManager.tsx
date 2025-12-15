import React from 'react';
import { usePortfolioStore } from '../store/store';

export const LayoutManager: React.FC = () => {
  const { layouts, currentLayoutId, setCurrentLayout, addLayout } = usePortfolioStore();

  const layoutTemplates = [
    { id: 'single', name: 'Single Column', icon: '📄', template: 'single-column' as const },
    { id: 'two', name: 'Two Column', icon: '📰', template: 'two-column' as const },
    { id: 'three', name: 'Three Column', icon: '📊', template: 'three-column' as const },
    { id: 'grid', name: 'Grid Layout', icon: '⚏', template: 'grid' as const },
  ];

  const handleAddLayout = (template: any, name: string) => {
    addLayout({
      name,
      template,
      settings: {
        maxWidth: '1200px',
        padding: '20px',
        backgroundColor: '#ffffff',
        gap: '16px',
      },
    });
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Layouts</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {layouts.map((layout) => (
          <div
            key={layout.id}
            onClick={() => setCurrentLayout(layout.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentLayoutId === layout.id ? '#28a745' : 'white',
              color: currentLayoutId === layout.id ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {layout.name}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {layoutTemplates.map(({ id, name, icon, template }) => (
          <button
            key={id}
            onClick={() => handleAddLayout(template, name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            <span>{icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
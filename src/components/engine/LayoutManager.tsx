import React from 'react';
import { usePortfolioStore } from '../../store/store';

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
    <div className="p-4 bg-gray-100 rounded-md mb-4">
      <h3 className="mb-3 text-gray-800">Layouts</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            onClick={() => setCurrentLayout(layout.id)}
            className={`px-3 py-1 rounded border text-sm cursor-pointer ${currentLayoutId === layout.id ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-800 border-gray-200'}`}
          >
            {layout.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {layoutTemplates.map(({ id, name, icon, template }) => (
          <button key={id} onClick={() => handleAddLayout(template, name)} className="p-2 rounded-md border bg-white text-sm">{icon} {name}</button>
        ))}
      </div>
    </div>
  );
};

export default LayoutManager;

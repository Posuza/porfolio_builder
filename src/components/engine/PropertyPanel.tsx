import React from 'react';
import { usePortfolioStore } from '../../store/store';

export const PropertyPanel: React.FC = () => {
  const { selectedComponent, components, updateComponent } = usePortfolioStore();
  
  const component = components.find((c: any) => c.id === selectedComponent);
  
  if (!component) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ color: '#666' }}>Select a component to edit its properties.</div>
      </div>
    );
  }

  const handleContentChange = (content: string) => {
    updateComponent(component.id, { content });
  };

  const handleStyleChange = (property: keyof any, value: string) => {
    updateComponent(component.id, {
      styles: { ...component.styles, [property]: value }
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="mb-4 text-lg text-gray-800">Properties</h3>

      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-600">Content</label>
        <textarea
          value={component.content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full min-h-[80px] p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-2 text-sm text-gray-600">Background</label>
        <input
          type="color"
          value={component.styles.backgroundColor || '#ffffff'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          className="w-full h-10 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-2 text-sm text-gray-600">Text Color</label>
        <input
          type="color"
          value={component.styles.color || '#333333'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          className="w-full h-10 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-2 text-sm text-gray-600">Font Size</label>
        <input
          type="range"
          min="12"
          max="48"
          value={parseInt(component.styles.fontSize || '16')}
          onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PropertyPanel;

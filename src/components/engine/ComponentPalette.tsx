import React from 'react';
import { usePortfolioStore } from '../../store/store';

export const ComponentPalette: React.FC = () => {
  const { addComponent, currentPageId } = usePortfolioStore();

  const componentTypes = [
    { type: 'header' as const, label: 'Header', icon: '📝', defaultContent: 'Your Header' },
    { type: 'text' as const, label: 'Text', icon: '📄', defaultContent: 'Your text content here...' },
    { type: 'image' as const, label: 'Image', icon: '🖼️', defaultContent: 'https://via.placeholder.com/300x200' },
    { type: 'button' as const, label: 'Button', icon: '🔘', defaultContent: 'Click Me' },
    { type: 'section' as const, label: 'Section', icon: '📦', defaultContent: 'Section Content' },
  ];

  const advancedComponents = [
    { type: 'card' as const, label: 'Card', icon: '🃏', defaultContent: 'Card Content' },
    { type: 'list' as const, label: 'List', icon: '📋', defaultContent: 'List Item 1\nList Item 2\nList Item 3' },
    { type: 'quote' as const, label: 'Quote', icon: '💬', defaultContent: 'This is an inspiring quote.' },
    { type: 'divider' as const, label: 'Divider', icon: '➖', defaultContent: '---' },
  ];

  const handleAddComponent = (type: any, defaultContent: string) => {
    addComponent({
      type,
      content: defaultContent,
      styles: {
        padding: '16px',
        margin: '8px',
        backgroundColor: type === 'button' ? '#007bff' : 'transparent',
        color: type === 'button' ? 'white' : '#333',
        fontSize: type === 'header' ? '24px' : '16px',
        textAlign: 'left',
      },
      position: { x: 0, y: 0 },
      pageId: currentPageId || 'default',
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="mb-4 text-gray-800">Components</h3>
      
      <div className="mb-4">
        <h4 className="mb-2 text-sm text-gray-600">Basic</h4>
        <div className="grid gap-2">
          {componentTypes.map((c) => (
            <button key={c.type} onClick={() => handleAddComponent(c.type, c.defaultContent)} className="p-2 rounded-md border bg-white text-sm">
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="mb-2 text-sm text-gray-600">Advanced</h4>
        <div className="grid gap-2">
          {advancedComponents.map((c) => (
            <button key={c.type} onClick={() => handleAddComponent(c.type, c.defaultContent)} className="p-2 rounded-md border bg-white text-sm">
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;

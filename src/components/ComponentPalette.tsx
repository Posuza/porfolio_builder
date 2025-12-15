import React from 'react';
import { usePortfolioStore } from '../store/store';

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
    <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Components</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#555', fontSize: '12px' }}>Basic</h4>
        <div style={{ display: 'grid', gap: '6px' }}>
          {componentTypes.map(({ type, label, icon, defaultContent }) => (
            <button
              key={type}
              onClick={() => handleAddComponent(type, defaultContent)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: '#555', fontSize: '12px' }}>Advanced</h4>
        <div style={{ display: 'grid', gap: '6px' }}>
          {advancedComponents.map(({ type, label, icon, defaultContent }) => (
            <button
              key={type}
              onClick={() => handleAddComponent(type, defaultContent)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
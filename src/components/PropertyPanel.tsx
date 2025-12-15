import React from 'react';
import { usePortfolioStore } from '../store/store';
import type { Component } from '../store/store';

export const PropertyPanel: React.FC = () => {
  const { selectedComponent, components, updateComponent } = usePortfolioStore();
  
  const component = components.find(c => c.id === selectedComponent);
  
  if (!component) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Properties</h3>
        <p style={{ color: '#666', fontStyle: 'italic' }}>Select a component to edit its properties</p>
      </div>
    );
  }

  const handleContentChange = (content: string) => {
    updateComponent(component.id, { content });
  };

  const handleStyleChange = (property: keyof Component['styles'], value: string) => {
    updateComponent(component.id, {
      styles: { ...component.styles, [property]: value } as Component['styles']
    });
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Properties</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Content:
        </label>
        {component.type === 'image' ? (
          <input
            type="url"
            value={component.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Image URL"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        ) : (
          <textarea
            value={component.content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
          />
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Background Color:
        </label>
        <input
          type="color"
          value={component.styles.backgroundColor || '#ffffff'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          style={{ width: '100%', height: '40px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Text Color:
        </label>
        <input
          type="color"
          value={component.styles.color || '#333333'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          style={{ width: '100%', height: '40px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Font Size:
        </label>
        <input
          type="range"
          min="12"
          max="48"
          value={parseInt(component.styles.fontSize || '16')}
          onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
          style={{ width: '100%' }}
        />
        <span style={{ fontSize: '12px', color: '#666' }}>
          {component.styles.fontSize || '16px'}
        </span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Text Align:
        </label>
        <select
          value={component.styles.textAlign || 'left'}
          onChange={(e) => handleStyleChange('textAlign', e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Padding:
        </label>
        <input
          type="text"
          value={component.styles.padding || '16px'}
          onChange={(e) => handleStyleChange('padding', e.target.value)}
          placeholder="e.g., 16px"
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
};
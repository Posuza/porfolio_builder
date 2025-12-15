import React from 'react';
import { usePortfolioStore } from '../store/store';
import { DraggableItem } from './DraggableItem';

export const Canvas: React.FC = () => {
  const { components } = usePortfolioStore();

  return (
    <div
      style={{
        minHeight: '400px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#fafafa',
      }}
    >
      <h3 style={{ textAlign: 'center', color: '#666', margin: '0 0 16px 0' }}>
        Portfolio Canvas
      </h3>
      {components.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Add components to build your portfolio
        </div>
      ) : (
        components.map((component, index) => (
          <DraggableItem
            key={component.id}
            component={component}
            index={index}
          />
        ))
      )}
    </div>
  );
};
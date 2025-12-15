import React from 'react';
import { useDrop } from 'react-dnd';
import { usePortfolioStore } from '../store/store';
import { DraggableComponent } from './DraggableComponent';

export const DropZone: React.FC = () => {
  const { getComponentsByPage, currentPageId, reorderComponents } = usePortfolioStore();
  const components = currentPageId ? getComponentsByPage(currentPageId) : [];

  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { id: string; index: number }, monitor) => {
      if (!monitor.didDrop()) {
        // Handle reordering logic here if needed
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    reorderComponents(dragIndex, hoverIndex);
  };

  return (
    <div
      // react-dnd connectors have incompatible Ref types with strict JSX refs — cast to any
      ref={drop as any}
      style={{
        minHeight: '400px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: isOver ? '#f0f8ff' : '#fafafa',
        transition: 'background-color 0.2s',
      }}
    >
      <h3 style={{ textAlign: 'center', color: '#666', margin: '0 0 16px 0' }}>
        Portfolio Canvas
      </h3>
      {components.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Drag components here to build your portfolio
        </div>
      ) : (
        components.map((component, index) => (
          <DraggableComponent
            key={component.id}
            component={component}
            index={index}
          />
        ))
      )}
    </div>
  );
};
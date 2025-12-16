import React, { useRef } from 'react';
import { Component, usePortfolioStore } from '../store/store';

interface DraggableItemProps {
  component: Component;
  index: number;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ component, index }) => {
  const { selectComponent, selectedComponent, deleteComponent, reorderComponents } = usePortfolioStore();
  const dragRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedComponent === component.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== index) {
      // reorder by index (uses componentSlice.reorderComponents)
      reorderComponents(dragIndex, index);
    }
  };

  const renderContent = () => {
    switch (component.type) {
      case 'header':
        return <h1 style={component.styles}>{component.content}</h1>;
      case 'text':
        return <p style={component.styles}>{component.content}</p>;
      case 'image':
        return <img src={component.content} alt="Portfolio" style={component.styles} />;
      case 'button':
        return <button style={component.styles}>{component.content}</button>;
      case 'section':
        return <div style={component.styles}>{component.content}</div>;
      case 'card':
        return <div style={{...component.styles, border: '1px solid #ddd', borderRadius: '8px', padding: '16px'}}>{component.content}</div>;
      case 'list':
        return <ul style={component.styles}>{component.content.split('\n').map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>;
      case 'quote':
        return <blockquote style={{...component.styles, borderLeft: '4px solid #007bff', paddingLeft: '16px', fontStyle: 'italic'}}>{component.content}</blockquote>;
      case 'divider':
        return <hr style={{...component.styles, border: 'none', borderTop: '2px solid #ddd', margin: '20px 0'}} />;
      default:
        return <div>{component.content}</div>;
    }
  };

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => selectComponent(component.id)}
      style={{
        cursor: 'move',
        border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
        margin: '8px',
        padding: '8px',
        borderRadius: '4px',
        position: 'relative',
        backgroundColor: isSelected ? '#f8f9fa' : 'white',
      }}
    >
      {renderContent()}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteComponent(component.id);
          }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
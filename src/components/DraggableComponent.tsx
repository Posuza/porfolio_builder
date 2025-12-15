import React from 'react';
import { useDrag } from 'react-dnd';
import { Component, usePortfolioStore } from '../store/store';

interface DraggableComponentProps {
  component: Component;
  index: number;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, index }) => {
  const { selectComponent, selectedComponent, deleteComponent } = usePortfolioStore();
  
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { id: component.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isSelected = selectedComponent === component.id;

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
        return <ul style={component.styles}>{component.content.split('\n').map((item, i) => <li key={i}>{item}</li>)}</ul>;
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
      // cast to any to satisfy strict ref type expected by React + react-dnd v15
      ref={drag as any}
      onClick={() => selectComponent(component.id)}
      style={{
        opacity: isDragging ? 0.5 : 1,
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
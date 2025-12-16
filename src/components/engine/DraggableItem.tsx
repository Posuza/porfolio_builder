import React, { useRef } from 'react';
import { usePortfolioStore } from '../../store/store';

interface DraggableItemProps {
  component: any;
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
      className={`cursor-move m-2 p-2 rounded ${isSelected ? 'border-2 border-blue-500 bg-gray-100' : 'border border-gray-200 bg-white'}`}
    >
      {renderContent()}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteComponent(component.id);
          }}
          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default DraggableItem;

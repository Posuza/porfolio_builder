import React, { useRef } from 'react';
import { usePortfolioStore } from '../../store/store';

interface DraggableItemProps {
  component: any;
  index: number;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ component, index }) => {
  const { selectComponent, selectedComponent, deleteComponent, reorderComponents } = usePortfolioStore();
  const { getCurrentLayout } = usePortfolioStore();
  const layout = getCurrentLayout?.();
  const accent = layout?.settings?.accentColor || '#3b82f6';
  const surface = layout?.settings?.surfaceColor || '#ffffff';
  const text = layout?.settings?.textColor || '#111827';
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
      case 'layout':
        return <div style={{ ...component.styles, backgroundColor: component.styles?.backgroundColor || 'transparent' }}>{component.content}</div>;
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
      onClick={(e) => { e.stopPropagation(); selectComponent(component.id); }}
      style={{ background: isSelected ? surface : '#fff', border: `1px solid ${isSelected ? accent : '#e5e7eb'}`, color: text }}
      className={`cursor-move m-2 p-2 rounded relative`}
    >
      {renderContent()}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteComponent(component.id);
          }}
          style={{ background: accent, color: '#fff' }}
          className="absolute -top-2 -right-2 rounded-full w-5 h-5 text-xs flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default DraggableItem;

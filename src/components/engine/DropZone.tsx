import React from 'react';
import { useDrop } from 'react-dnd';
import { usePortfolioStore } from '../../store/store';
import { DraggableComponent } from './DraggableComponent';

export const DropZone: React.FC = () => {
  const { getComponentsByPage, currentPageId } = usePortfolioStore();
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

  // reordering handled via drag/drop handlers in DraggableComponent/DraggableItem

  return (
    <div
      // react-dnd connectors have incompatible Ref types with strict JSX refs — cast to any
      ref={drop as any}
      className={`min-h-[400px] border-2 border-dashed rounded-lg p-4 transition-colors ${isOver ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-300'}`}
    >
      <h3 className="text-center text-gray-600 mb-4">Portfolio Canvas</h3>
      {components.length === 0 ? (
        <div className="text-center text-gray-400 p-10">Drag components here to build your portfolio</div>
      ) : (
        components.map((component, index) => (
          <DraggableComponent key={component.id} component={component} index={index} />
        ))
      )}
    </div>
  );
};

export default DropZone;

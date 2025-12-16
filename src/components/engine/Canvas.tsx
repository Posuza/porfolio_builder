import React from 'react';
import { usePortfolioStore } from '../../store/store';
import DraggableItem from './DraggableItem';

export const Canvas: React.FC = () => {
  const { components } = usePortfolioStore();

  return (
    <div className="min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <h3 className="text-center text-gray-600 mb-4">Portfolio Canvas</h3>
      {components.length === 0 ? (
        <div className="text-center text-gray-400 p-10">Add components to build your portfolio</div>
      ) : (
        components.map((component, index) => (
          <DraggableItem key={component.id} component={component} index={index} />
        ))
      )}
    </div>
  );
};

export default Canvas;

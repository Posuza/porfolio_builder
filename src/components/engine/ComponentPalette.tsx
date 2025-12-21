import React from 'react';
import { usePortfolioStore } from '../../store/store';
import { useDrag } from 'react-dnd';
import { FiType, FiFileText, FiImage, FiSquare, FiCreditCard, FiList, FiMessageSquare, FiMinus } from 'react-icons/fi';

export const ComponentPalette: React.FC = () => {
  const { addComponent, currentPageId, getComponentsByPage } = usePortfolioStore();

  const componentTypes = [
    { type: 'header' as const, label: 'Header', Icon: FiType, defaultContent: 'Your Header' },
    { type: 'text' as const, label: 'Text', Icon: FiFileText, defaultContent: 'Your text content here...' },
    { type: 'image' as const, label: 'Image', Icon: FiImage, defaultContent: 'https://via.placeholder.com/300x200' },
    { type: 'button' as const, label: 'Button', Icon: FiSquare, defaultContent: 'Click Me' },
  ];

  const advancedComponents = [
    { type: 'card' as const, label: 'Card', Icon: FiCreditCard, defaultContent: 'Card Content' },
    { type: 'list' as const, label: 'List', Icon: FiList, defaultContent: 'List Item 1\nList Item 2\nList Item 3' },
    { type: 'quote' as const, label: 'Quote', Icon: FiMessageSquare, defaultContent: 'This is an inspiring quote.' },
    { type: 'divider' as const, label: 'Divider', Icon: FiMinus, defaultContent: '---' },
  ];

  const handleAddComponent = (type: any, defaultContent: string) => {
    // Prevent adding components directly to the top-level canvas when there
    // are no sections/layouts. Require a section to exist and add into it.
    // allow adding into either legacy `section` nodes or the newer `layout` containers
    const sections = currentPageId ? (getComponentsByPage(currentPageId) || []).filter((c: any) => c.type === 'section' || c.type === 'layout') : [];
    if (sections.length === 0) {
      // user must create a layout/section first
      // Keep feedback minimal — the editor UI can be enhanced later.
      alert('Create a layout (drop a layout template) or add a section before adding components.');
      return;
    }

    const parentSection = sections[0];
    addComponent({
      type,
      content: defaultContent,
      // store explicit icon key to ensure StructureView renders deterministically
      icon: type,
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
      parentId: parentSection.id,
    });
  };

  const PaletteButton: React.FC<{ c: any }> = ({ c }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'new-component',
      item: {
        type: c.type,
        content: c.defaultContent,
        styles: {
          padding: '16px',
          margin: '8px',
          backgroundColor: c.type === 'button' ? '#007bff' : 'transparent',
          color: c.type === 'button' ? 'white' : '#333',
          fontSize: c.type === 'header' ? '24px' : '16px',
          textAlign: 'left',
        },
      },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }), [c]);

    return (
      <button
        ref={drag as any}
        onClick={() => handleAddComponent(c.type, c.defaultContent)}
        className="p-2 rounded-md border bg-white text-sm flex items-center gap-2"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {c.Icon ? React.createElement(c.Icon, { className: 'w-4 h-4 text-gray-600' }) : <span>{c.icon}</span>}
        <span>{c.label}</span>
      </button>
    );
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="mb-4 text-gray-800">Components</h3>
      
      <div className="mb-4">
        <h4 className="mb-2 text-sm text-gray-600">Basic</h4>
        <div className="grid gap-2">
          {componentTypes.map((c) => (
            <PaletteButton key={c.type} c={c} />
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="mb-2 text-sm text-gray-600">Advanced</h4>
        <div className="grid gap-2">
          {advancedComponents.map((c) => (
            <PaletteButton key={c.type} c={c} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;

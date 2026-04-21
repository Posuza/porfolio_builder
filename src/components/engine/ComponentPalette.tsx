import React, { useMemo, useState } from 'react';
import { usePortfolioStore } from '../../store/store';
import { useDrag } from 'react-dnd';
import { FiType, FiFileText, FiImage, FiSquare, FiCreditCard, FiList, FiMessageSquare, FiMinus } from 'react-icons/fi';

type ComponentPaletteProps = {
  onRequestLayout?: () => void;
};

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onRequestLayout }) => {
  const { addComponent, currentPageId, getComponentsByPage, components } = usePortfolioStore();
  const [noLayoutWarning, setNoLayoutWarning] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'basic' | 'advanced'>('all');

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

  const pageComponents = useMemo(() => {
    if (typeof getComponentsByPage === 'function' && currentPageId) {
      return getComponentsByPage(currentPageId);
    }
    return components || [];
  }, [getComponentsByPage, currentPageId, components]);

  const hasLayout = useMemo(() => {
    return (pageComponents || []).some((c: any) => c.type === 'section' || c.type === 'layout');
  }, [pageComponents]);

  const handleAddComponent = (type: any, defaultContent: string) => {
    // Prevent adding components directly to the top-level canvas when there
    // are no sections/layouts. Require a section to exist and add into it.
    // allow adding into either legacy `section` nodes or the newer `layout` containers
    const sections = currentPageId ? (getComponentsByPage(currentPageId) || []).filter((c: any) => c.type === 'section' || c.type === 'layout') : [];
    if (sections.length === 0) {
      setNoLayoutWarning(true);
      setTimeout(() => setNoLayoutWarning(false), 3500);
      return;
    }
    setNoLayoutWarning(false);

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
      canDrag: hasLayout,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }), [c, hasLayout]);

    const disabled = !hasLayout;

    return (
      <button
        ref={drag as any}
        onClick={() => {
          if (disabled) {
            setNoLayoutWarning(true);
            onRequestLayout?.();
            return;
          }
          handleAddComponent(c.type, c.defaultContent);
        }}
        disabled={disabled}
        title={disabled ? 'Create a layout first' : c.label}
        className={` p-1 md:p-2 rounded-[4px] rounded-md border text-sm flex items-center gap-2 ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
        }`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {c.Icon ? React.createElement(c.Icon, { className: 'w-4 h-4 text-gray-600' }) : <span>{c.icon}</span>}
        <span className="hidden md:inline">{c.label}</span>
      </button>
    );
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filterList = (list: any[]) =>
    list.filter((c) => {
      if (!normalizedQuery) return true;
      return c.label.toLowerCase().includes(normalizedQuery) || c.type.toLowerCase().includes(normalizedQuery);
    });

  const basicList = category === 'advanced' ? [] : filterList(componentTypes);
  const advancedList = category === 'basic' ? [] : filterList(advancedComponents);

  return (
    <div>
      <div className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components..."
          className="w-full px-2 py-1 text-xs md:text-sm border rounded"
        />
        <div className="mt-2 flex flex-wrap lg:flex-nowrap items-center gap-1 lg:gap-2">
          {(['all', 'basic', 'advanced'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-[8px] md:text-xs px-1 md:px-2 py-[3px] md:py-1 rounded border capitalize shrink-0 ${
                category === c ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {noLayoutWarning && (
        <div className="mb-3 p-2 rounded bg-amber-100 border border-amber-400 text-amber-800 text-[8px] md:text-xs">
          Add a layout template first, then drop components into it.
        </div>
      )}

      {!hasLayout && (
        <button
          onClick={() => onRequestLayout?.()}
          className="mb-3 w-full text-[8px] md:text-xs px-2 py-1 rounded border bg-white hover:bg-gray-50 text-gray-700"
        >
          Create a layout to add components
        </button>
      )}

      {basicList.length > 0 && (
        <div className="mb-2 md:mb-4">
          <h4 className="mb-2 text-[10px] md:text-xs font-bold text-gray-600">Basic</h4>
          <div className="grid gap-0.5 md:gap-2">
            {basicList.map((c) => (
              <PaletteButton key={c.type} c={c} />
            ))}
          </div>
        </div>
      )}

      {advancedList.length > 0 && (
        <div >
          <h4 className="mb-2 text-[10px] md:text-xs font-bold text-gray-600">Advanced</h4>
          <div className="grid gap-0.5 md:gap-2">
            {advancedList.map((c) => (
              <PaletteButton key={c.type} c={c} />
            ))}
          </div>
        </div>
      )}

      {basicList.length === 0 && advancedList.length === 0 && (
        <div className="text-[8px] md:text-xs text-gray-500">No components match your search.</div>
      )}
    </div>
  );
};

export default ComponentPalette;

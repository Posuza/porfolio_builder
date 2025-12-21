import React from 'react';
import { useDrop } from 'react-dnd';
import { usePortfolioStore } from '../../store/store';
import DraggableItem from './DraggableItem';

export const Canvas: React.FC = () => {
  const { components } = usePortfolioStore();
  const { getCurrentLayout } = usePortfolioStore();
  const layout = getCurrentLayout?.();

  const borderColor = layout?.settings?.accentColor || '#e5e7eb';
  const bg = layout?.settings?.surfaceColor || layout?.settings?.backgroundColor || '#f8fafc';
  const textColor = layout?.settings?.textColor || '#111827';

  // Render only top-level components (no parentId) and allow sections to accept drops
  // Be defensive: components may contain undefined/null entries during transitions
  const topLevel = Array.isArray(components)
    ? components.filter((c: any) => c && (c.parentId === undefined || c.parentId === null))
    : [];

  const { updateComponent, addComponent, currentPageId } = usePortfolioStore();

  // top-level drop: only accept layout templates dropped onto the canvas itself
  const [{ isOverCanvas }, canvasDrop] = useDrop(() => ({
    accept: ['new-layout'],
    drop: (item: any, monitor) => {
      // if a nested drop target already handled this drop, don't also create
      // a top-level layout (prevents duplicate creations when dropping
      // onto a section which also accepts 'new-layout').
      if (monitor.didDrop && monitor.didDrop()) return;

      const t = monitor.getItemType();
      if (t === 'new-layout') {
        const template = item.template;
        const baseStyles: any = { padding: '20px', backgroundColor: 'transparent', color: '#111827' };
        let styles: any = {};
        let norm = template;
        if (template === 'verticle-column' || template === 'verticle_column' || template === 'vertical-column') norm = 'single-column';
        if (template === 'horizontal_columns' || template === 'horizontal-columns' || template === 'column-more' || template === 'column_more') norm = 'column-more';

        switch (norm) {
          case 'single-column':
            styles = {};
            break;
          case 'column-more':
            styles = { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' };
            break;
          case 'grid':
            styles = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' };
            break;
          case 'uneven-grid':
            styles = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' };
            break;
          default:
            styles = {};
        }

        // create a single layout node (container). The layout acts as a section
        // itself so we no longer create inner `section` children here.
        const layoutId = Date.now().toString();
        setTimeout(() => {
          addComponent({
            id: layoutId,
            type: 'layout',
            content: '',
            template: norm,
            icon: norm,
            styles: { ...baseStyles, ...styles, border: `1px dashed ${borderColor}` },
            position: { x: 0, y: 0 },
            pageId: currentPageId || 'default',
          });
        }, 0);
      }
    },
    collect: (monitor) => ({ isOverCanvas: monitor.isOver() }),
  }), [addComponent, currentPageId]);

  const SectionContainer: React.FC<{ component: any; childrenComponents: any[] }> = ({ component, childrenComponents }) => {
    const { selectComponent, selectedComponent, deleteComponent } = usePortfolioStore();
    // keep dependencies small and stable to avoid target re-registration while dragging
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ['component', 'new-component', 'new-layout'],
      drop: (item: any, monitor) => {
        // if a deeper nested target handled this drop, don't duplicate work
        if (monitor.didDrop && monitor.didDrop()) return { handled: false };
        const t = monitor.getItemType();
        if (!item) return { handled: false };
        if (t === 'component') {
          if (!component || !component.id) return { handled: false };
          // defer reparenting until after the drop cycle to avoid
          // re-registering drop targets while react-dnd is processing
          setTimeout(() => updateComponent(item.id, { parentId: component.id }), 0);
          return { handled: true };
        }

        if (t === 'new-component') {
          if (!component || !component.id) return { handled: false };
          setTimeout(() => {
            addComponent({
              type: item.type,
              content: item.content,
              styles: item.styles || {},
              position: { x: 0, y: 0 },
              parentId: component.id,
              pageId: component.pageId,
            });
          }, 0);
          return { handled: true };
        }

        if (t === 'new-layout') {
          if (!component || !component.id) return { handled: false };
          const template = item.template;
          const baseStyles: any = { padding: component.styles?.padding || '20px', backgroundColor: 'transparent', color: component.styles?.color || '#111827' };
          let styles: any = {};
          let norm = template;
          if (template === 'verticle-column' || template === 'verticle_column' || template === 'vertical-column') norm = 'single-column';
          if (template === 'horizontal_columns' || template === 'horizontal-columns' || template === 'column-more' || template === 'column_more') norm = 'column-more';

          switch (norm) {
            case 'single-column':
              styles = {};
              break;
            case 'column-more':
              styles = { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' };
              break;
            case 'grid':
              styles = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' };
              break;
            case 'uneven-grid':
              styles = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' };
              break;
            default:
              styles = {};
          }

          const layoutId = Date.now().toString();
          // defer creating nested layout/container and its child sections
          // until after the current drop finishes to avoid altering the
          // set of registered drop targets mid-drag (which triggers
          // react-dnd invariants).
          setTimeout(() => {
            // create nested layout container only — no inner `section` children
            addComponent({
              id: layoutId,
              type: 'layout',
              content: '',
              template: norm,
              icon: norm,
              styles: { ...baseStyles, ...styles, border: `1px dashed ${borderColor}` },
              position: { x: 0, y: 0 },
              parentId: component.id,
              pageId: component.pageId,
            });
          }, 0);
          return { handled: true };
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }), [addComponent, updateComponent]);

    const isSelected = selectedComponent === component.id;

    return (
      <section
        ref={drop as any}
        key={component.id}
        style={{ ...component.styles, transition: 'box-shadow 150ms, transform 150ms' }}
        className={`mb-4 relative ${isSelected ? 'outline outline-2 outline-sky-300' : ''} ${isOver && canDrop ? 'shadow-lg transform scale-[1.01]' : ''}`}
        onClick={(e) => { e.stopPropagation(); selectComponent(component.id); }}
      >
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteComponent(component.id);
            }}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center z-20"
            aria-label="Delete section"
            title="Delete section"
          >
            ×
          </button>
        )}

          {childrenComponents.map((child: any, i: number) => {
            // treat both legacy `section` and current `layout` container types
            // as nested section/containers so we don't create or expect
            // an inner autogenerated `section` node anywhere.
            if (child?.type === 'section' || child?.type === 'layout') {
              const nested = Array.isArray(components)
                ? components.filter((c: any) => c && c.parentId === child.id && c.pageId === child.pageId)
                : [];
              return <SectionContainer key={child.id} component={child} childrenComponents={nested} />;
            }

          // compute global index for reordering when possible
          const globalIndex = Array.isArray(components) ? components.findIndex((c: any) => c && c.id === child.id) : i;
          return <DraggableItem key={child.id} component={child} index={globalIndex >= 0 ? globalIndex : i} />;
        })}
      </section>
    );
  };

  return (
    <div ref={canvasDrop as any} className={`min-h-[400px] rounded-lg p-6 transition-colors ${isOverCanvas ? 'bg-blue-50' : ''}`} style={{ border: `2px dashed ${borderColor}`, backgroundColor: bg, color: textColor }}>
      <h3 className="text-center mb-4" style={{ color: textColor }}>Portfolio Canvas</h3>
      {topLevel.length === 0 ? (
        <div className="mx-auto max-w-xl text-center p-6">
          <div style={{ border: `1px solid ${borderColor}`, borderRadius: 8, padding: 16, background: layout?.settings?.backgroundColor || '#ffffff' }}>
            <h4 style={{ margin: 0, color: textColor }}>Sample Heading</h4>
            <p style={{ color: textColor, marginTop: 8 }}>This is a sample text block that follows the selected theme's text and background colors.</p>
            <div style={{ marginTop: 12 }}>
              <button style={{ background: layout?.settings?.accentColor || '#3b82f6', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none' }}>Primary Action</button>
            </div>
          </div>
          <div className="text-gray-500 mt-4">Add components to build your portfolio</div>
        </div>
      ) : (
        topLevel.map((component: any, index: number) => {
          if (!component) return null;
          if (component.type === 'section' || component.type === 'layout') {
            const children = Array.isArray(components)
              ? components.filter((c: any) => c && c.parentId === component.id && c.pageId === component.pageId)
              : [];
            return <SectionContainer key={component.id} component={component} childrenComponents={children} />;
          }

          return <DraggableItem key={component.id} component={component} index={index} />;
        })
      )}
    </div>
  );
};

export default Canvas;

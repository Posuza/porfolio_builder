import React, { useRef, useState, useEffect } from 'react';
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

  // zoom / scale helpers to prevent content overflow on the canvas
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  // Render only top-level components (no parentId) and allow sections to accept drops
  // Be defensive: components may contain undefined/null entries during transitions
  const topLevel = Array.isArray(components)
    ? components.filter((c: any) => c && (c.parentId === undefined || c.parentId === null))
    : [];

  const clampZoom = (v: number) => Math.max(0.25, Math.min(2, v));
  const handleZoom = (delta: number) => setZoom((z) => clampZoom(Number((z + delta).toFixed(2))));

  // Fit behavior: don't compress content below a sensible minimum so
  // layouts/components remain readable and internal layout rules don't
  // collapse visually. This MIN_FIT_SCALE only affects automatic/"Fit"
  // calculations; manual zoom still uses the broader clamp above.
  const MIN_FIT_SCALE = 0.75;
  const handleFit = () => {
    if (!outerRef.current || !innerRef.current) return;
    const outerW = outerRef.current.clientWidth || outerRef.current.offsetWidth || 1;
    const contentW = innerRef.current.scrollWidth || innerRef.current.offsetWidth || outerW;
    // compute raw target then clamp to [MIN_FIT_SCALE, 1]
    const raw = outerW / (contentW || outerW) || 1;
    const target = Math.max(MIN_FIT_SCALE, Math.min(1, raw));
    setZoom(Number(target.toFixed(2)));
  };

  // debounce handler for auto-fit on content/resize changes
  const fitDebounceRef = useRef<number | null>(null);
  // track last measured inner content width so we only react to meaningful changes
  const lastContentWidthRef = useRef<number | null>(null);
  // reactive zoom ref to avoid stale closures
  const zoomRef = useRef<number>(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  const scheduleFit = (delay = 100) => {
    if (fitDebounceRef.current) window.clearTimeout(fitDebounceRef.current);
    fitDebounceRef.current = window.setTimeout(() => {
      // measure and compute a sensible target scale that keeps content readable
      if (!outerRef.current || !innerRef.current) {
        fitDebounceRef.current = null;
        return;
      }

      const outerW = outerRef.current.clientWidth || outerRef.current.offsetWidth || 1;
      const contentW = innerRef.current.scrollWidth || innerRef.current.offsetWidth || outerW;

      // ignore tiny fluctuations
      const prev = lastContentWidthRef.current;
      if (prev !== null && Math.abs(prev - contentW) < 4) {
        fitDebounceRef.current = null;
        return;
      }

      lastContentWidthRef.current = contentW;

      // if content is wider than the outer container, scale down but not below MIN_FIT_SCALE
      if (contentW > outerW) {
        const raw = outerW / (contentW || outerW) || 1;
        const target = Math.max(MIN_FIT_SCALE, Math.min(1, raw));
        setZoom(Number(target.toFixed(2)));
      } else {
        // content fits inside outer; if we're currently scaled down (<1), gently restore toward 1
        if (zoomRef.current < 1) {
          const raw = outerW / (contentW || outerW) || 1;
          const target = Math.min(1, Math.max(MIN_FIT_SCALE, raw));
          setZoom(Number(target.toFixed(2)));
        }
      }

      fitDebounceRef.current = null;
    }, delay) as unknown as number;
  };

  // auto-fit when top-level content or layout width changes and on window resize
  const topLevelIds = topLevel.map((c: any) => c.id).join(',');
  useEffect(() => {
    scheduleFit(120);
    const onResize = () => scheduleFit(80);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (fitDebounceRef.current) window.clearTimeout(fitDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topLevelIds, layout?.settings?.maxWidth]);

  // Observe content size changes inside the inner wrapper to auto-fit when
  // components are added/removed or when a layout expands its children.
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    let obs: ResizeObserver | null = null;
    if (innerRef.current) {
      obs = new ResizeObserver(() => scheduleFit(60));
      obs.observe(innerRef.current);
    }
    return () => {
      if (obs && innerRef.current) obs.unobserve(innerRef.current);
      obs = null;
    };
    // intentionally track only the ref target; do not add scheduleFit to deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add mouse-wheel (with Ctrl/Cmd), keyboard (+/-/0), and touch-pinch zoom support.
  const pinchRef = useRef<{ active: boolean; startDist: number; startZoom: number }>({ active: false, startDist: 0, startZoom: 1 });

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;

    const getTouchDist = (touches: TouchList) => {
      const a = touches[0];
      const b = touches[1];
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      return Math.hypot(dx, dy);
    };

    const handleWheel = (e: WheelEvent) => {
      // common pattern: use Ctrl/Cmd + wheel to zoom (avoid interfering with scroll)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom((z) => clampZoom(Number((z + delta).toFixed(2))));
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      // '+' (or '=') to zoom in, '-' to zoom out, '0' to fit
      if (e.key === '+' || (e.key === '=' && e.shiftKey)) {
        e.preventDefault();
        setZoom((z) => clampZoom(Number((z + 0.1).toFixed(2))));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoom((z) => clampZoom(Number((z - 0.1).toFixed(2))));
      } else if (e.key === '0') {
        e.preventDefault();
        handleFit();
      }
    };

    const handleTouchStart = (ev: TouchEvent) => {
      if (ev.touches && ev.touches.length === 2) {
        const d = getTouchDist(ev.touches);
        pinchRef.current = { active: true, startDist: d, startZoom: zoomRef.current };
      }
    };

    const handleTouchMove = (ev: TouchEvent) => {
      if (!pinchRef.current.active) return;
      if (!(ev.touches && ev.touches.length === 2)) return;
      ev.preventDefault();
      const d = getTouchDist(ev.touches);
      const ratio = d / (pinchRef.current.startDist || 1);
      const next = clampZoom(Number((pinchRef.current.startZoom * ratio).toFixed(2)));
      setZoom(next);
    };

    const handleTouchEnd = () => {
      pinchRef.current.active = false;
    };

    window.addEventListener('keydown', handleKey, { passive: false });
    outer.addEventListener('wheel', handleWheel, { passive: false });
    outer.addEventListener('touchstart', handleTouchStart, { passive: false });
    outer.addEventListener('touchmove', handleTouchMove, { passive: false });
    outer.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKey);
      outer.removeEventListener('wheel', handleWheel);
      outer.removeEventListener('touchstart', handleTouchStart);
      outer.removeEventListener('touchmove', handleTouchMove);
      outer.removeEventListener('touchend', handleTouchEnd);
    };
    // only attach once per outer element; deps intentionally limited
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerRef.current]);


  const { updateComponent, addComponent, currentPageId } = usePortfolioStore();

  // keep stable refs for store callbacks/values so drop targets don't
  // re-register while a drag is in progress (causes react-dnd invariants)
  const addComponentRef = useRef(addComponent);
  const updateComponentRef = useRef(updateComponent);
  const currentPageIdRef = useRef(currentPageId);
  useEffect(() => { addComponentRef.current = addComponent; }, [addComponent]);
  useEffect(() => { updateComponentRef.current = updateComponent; }, [updateComponent]);
  useEffect(() => { currentPageIdRef.current = currentPageId; }, [currentPageId]);
  // top-level drop: only accept layout templates dropped onto the canvas itself
  const [{ isOverCanvas }, canvasDrop] = useDrop(() => ({
    accept: ['new-layout'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop && monitor.didDrop()) return;

      const t = monitor.getItemType();
      if (t === 'new-layout') {
        const template = item.template;
        const baseStyles: any = { padding: '20px', backgroundColor: 'transparent', color: '#111827' };
        let styles: any = {};
        let norm = template;
        if (template === 'verticle-column' || template === 'verticle_column' || template === 'vertical-column') norm = 'single-column';
        if (template === 'horizontal_columns' || template === 'horizontal-columns' || template === 'column-more' || template === 'column_more') norm = 'column-more';

        let gridCols: number | undefined = undefined;
        switch (norm) {
          case 'single-column':
            styles = {};
            gridCols = undefined;
            break;
          case 'column-more':
            styles = { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' };
            gridCols = 2;
            break;
          case 'grid':
            styles = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' };
            gridCols = 3;
            break;
          case 'uneven-grid':
            styles = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' };
            gridCols = undefined;
            break;
          default:
            styles = {};
        }

        const layoutId = Date.now().toString();
        setTimeout(() => {
          const addFn = addComponentRef.current;
          const pageId = currentPageIdRef.current || 'default';
          addFn && addFn({
            id: layoutId,
            type: 'layout',
            content: '',
            template: norm,
            icon: norm,
            styles: { ...baseStyles, ...styles, border: `1px dashed ${borderColor}` },
            gridColumns: gridCols,
            position: { x: 0, y: 0 },
            pageId,
          });
        }, 0);
      }
    },
    collect: (monitor) => ({ isOverCanvas: monitor.isOver() }),
  }), []);

  const SectionContainer: React.FC<{ component: any; childrenComponents: any[] }> = ({ component, childrenComponents }) => {
    const { selectComponent, selectedComponent, deleteComponent } = usePortfolioStore();
    // keep dependencies small and stable to avoid target re-registration while dragging
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ['component', 'new-component', 'new-layout'],
      drop: (item: any, monitor) => {
        if (monitor.didDrop && monitor.didDrop()) return { handled: false };
        const t = monitor.getItemType();
        if (!item) return { handled: false };
        if (t === 'component') {
          if (!component || !component.id) return { handled: false };
          setTimeout(() => {
            const upd = updateComponentRef.current;
            upd && upd(item.id, { parentId: component.id });
          }, 0);
          return { handled: true };
        }

        if (t === 'new-component') {
          if (!component || !component.id) return { handled: false };
          setTimeout(() => {
            const addFn = addComponentRef.current;
            addFn && addFn({
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

          let gridCols: number | undefined = undefined;
          switch (norm) {
            case 'single-column':
              styles = {};
              gridCols = undefined;
              break;
            case 'column-more':
              styles = { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' };
              gridCols = 2;
              break;
            case 'grid':
              styles = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' };
              gridCols = 3;
              break;
            case 'uneven-grid':
              styles = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' };
              gridCols = undefined;
              break;
            default:
              styles = {};
          }

          const layoutId = Date.now().toString();
          setTimeout(() => {
            const addFn = addComponentRef.current;
            addFn && addFn({
              id: layoutId,
              type: 'layout',
              content: '',
              template: norm,
              icon: norm,
              styles: { ...baseStyles, ...styles, border: `1px dashed ${borderColor}` },
              gridColumns: gridCols,
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
    }), []);

    const isSelected = selectedComponent === component.id;
    // compute template-driven display to avoid user-supplied styles overriding layout behavior
    const templateKey = (component.template || component.icon || '').toString().toLowerCase();
    const applyGrid = /\bgrid\b/.test(templateKey) || templateKey === 'uneven-grid';
    const applyFlex = ['horizontal_columns','horizontal_more','horizontal-columns','column-more','column_more','columns'].some(k => templateKey.includes(k)) || /\bhorizontal\b/.test(templateKey);
    const computedDisplay = applyGrid ? 'grid' : (applyFlex ? 'flex' : 'block');

    const appliedStyles = {
      ...(component.styles || {}),
      display: computedDisplay,
      gridTemplateColumns: applyGrid ? (templateKey === 'uneven-grid' ? '2fr 1fr' : 'repeat(3,1fr)') : undefined,
      gap: component.styles?.gap || layout?.settings?.gap || undefined,
      transition: 'box-shadow 150ms, transform 150ms',
    } as React.CSSProperties;

    return (
      <section
        ref={drop as any}
        key={component.id}
        style={appliedStyles}
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
    <div
      // merge react-dnd ref with our outerRef so drop target still works
      ref={(el) => { (canvasDrop as any)(el); outerRef.current = el; }}
      className={`min-h-[400px] rounded-lg p-6 transition-colors relative ${isOverCanvas ? 'bg-blue-50' : ''}`}
      style={{ border: `2px dashed ${borderColor}`, backgroundColor: bg, color: textColor }}
    >
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-30 flex items-center gap-2 bg-white/80 p-1 rounded shadow-sm">
        <button aria-label="Zoom out" onClick={() => handleZoom(-0.1)} className="px-2 py-1 bg-white border rounded">−</button>
        <div className="text-xs px-2">{Math.round(zoom * 100)}%</div>
        <button aria-label="Zoom in" onClick={() => handleZoom(0.1)} className="px-2 py-1 bg-white border rounded">+</button>
        <button aria-label="Fit" onClick={handleFit} className="px-2 py-1 bg-white border rounded">Fit</button>
      </div>
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
        // inner wrapper is scaled to prevent layout overflow while preserving
        // correct visual proportions. use top-left origin to avoid odd
        // horizontal compression centering and keep width compensation.
        <div ref={innerRef} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: `${100 / zoom}%`, transition: 'transform 120ms' }}>
          {topLevel.map((component: any, index: number) => {
            if (!component) return null;
            if (component.type === 'section' || component.type === 'layout') {
              const children = Array.isArray(components)
                ? components.filter((c: any) => c && c.parentId === component.id && c.pageId === component.pageId)
                : [];
              return <SectionContainer key={component.id} component={component} childrenComponents={children} />;
            }

            return <DraggableItem key={component.id} component={component} index={index} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Canvas;

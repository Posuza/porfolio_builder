import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/store';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string | undefined> = {
  desktop: undefined,  // full width
  tablet: '768px',
  mobile: '375px',
};

const VIEWPORT_LABELS: Record<Viewport, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

export const PreviewMode: React.FC = () => {
  const { components, getCurrentLayout, currentPageId, getComponentsByPage } = usePortfolioStore();
  const layout = getCurrentLayout();
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const containerStyle: React.CSSProperties = {
    maxWidth: layout?.settings.maxWidth || '1200px',
    margin: '0 auto',
    padding: layout?.settings.padding || '20px',
    backgroundColor: layout?.settings.backgroundColor || 'white',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  const pageComponents = typeof getComponentsByPage === 'function' && currentPageId
    ? getComponentsByPage(currentPageId)
    : components || [];

  const topLevel = (pageComponents || []).filter((c: any) => !c.parentId);

  const renderNode = (component: any): React.ReactNode => {
    const children = (pageComponents || []).filter((c: any) => c.parentId === component.id);

    if (component.type === 'layout') {
      const template = (component.template || component.icon || '').toString().toLowerCase();

      const horizontalKeys = [
        'horizontal_columns',
        'horizontal_more',
        'horizontal-columns',
        'column-more',
        'column_more',
        'columns',
        'two-column',
        'two_columns',
        'three-column',
        'three_columns',
      ];
      const verticalKeys = [
        'verticle-column',
        'verticle_column',
        'vertical-column',
        'vertical_column',
        'single_column',
        'single-column',
      ];

      const isGrid = /\bgrid\b/.test(template);
      const isHorizontal = horizontalKeys.some((k) => template.includes(k)) || /\bhorizontal\b/.test(template);
      const isVertical = verticalKeys.some((k) => template.includes(k)) || /\b(vertical|single|verticle)\b/.test(template);

      const layoutGap = component.styles?.gap || layout?.settings?.gap || '16px';

      let display: React.CSSProperties['display'] = 'block';
      if (isGrid) display = 'grid';
      else if (isHorizontal) display = 'flex';
      else if (isVertical) display = 'block';

      const layoutStyle: React.CSSProperties = {
        ...(component.styles || {}),
        display,
        gap: layoutGap,
        gridTemplateColumns: isGrid ? (template === 'uneven-grid' && children.length === 2 ? '2fr 1fr' : 'repeat(auto-fit,minmax(150px,1fr))') : undefined,
        alignItems: isHorizontal ? 'stretch' : undefined,
      };

      return (
        <div key={component.id} style={{ ...layoutStyle, marginBottom: '16px' }}>
          {children.map((ch: any) => (
            <div key={ch.id} style={display === 'flex' ? { flex: 1 } : undefined}>
              {renderNode(ch)}
            </div>
          ))}
        </div>
      );
    }

    switch (component.type) {
      case 'header':
        return <h1 style={component.styles}>{component.content}</h1>;
      case 'text':
        return <p style={component.styles}>{component.content}</p>;
      case 'image':
        return (
          <img
            src={component.content}
            alt="Portfolio"
            style={{ ...component.styles, maxWidth: '100%', height: 'auto' }}
          />
        );
      case 'button':
        return <button style={component.styles}>{component.content}</button>;
      case 'section':
        return <section style={component.styles}>{component.content}</section>;
      case 'card':
        return <div style={{ ...component.styles, border: `1px solid ${layout?.settings?.accentColor || '#ddd'}`, borderRadius: '8px', padding: '12px' }}>{component.content}</div>;
      case 'list':
        return <div style={component.styles}>{component.content}</div>;
      case 'quote':
        return <blockquote style={component.styles}>{component.content}</blockquote>;
      case 'divider':
        return <hr style={{ ...component.styles, border: 'none', borderTop: `2px solid ${layout?.settings?.accentColor || '#ddd'}`, margin: '20px 0' }} />;
      default:
        return <div style={component.styles}>{component.content}</div>;
    }
  };

  const viewportWidth = VIEWPORT_WIDTHS[viewport];

  return (
    <div>
      {/* Viewport toggle bar */}
      <div className="flex items-center justify-center gap-2 py-3 bg-gray-100 border-b sticky top-0 z-10">
        {(Object.keys(VIEWPORT_WIDTHS) as Viewport[]).map((vp) => (
          <button
            key={vp}
            onClick={() => setViewport(vp)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewport === vp
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {VIEWPORT_LABELS[vp]}
          </button>
        ))}
      </div>

      {/* Preview frame */}
      <div
        style={{
          overflowX: 'auto',
          padding: viewport !== 'desktop' ? '24px' : '0',
          backgroundColor: viewport !== 'desktop' ? '#e5e7eb' : undefined,
          minHeight: '80vh',
        }}
      >
        <div
          style={{
            width: viewportWidth,
            margin: viewportWidth ? '0 auto' : undefined,
            boxShadow: viewportWidth ? '0 4px 24px rgba(0,0,0,0.15)' : undefined,
            borderRadius: viewportWidth ? '8px' : undefined,
            overflow: viewportWidth ? 'hidden' : undefined,
            transition: 'width 0.3s ease',
          }}
        >
          <div style={containerStyle} className="mx-auto">
            {topLevel.length > 0 ? (
              topLevel.map((node: any) => (
                <div key={node.id} style={{ marginBottom: '12px' }}>
                  {renderNode(node)}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '60px 20px', fontSize: '18px' }}>
                Your portfolio preview will appear here once you add components.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMode;

import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/store';
import {
  getPageShellStyle,
  getResolvedLayoutSettings,
  resolveLayoutComponentStyles,
} from '../../utils/layout';

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
  const resolvedLayout = getResolvedLayoutSettings(layout?.settings);
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const containerStyle: React.CSSProperties = {
    ...getPageShellStyle(layout?.settings),
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
      const layoutStyle = resolveLayoutComponentStyles(component, layout?.settings);

      return (
        <div key={component.id} style={{ ...layoutStyle, marginBottom: '16px' }}>
          {children.map((ch: any) => (
            <div key={ch.id}>
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
        return <div style={{ ...component.styles, border: `1px solid ${resolvedLayout.accentColor}`, borderRadius: '8px', padding: '12px' }}>{component.content}</div>;
      case 'list':
        return <div style={component.styles}>{component.content}</div>;
      case 'quote':
        return <blockquote style={component.styles}>{component.content}</blockquote>;
      case 'divider':
        return <hr style={{ ...component.styles, border: 'none', borderTop: `2px solid ${resolvedLayout.accentColor}`, margin: '20px 0' }} />;
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
                <div style={{ textAlign: 'center', color: resolvedLayout.textColor, padding: '60px 20px', fontSize: '18px' }}>
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

import React from 'react';
import { usePortfolioStore } from '../../store/store';

export const PreviewMode: React.FC = () => {
  const { components, getCurrentLayout } = usePortfolioStore();
  const layout = getCurrentLayout();
  const containerStyle: React.CSSProperties = {
    maxWidth: layout?.settings.maxWidth || '1200px',
    margin: '0 auto',
    padding: layout?.settings.padding || '20px',
    backgroundColor: layout?.settings.backgroundColor || 'white',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  return (
    <div style={containerStyle} className="mx-auto">
        {components.filter((c:any)=>c.type!=='layout').map((component) => {
          const renderComponent = () => {
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
                    style={{ 
                      ...component.styles, 
                      maxWidth: '100%', 
                      height: 'auto' 
                    }} 
                  />
                );
              case 'button':
                return <button style={component.styles}>{component.content}</button>;
              case 'section':
                return <section style={component.styles}>{component.content}</section>;
              case 'card':
                return <div style={{...component.styles, border: `1px solid ${layout?.settings?.accentColor || '#ddd'}`, borderRadius: '8px', padding: '12px'}}>{component.content}</div>;
              case 'list':
                return <div style={component.styles}>{component.content}</div>;
              case 'quote':
                return <blockquote style={component.styles}>{component.content}</blockquote>;
              case 'divider':
                return <hr style={{...component.styles, border: 'none', borderTop: `2px solid ${layout?.settings?.accentColor || '#ddd'}`, margin: '20px 0'}} />;
              default:
                return <div>{component.content}</div>;
            }
          };

          return (
            <div key={component.id} style={{ marginBottom: '16px' }}>
              {renderComponent()}
            </div>
          );
        })}
        
        {components.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '60px 20px',
            fontSize: '18px'
          }}>
            Your portfolio preview will appear here once you add components.
          </div>
        )}
    </div>
  );
};

export default PreviewMode;

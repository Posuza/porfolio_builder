import React from 'react';
import { usePortfolioStore } from '../store/store';

export const PreviewMode: React.FC = () => {
  const { components } = usePortfolioStore();

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {components.map((component) => {
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
                return (
                  <button 
                    style={{
                      ...component.styles,
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    {component.content}
                  </button>
                );
              case 'section':
                return (
                  <section style={component.styles}>
                    {component.content}
                  </section>
                );
              case 'card':
                return (
                  <div style={{...component.styles, border: '1px solid #ddd', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    {component.content}
                  </div>
                );
              case 'list':
                return (
                  <ul style={component.styles}>
                    {component.content.split('\n').map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                );
              case 'quote':
                return (
                  <blockquote style={{...component.styles, borderLeft: '4px solid #007bff', paddingLeft: '16px', fontStyle: 'italic', margin: '20px 0'}}>
                    {component.content}
                  </blockquote>
                );
              case 'divider':
                return <hr style={{...component.styles, border: 'none', borderTop: '2px solid #ddd', margin: '20px 0'}} />;
              default:
                return <div style={component.styles}>{component.content}</div>;
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
    </div>
  );
};
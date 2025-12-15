import React, { useState } from 'react';
import { ComponentPalette } from './components/ComponentPalette';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { PreviewMode } from './components/PreviewMode';

import { LayoutManager } from './components/LayoutManager';
import { ThemeManager } from './components/ThemeManager';
import { AdvancedControls } from './components/AdvancedControls';
import { usePortfolioStore } from './store/store';

function App() {
  const { components } = usePortfolioStore();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const exportPortfolio = () => {
    const portfolioData = JSON.stringify(components, null, 2);
    const blob = new Blob([portfolioData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPortfolio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          // You would need to add an import function to the store
          console.log('Import data:', data);
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  if (isPreviewMode) {
    return (
      <div>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '12px 20px',
          borderBottom: '1px solid #ddd',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>📱 Portfolio Preview</h3>
          <button
            onClick={() => setIsPreviewMode(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Editor
          </button>
        </div>
        <div style={{ paddingTop: '60px' }}>
          <PreviewMode />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
        {/* Left Sidebar - Component Palette */}
        <div style={{ 
          width: '280px', 
          padding: '12px', 
          backgroundColor: 'white',
          borderRight: '1px solid #ddd',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>🎨 Portfolio Builder</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={exportPortfolio}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  📥 Export
                </button>
                <label style={{
                  padding: '8px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  flex: 1,
                  textAlign: 'center'
                }}>
                  📤 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importPortfolio}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <button
                onClick={() => setIsPreviewMode(true)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                👁️ Preview Portfolio
              </button>
            </div>
          </div>

          <LayoutManager />
          <ThemeManager />
          <ComponentPalette />
          <AdvancedControls />
        </div>

        {/* Main Canvas Area */}
        <div style={{ 
          flex: 1, 
          padding: '16px',
          overflow: 'auto'
        }}>
          <Canvas />
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div style={{ 
          width: '300px', 
          padding: '16px', 
          backgroundColor: 'white',
          borderLeft: '1px solid #ddd',
          overflowY: 'auto'
        }}>
          <PropertyPanel />
        </div>
      </div>
  );
}

export default App;
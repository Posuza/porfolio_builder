import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LayoutManager } from '../components/engine/LayoutManager';
import { ThemeManager } from '../components/engine/ThemeManager';
import { ComponentPalette } from '../components/engine/ComponentPalette';
import { AdvancedControls } from '../components/engine/AdvancedControls';
import { Canvas } from '../components/engine/Canvas';
import { PropertyPanel } from '../components/engine/PropertyPanel';
import { usePortfolioStore } from '../store/store';

export const BuilderPage: React.FC = () => {
  const { setCurrentPage, getCurrentLayout } = usePortfolioStore();
  const { pageId } = useParams<{ pageId?: string }>();

  useEffect(() => {
    if (pageId) setCurrentPage(pageId);
  }, [pageId, setCurrentPage]);

  const layout = getCurrentLayout();
  const layoutStyle: React.CSSProperties = {
    maxWidth: layout?.settings.maxWidth || '100%',
    padding: layout?.settings.padding || '0',
    backgroundColor: layout?.settings.backgroundColor || 'transparent',
    margin: '0 auto',
  };

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      {/* Left Sidebar - Component Palette */}
      <aside className="w-72 p-3 bg-white border-r overflow-y-auto">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">🎨 Portfolio Builder</h2>
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              {/* export/import buttons kept in AdvancedControls */}
            </div>
            <Link to="/studio/preview" className="w-full mt-2 py-2 px-3 bg-teal-500 text-white rounded text-sm text-center">👁️ Preview Portfolio</Link>
          </div>
        </div>

        <LayoutManager />
        <ThemeManager />
        <ComponentPalette />
        <AdvancedControls />
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 p-4 overflow-auto">
        <div style={layoutStyle}>
          <Canvas />
        </div>
      </main>

      {/* Right Sidebar - Properties Panel */}
      <aside className="w-72 p-4 bg-white border-l overflow-y-auto">
        <PropertyPanel />
      </aside>
    </div>
  );
};

export default BuilderPage;

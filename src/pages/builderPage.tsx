import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutManager } from '../components/engine/LayoutManager';
import { ThemeManager } from '../components/engine/ThemeManager';
import { ComponentPalette } from '../components/engine/ComponentPalette';
import { AdvancedControls } from '../components/engine/AdvancedControls';
import { Canvas } from '../components/engine/Canvas';
import { PropertyPanel } from '../components/engine/PropertyPanel';
import StructureView from '../components/engine/StructureView';
import { usePortfolioStore } from '../store/store';

export const BuilderPage: React.FC = () => {
  const { setCurrentPage, getCurrentLayout } = usePortfolioStore();
  const { components, updateComponent } = usePortfolioStore();
  const { pageId } = useParams<{ pageId?: string }>();

  useEffect(() => {
    if (pageId) setCurrentPage(pageId);
  }, [pageId, setCurrentPage]);

  // Backfill `icon` field for existing components to ensure deterministic icons
  useEffect(() => {
    if (!components || components.length === 0) return;
    components.forEach((c: any) => {
      if (!c.icon) {
        const key = c.type === 'layout' ? (c.template || 'layout') : c.type;
        updateComponent?.(c.id, { icon: key });
      }
    });
  }, [components, updateComponent]);

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
        <ThemeManager />
        <LayoutManager />
        <ComponentPalette />
        <AdvancedControls />
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 p-4 overflow-auto">
        <div style={layoutStyle}>
          <Canvas />
        </div>
      </main>

      {/* Right Sidebar - Structure + Properties Panel */}
      <aside className="w-72 p-4 bg-white border-l overflow-y-auto">
        <StructureView />
        <PropertyPanel />
      </aside>
    </div>
  );
};

export default BuilderPage;

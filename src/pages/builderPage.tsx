import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { LayoutManager } from "../components/engine/LayoutManager";
import { ThemeManager } from "../components/engine/ThemeManager";
import {
  HiColorSwatch,
  HiTemplate,
  HiPuzzle,
  HiDownload,
} from "react-icons/hi";
import {
  BiSolidDockRight,
  BiDockRight,
  BiDockLeft,
  BiSolidDockLeft,
} from "react-icons/bi";
import { ComponentPalette } from "../components/engine/ComponentPalette";
import { AdvancedControls } from "../components/engine/AdvancedControls";
import { Canvas } from "../components/engine/Canvas";
import { PropertyPanel } from "../components/engine/PropertyPanel";
import StructureView from "../components/engine/StructureView";
import { PageManager } from "../components/engine/PageManager";
import { usePortfolioStore } from "../store/store";
import SidebarSection from "../components/engine/SidebarSection";
import { getPageShellStyle } from "../utils/layout";

export const BuilderPage: React.FC = () => {
  const { setCurrentPage, getCurrentLayout, selectedComponent } =
    usePortfolioStore();
  const { components, updateComponent } = usePortfolioStore();
  const { undo, redo, canUndo, canRedo } = usePortfolioStore();
  const { pageId } = useParams<{ pageId?: string }>();
  const [rightTab, setRightTab] = useState<"structure" | "properties">(
    "structure",
  );
  const [themeOpen, setThemeOpen] = useState(true);
  const [layoutOpen, setLayoutOpen] = useState(true);
  const [componentsOpen, setComponentsOpen] = useState(true);
  const [exportOpen, setExportOpen] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const layoutSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageId) setCurrentPage(pageId);
  }, [pageId, setCurrentPage]);

  // Keyboard shortcuts: Ctrl+Z = undo, Ctrl+Y / Ctrl+Shift+Z = redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept when user is typing in an input/textarea
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Backfill `icon` field for existing components to ensure deterministic icons
  useEffect(() => {
    if (!components || components.length === 0) return;
    components.forEach((c: any) => {
      if (!c.icon) {
        const key = c.type === "layout" ? c.template || "layout" : c.type;
        updateComponent?.(c.id, { icon: key });
      }
    });
  }, [components, updateComponent]);

  const layout = getCurrentLayout();
  const layoutStyle: React.CSSProperties = getPageShellStyle(layout?.settings);

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      {/* Left Sidebar - Component Palette */}
      {!leftSidebarOpen ? (
        <aside className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] z-30 w-10 md:w-14 p-0.5 md:p-1 ">
          <button
            onClick={() => setLeftSidebarOpen(true)}
            aria-label="Open sidebar menu"
            title="Open menu"
            className="glass-button w-7 h-7 rounded border border-white/50 hover:bg-gray-50 text-gray-700 flex items-center justify-center"
          >
            {React.createElement(BiDockLeft as any, {
              className: "w-6 h-6 md:w-6 md:h-6",
            })}
          </button>
        </aside>
      ) : (
        <aside className="glass-panel fixed top-14 left-0 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] z-30 w-20 md:w-40 lg:w-60 p-0.5 border-r border-white/40 shadow-sm overflow-hidden lg:static lg:h-auto lg:shadow-none">
          <div className=" flex justify-end">
            <button
              onClick={() => setLeftSidebarOpen(false)}
              aria-label="Close sidebar menu"
              title="Close menu"
              className=" w-8 h-8 md:w-10 md:h-10 text-gray-700 flex items-center justify-center "
            >
              {React.createElement(BiSolidDockLeft as any, {
                className: "w-5 h-5 md:w-6 md:h-6",
              })}
            </button>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2 h-full min-h-0 overflow-y-auto pr-0.5 pb-10">
            <SidebarSection
              title="Theme"
              open={themeOpen}
              onOpenChange={setThemeOpen}
              icon={HiColorSwatch}
            >
              <ThemeManager />
            </SidebarSection>
            <SidebarSection
              title="Layouts"
              open={layoutOpen}
              onOpenChange={setLayoutOpen}
              containerRef={layoutSectionRef}
              icon={HiTemplate}
            >
              <LayoutManager />
            </SidebarSection>
            <SidebarSection
              title="Components"
              open={componentsOpen}
              onOpenChange={setComponentsOpen}
              icon={HiPuzzle}
            >
              <ComponentPalette
                onRequestLayout={() => {
                  setLayoutOpen(true);
                  layoutSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />
            </SidebarSection>
            <SidebarSection
              title="Export"
              open={exportOpen}
              onOpenChange={setExportOpen}
              icon={HiDownload}
            >
              <AdvancedControls />
            </SidebarSection>
          </div>
        </aside>
      )}

      {/* Main Canvas Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-slate-200/50">
        {/* Page tabs bar */}
        <div className="p-2 bg-white border-b shrink-0">
          <PageManager />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="min-h-full p-2 md:p-4 lg:p-6">
            <div
              className="rounded-2xl shadow-sm ring-1 ring-slate-300/60"
              style={layoutStyle}
            >
              <Canvas />
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Structure + Properties Panel */}
      {!rightSidebarOpen ? (
        <aside className="fixed top-14 -right-2 md:-right-3 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] z-30 w-10 md:w-14 p-0.5 md:p-1 ">
          <button
            onClick={() => setRightSidebarOpen(true)}
            aria-label="Open right sidebar"
            title="Open"
            className="glass-button w-7 h-7 rounded border border-white/50 hover:bg-gray-50 text-gray-700 flex items-center justify-center"
          >
            {React.createElement(BiDockRight as any, {
              className: "w-6 h-6 md:w-6 md:h-6",
            })}
          </button>
        </aside>
      ) : (
        <aside className="glass-panel fixed top-14 right-0 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] z-30 w-40 md:w-60 p-1 border-l border-white/40 shadow-sm overflow-hidden lg:static lg:h-auto lg:shadow-none">
          <div className="flex items-start ">
            <button
              onClick={() => setRightSidebarOpen(false)}
              aria-label="Close sidebar menu"
              title="Close menu"
              className="w-8 h-8 md:w-10 md:h-10 text-gray-700 flex items-center justify-start "
            >
              {React.createElement(BiSolidDockRight as any, {
                className: "w-5 h-5 md:w-6 md:h-6",
              })}
            </button>
          </div>
          <div className="flex flex-col h-full min-h-0 overflow-y-hidden pb-10">
            {/* compoennt */}
            <div className="flex items-end gap-0.5">
              {(["structure", "properties"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  className={`flex-1 py-1  text-xs capitalize ${
                    rightTab === tab
                        ? "bg-sky-600 rounded-t border border-[1.5px] text-white border-gray-100"
                        : "bg-white rounded-t border text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {rightTab === "structure" && (
              <StructureView />
            )}
            {rightTab === "properties" && (
              <PropertyPanel selectedComponentId={selectedComponent} />
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default BuilderPage;

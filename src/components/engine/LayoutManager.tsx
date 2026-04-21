import React from "react";
import { useDrag } from 'react-dnd';
import { usePortfolioStore } from "../../store/store";
import type { Layout } from "../../store/slices/layoutSlice";
import { TiThMenuOutline, TiThSmallOutline } from "react-icons/ti";
import { LuColumns3 } from "react-icons/lu";
import { BsColumnsGap } from "react-icons/bs";
import type { IconType } from "react-icons";
import {
  getLayoutTemplateDefaults,
  getResolvedLayoutSettings,
  normalizeLayoutTemplate,
} from "../../utils/layout";

export const LayoutManager: React.FC = () => {
  const { addLayout, addComponent, currentPageId, getCurrentLayout } = usePortfolioStore();

  type Template = {
    id: string;
    name: string;
    Icon: IconType;
    template: Layout["template"];
  };

  const layoutTemplates: Template[] = [
    {
      id: "verticle_column",
      name: "Vertical Column",
      Icon: TiThMenuOutline,
      template: "verticle-column",
    },
    {
      id: "horizontal_more",
      name: "Horizontal Columns",
      Icon: LuColumns3,
      template: "horizontal_columns",
    },
    {
      id: "grid",
      name: "Grid Layout",
      Icon: TiThSmallOutline,
      template: "grid",
    },
    {
      id: "uneven_grid",
      name: "Uneven Grid",
      Icon: BsColumnsGap,
      template: "uneven-grid",
    },
  ];

  const handleAddLayout = (template: any, name: string) => {
    // Preserve current theme/colors when creating a new layout
    const activeLayout = getCurrentLayout?.();
    const baseSettings = getResolvedLayoutSettings(activeLayout?.settings);

    addLayout({
      name,
      template,
      settings: baseSettings,
    });

    // Create a single `layout` component on the current page for this template.
    // The layout itself will act as a section/container so we no longer create
    // inner `section` components here.
    if (currentPageId && addComponent) {
      const norm = normalizeLayoutTemplate(template);
      const layoutStyles = getLayoutTemplateDefaults(norm, baseSettings.gap);
      const gridCols =
        norm === "column-more" ? 2 : norm === "grid" ? 3 : undefined;

      // add a single layout container component to the page
      // include the normalized template name so the UI (StructureView) can
      // render the matching icon/label for this layout container
      addComponent({
        type: 'layout',
        content: '',
        template: norm,
        // also store an explicit icon key so StructureView can't pick a random icon
        icon: norm,
        styles: { ...baseSettings, ...layoutStyles },
        gridColumns: gridCols,
        position: { x: 0, y: 0 },
        pageId: currentPageId,
      });
    }
  };

  const LayoutButton: React.FC<{ t: Template }> = ({ t }) => {
    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: 'new-layout',
        item: { template: t.template, name: t.name },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
      }),
      [t]
    );

    const IconComp = t.Icon as unknown as React.ComponentType<{ className?: string }>;

    return (
      <button
        ref={drag as any}
        key={t.id}
        onClick={() => handleAddLayout(t.template, t.name)}
        className="p-1 md:p-1.5 rounded-md border bg-white  flex flex-col items-center"
        title={t.name}
        aria-label={t.name}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {React.createElement(IconComp, { className: 'w-4 h-4 mb-1 text-gray-600' })}
        <span className="text-[8px] md:text-[10px] align-middle">{t.name}</span>
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-2">
      {layoutTemplates.map((t) => (
        <LayoutButton key={t.id} t={t} />
      ))}
    </div>
  );
};

export default LayoutManager;

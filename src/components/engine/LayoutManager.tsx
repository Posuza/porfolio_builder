import React, { useState } from "react";
import { useDrag } from 'react-dnd';
import { usePortfolioStore } from "../../store/store";
import type { Layout } from "../../store/slices/layoutSlice";
import { TiThMenuOutline, TiThSmallOutline } from "react-icons/ti";
import { LuColumns3 } from "react-icons/lu";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { BsColumnsGap } from "react-icons/bs";
import type { IconType } from "react-icons";

export const LayoutManager: React.FC = () => {
  const { addLayout, addComponent, currentPageId, getCurrentLayout } = usePortfolioStore();
  const [formCollapse, setFormCollapse] = useState(false);

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
    const baseSettings = {
      maxWidth: '1200px',
      padding: '20px',
      backgroundColor: activeLayout?.settings?.backgroundColor || '#ffffff',
      surfaceColor: activeLayout?.settings?.surfaceColor,
      textColor: activeLayout?.settings?.textColor,
      accentColor: activeLayout?.settings?.accentColor,
      gap: activeLayout?.settings?.gap || '16px',
    };

    addLayout({
      name,
      template,
      settings: baseSettings,
    });

    // Create a single `layout` component on the current page for this template.
    // The layout itself will act as a section/container so we no longer create
    // inner `section` components here.
    if (currentPageId && addComponent) {
      // normalize some legacy/variant template keys to the expected names
      let norm = template;
      if (template === 'verticle-column' || template === 'verticle_column' || template === 'vertical-column') {
        norm = 'single-column';
      } else if (
        template === 'horizontal_columns' ||
        template === 'horizontal-columns' ||
        template === 'column-more' ||
        template === 'column_more'
      ) {
        norm = 'column-more';
      }

      let layoutStyles: any = {};
      switch (norm) {
        case 'single-column':
          layoutStyles = {};
          break;
        case 'column-more':
          layoutStyles = { display: 'grid', gridTemplateColumns: `repeat(2, 1fr)`, gap: baseSettings.gap };
          break;
        case 'grid':
          layoutStyles = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: baseSettings.gap };
          break;
        case 'uneven-grid':
          layoutStyles = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: baseSettings.gap };
          break;
        default:
          layoutStyles = {};
      }

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
        className="p-1.5 rounded-md border bg-white text-[10px] flex flex-col items-center"
        title={t.name}
        aria-label={t.name}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {React.createElement(IconComp, { className: 'w-4 h-4 mb-1 text-gray-600' })}
        <span className="align-middle">{t.name}</span>
      </button>
    );
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md mb-4">
      <div className="flex items-center justify-between">
        <h3 className="mb-3 text-gray-800">Layouts</h3>
        <button
          onClick={() => setFormCollapse(!formCollapse)}
          title="Toggle collapse"
          aria-label="Toggle collapse"
          className="w-6 h-6 flex items-center justify-center text-sky-600"
        >
          {formCollapse
            ? React.createElement(
                FaCaretUp as unknown as React.ComponentType<{ size?: number }>,
                { size: 20 }
              )
            : React.createElement(
                FaCaretDown as unknown as React.ComponentType<{
                  size?: number;
                }>,
                { size: 20 }
              )}
        </button>
      </div>
      {!formCollapse && (
        <div className="grid grid-cols-2 gap-2">
          {layoutTemplates.map((t) => (
            <LayoutButton key={t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LayoutManager;

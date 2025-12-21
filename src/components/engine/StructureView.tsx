import React, { useState, useMemo } from 'react';
import { usePortfolioStore } from '../../store/store';
import { uiMeta } from '../../store/uiMeta';

const StructureView: React.FC = () => {
  const { components, currentPageId, selectComponent, selectedComponent } = usePortfolioStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const pageComponents = useMemo(() => {
    if (!currentPageId) return [];
    return (components || []).filter((c: any) => c && c.pageId === currentPageId);
  }, [components, currentPageId]);

  const renderIcon = (comp: any) => uiMeta.renderIcon(comp);

  // Normalize several template key variants to friendly display names
  const layoutTemplateNames: Record<string, string> = {
    'verticle-column': 'Vertical Column',
    'verticle_column': 'Vertical Column',
    'vertical-column': 'Vertical Column',
    'vertical_column': 'Vertical Column',
    'horizontal_columns': 'Horizontal Columns',
    'horizontal_more': 'Horizontal Columns',
    'horizontal-columns': 'Horizontal Columns',
    'column-more': 'Horizontal Columns',
    'column_more': 'Horizontal Columns',
    'single_column': 'Single Column',
    'grid': 'Grid',
    'uneven-grid': 'Uneven Grid',
    'single-column': 'Single Column',
  };

  const renderNode = (comp: any, depth = 0) => {
    const children = pageComponents.filter((c: any) => c.parentId === comp.id);
    const isCollapsed = !!collapsed[comp.id];

    // derive a stable key for layout templates/icons: covers explicit `icon`, `template`, or type
    const iconKey = uiMeta.getIconKey(comp) || (comp?.template || comp?.icon || comp?.type);
    const label = comp?.type === 'layout'
      ? (layoutTemplateNames[iconKey as string] || uiMeta.getLabel(comp))
      : uiMeta.getLabel(comp);

    return (
      <div key={comp.id} className="mb-1">
        <div
          onClick={(e) => { e.stopPropagation(); selectComponent(comp.id); }}
          className={`flex items-center cursor-pointer p-0.5 rounded ${selectedComponent === comp.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          {children.length > 0 ? (
            <button
              onClick={(e) => { e.stopPropagation(); setCollapsed(prev => ({ ...prev, [comp.id]: !prev[comp.id] })); }}
              className="text-[10px] w-4 h-4 flex items-center justify-center mr-0.5"
              aria-label="toggle"
            >
              {isCollapsed ? '+' : '−'}
            </button>
          ) : (
            <span className="w-4 h-4 inline-block mr-0.5" />
          )}

          <span className="flex items-center gap-2">
            <span aria-hidden className="flex items-center relative w-5 h-5 text-[14px]" title={uiMeta.getIconKey(comp) || undefined}>
              {renderIcon(comp)}
              {comp?.type === 'layout' && comp?.template && (
                <span title={comp.template} className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-500 ring-1 ring-white" />
              )}
            </span>
            <span className="text-[10px] text-gray-800">{label}</span>
          </span>
        </div>

        {!isCollapsed && children.length > 0 && (
          <div className="ml-2 pl-2">
            {children.map((ch: any) => renderNode(ch, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const roots = pageComponents.filter((c: any) => !c.parentId);

  return (
    <div className="p-4 bg-white rounded-md shadow-sm mb-4">
      <h4 className="text-sm font-semibold mb-2">Structure</h4>
      {roots.length === 0 ? (
        <div className="text-xs text-gray-500">No components yet. Add a layout or component.</div>
      ) : (
        <div>{roots.map((r: any) => renderNode(r))}</div>
      )}
    </div>
  );
};

export default StructureView;

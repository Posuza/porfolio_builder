import React, { useMemo, useState } from "react";
import { usePortfolioStore } from "../../store/store";
import { uiMeta } from "../../store/uiMeta";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";

type StructureViewProps = {
  searchQuery?: string;
};

const StructureView: React.FC<StructureViewProps> = ({ searchQuery }) => {
  const { components, currentPageId, selectComponent, selectedComponent } =
    usePortfolioStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [internalQuery, setInternalQuery] = useState("");
  const query = (searchQuery ?? internalQuery).trim().toLowerCase();

  const pageComponents = useMemo(() => {
    if (!currentPageId) return [];
    return (components || []).filter(
      (c: any) => c && c.pageId === currentPageId,
    );
  }, [components, currentPageId]);

  const renderIcon = (comp: any) => uiMeta.renderIcon(comp);

  // Normalize several template key variants to friendly display names
  const layoutTemplateNames: Record<string, string> = {
    "verticle-column": "Vertical Column",
    verticle_column: "Vertical Column",
    "vertical-column": "Vertical Column",
    vertical_column: "Vertical Column",
    horizontal_columns: "Horizontal Columns",
    horizontal_more: "Horizontal Columns",
    "horizontal-columns": "Horizontal Columns",
    "column-more": "Horizontal Columns",
    column_more: "Horizontal Columns",
    single_column: "Single Column",
    grid: "Grid",
    "uneven-grid": "Uneven Grid",
    "single-column": "Single Column",
  };

  const byId = useMemo(() => {
    const map = new Map<string, any>();
    pageComponents.forEach((c: any) => {
      if (c?.id) map.set(c.id, c);
    });
    return map;
  }, [pageComponents]);

  const visibleIds = useMemo(() => {
    if (!query) return null;
    const matches = pageComponents.filter((c: any) => {
      const label = uiMeta.getLabel(c)?.toString().toLowerCase() || "";
      return label.includes(query) || c?.type?.toLowerCase?.().includes(query);
    });
    const ids = new Set<string>();
    for (const m of matches) {
      ids.add(m.id);
      let pid = m.parentId;
      while (pid) {
        ids.add(pid);
        pid = byId.get(pid)?.parentId;
      }
    }
    return ids;
  }, [pageComponents, byId, query]);

  const isVisible = (comp: any) => {
    if (!visibleIds) return true;
    return visibleIds.has(comp.id);
  };

  const renderNode = (comp: any, depth = 0) => {
    if (!isVisible(comp)) return null;
    const children = pageComponents.filter(
      (c: any) => c.parentId === comp.id && isVisible(c),
    );
    const isCollapsed = !!collapsed[comp.id];

    // derive a stable key for layout templates/icons: covers explicit `icon`, `template`, or type
    const iconKey =
      uiMeta.getIconKey(comp) || comp?.template || comp?.icon || comp?.type;
    const label =
      comp?.type === "layout"
        ? layoutTemplateNames[iconKey as string] || uiMeta.getLabel(comp)
        : uiMeta.getLabel(comp);

    return (
      <div key={comp.id} className="mb-1">
        <div
          onClick={(e) => {
            e.stopPropagation();
            selectComponent(comp.id);
          }}
          className={`flex items-center cursor-pointer p-0.5 rounded ${selectedComponent === comp.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}
          style={{ paddingLeft: 4 + depth * 8 }}
        >
          {children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed((prev) => ({
                  ...prev,
                  [comp.id]: !prev[comp.id],
                }));
              }}
              className="text-[10px] w-3 h-3 flex items-center justify-center "
              aria-label="toggle"
            >
              {isCollapsed ? "+" : "−"}
            </button>
          ) : (
            <span className="w-3 h-3 inline-block mr-0.5" />
          )}

          <span className="flex items-center">
            <span
              aria-hidden
              className="flex items-center relative w-5 h-5 text-[14px]"
              title={uiMeta.getIconKey(comp) || undefined}
            >
              {renderIcon(comp)}
              {comp?.type === "layout" && comp?.template && (
                <span
                  title={comp.template}
                  className="absolute top-1 -left-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-500 ring-1 ring-white"
                />
              )}
            </span>
            <span className="text-[8px] md:text-[10px] text-gray-800">{label}</span>
          </span>
        </div>

        {!isCollapsed && children.length > 0 && (
          <div>{children.map((ch: any) => renderNode(ch, depth + 1))}</div>
        )}
      </div>
    );
  };

  const roots = pageComponents.filter((c: any) => !c.parentId && isVisible(c));

  const allCollapsed =
    pageComponents.length > 0 &&
    pageComponents.every((c: any) => !!collapsed[c.id]);

  const setAllCollapsed = (value: boolean) => {
    const next: Record<string, boolean> = {};
    pageComponents.forEach((c: any) => {
      if (c?.id) next[c.id] = value;
    });
    setCollapsed(next);
  };

  return (
    <div className="p-1  md:p-1.5 lg:p-2 bg-gray-100 rounded-b-md ">
      {roots.length === 0 ? (
        <div className="text-[9px] md:text-xs text-gray-400">
          {pageComponents.length === 0
            ? "No components yet. Add a layout or component."
            : "No matches. Try a different search."}
        </div>
      ) : (
        <>
          <input
            value={searchQuery ?? internalQuery}
            onChange={(e) => setInternalQuery(e.target.value)}
            placeholder="Search structure..."
            className="w-full px-2 py-1 text-xs border rounded "
          />
          <div className="flex items-center justify-end my-1">
            <div className="flex items-center ">
              <button
                onClick={() => setAllCollapsed(false)}
                className={`p-1 rounded-l border ${
                  !allCollapsed
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white hover:bg-gray-50"
                }`}
                title="Expand all"
              >
                {React.createElement(BsArrowsExpand as any, {
                  className: "w-3 h-3 lg:w-4 lg:h-4",
                })}
              </button>
              <button
                onClick={() => setAllCollapsed(true)}
                className={`p-1 rounded-r border ${
                  allCollapsed
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white hover:bg-gray-50"
                }`}
                title="Collapse all"
              >
                {React.createElement(BsArrowsCollapse as any, {
                  className: "w-3 h-3 lg:w-4 lg:h-4",
                })}
              </button>
            </div>
          </div>
          <div className="max-h-[55vh] overflow-auto">
            <div className="min-w-max">{roots.map((r: any) => renderNode(r))}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default StructureView;

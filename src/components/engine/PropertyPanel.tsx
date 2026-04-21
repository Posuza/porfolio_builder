import React from "react";
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiChevronDown,
  FiChevronRight,
  FiItalic,
  FiUnderline,
} from "react-icons/fi";
import { usePortfolioStore } from "../../store/store";
import { pickSharedLayoutSettings } from "../../utils/layout";

type PropertyPanelProps = {
  selectedComponentId?: string | null;
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponentId,
}) => {
  const {
    selectedComponent,
    components,
    updateComponent,
    selectComponent,
    updateLayout,
    currentLayoutId,
    getCurrentLayout,
  } = usePortfolioStore();

  const activeId = selectedComponentId ?? selectedComponent;
  const component = components.find((c: any) => c.id === activeId);
  // compute ancestors in a stable hook so hooks order is preserved
  const ancestors = React.useMemo(() => {
    if (!activeId) return [];
    const arr: any[] = [];
    const start = components.find((c: any) => c.id === activeId);
    if (!start) return [];
    // build a quick lookup map to avoid declaring functions inside the loop
    const byId = new Map<string, any>();
    for (const c of components) {
      if (c && c.id) byId.set(c.id, c);
    }
    let pid = start.parentId;
    while (pid) {
      const p = byId.get(pid);
      if (!p) break;
      arr.unshift(p);
      pid = p.parentId;
    }
    return arr;
  }, [activeId, components]);

  const [openGroups, setOpenGroups] = React.useState({
    toolbar: true,
    content: true,
    typography: true,
    layout: true,
    spacing: true,
  });

  if (!component) {
    return (
      <div className="p-1 md:p-1.5 lg:p-2 bg-gray-100 rounded-b-md">
        <div className="text-sm md:text-base font-bold text-gray-600">
          Select a component to edit its properties.
        </div>
        <div className="mt-1 md:mt-2 text-[9px] md:text-[11px] text-gray-400">
          Select something in the canvas or Structure.
        </div>
      </div>
    );
  }

  const handleContentChange = (content: string) => {
    updateComponent(component.id, { content });
  };

  const applyStyleUpdates = (updates: Record<string, string>) => {
    // Read latest styles to avoid stale merges when several fields are updated quickly.
    const latest = components.find((c: any) => c.id === component.id);
    const baseStyles = (latest?.styles || component.styles || {}) as Record<
      string,
      string
    >;
    const nextStyles = { ...baseStyles, ...updates };
    updateComponent(component.id, {
      styles: nextStyles,
    });

    const isTopLevelLayout =
      component.type === "layout" &&
      (component.parentId === undefined || component.parentId === null);

    if (isTopLevelLayout && currentLayoutId) {
      const sharedUpdates = pickSharedLayoutSettings(updates);
      if (Object.keys(sharedUpdates).length > 0) {
        const currentLayout = getCurrentLayout();
        updateLayout(currentLayoutId, {
          settings: {
            ...currentLayout?.settings,
            ...sharedUpdates,
          },
        });
      }
    }
  };

  const handleStyleChange = (property: string, value: string) => {
    applyStyleUpdates({ [property]: value });
  };

  // helpers for numeric px inputs for padding/margin
  const getPxValue = (key: string) => {
    const styles = component.styles as Record<string, any> | undefined;
    const v = styles?.[key];
    if (v === undefined || v === null || v === "") return "";
    if (typeof v === "number") return String(v);
    if (typeof v === "string" && v.endsWith("px")) return v.replace("px", "");
    return v;
  };

  const handlePxChange = (key: string, raw: string) => {
    const n = raw === "" ? "" : `${raw}px`;
    handleStyleChange(key, n);
  };

  const handleAllPaddingChange = (raw: string) => {
    const n = raw === "" ? "" : `${raw}px`;
    // Update all related keys in one patch so no field gets overwritten.
    applyStyleUpdates({
      padding: n,
      paddingTop: n,
      paddingRight: n,
      paddingBottom: n,
      paddingLeft: n,
    });
  };

  const handleAllMarginChange = (raw: string) => {
    const n = raw === "" ? "" : `${raw}px`;
    // Update all related keys in one patch so no field gets overwritten.
    applyStyleUpdates({
      margin: n,
      marginTop: n,
      marginRight: n,
      marginBottom: n,
      marginLeft: n,
    });
  };

  // If shorthand `padding` or `margin` is not set, but individual sides
  // exist and are equal, allow getPxValue('padding'|'margin') to derive
  // a sensible value so the All inputs show the current effective size.
  const deriveShorthand = (key: "padding" | "margin") => {
    const styles = component.styles as Record<string, any> | undefined;
    if (!styles) return "";
    if (styles[key] !== undefined && styles[key] !== null && styles[key] !== "") {
      return getPxValue(key);
    }
    const top = styles[`${key}Top`];
    const right = styles[`${key}Right`];
    const bottom = styles[`${key}Bottom`];
    const left = styles[`${key}Left`];
    const isUnset = (v: any) => v === undefined || v === null || v === "";
    if (isUnset(top) && isUnset(right) && isUnset(bottom) && isUnset(left)) {
      return "";
    }
    // normalize to px strings
    const toVal = (v: any) => {
      if (isUnset(v)) return null;
      if (typeof v === "string" && v.endsWith("px")) return v.replace("px", "");
      if (typeof v === "number") return String(v);
      return null;
    };
    const t = toVal(top);
    const r = toVal(right);
    const b = toVal(bottom);
    const l = toVal(left);
    if (t && r && b && l && t === r && r === b && b === l) return t;
    return "";
  };

  const isSection = component.type === "section";
  const isLayout = component.type === "layout";

  const toggleGroup = (key: keyof typeof openGroups) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const getNodeLabel = (node: any) =>
    node.type === "layout"
      ? "Layout"
      : node.type === "section"
        ? "Section"
        : (node.content || node.type).toString().slice(0, 20);

  const immediateParent = ancestors[ancestors.length - 1];
  const hiddenAncestorCount = Math.max(ancestors.length - 1, 0);
  const textAlignIcons = {
    left: FiAlignLeft,
    center: FiAlignCenter,
    right: FiAlignRight,
    justify: FiAlignJustify,
  } as const;
  const borderStyleOptions = [
    { value: "none", label: "None" },
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
    { value: "double", label: "Double" },
  ] as const;

  const handleNumericStyleChange = (key: string, raw: string) => {
    handleStyleChange(key, raw ? `${raw}px` : "");
  };

  const isBold = (() => {
    const w = (component.styles as any)?.fontWeight;
    if (!w) return false;
    if (w === "bold") return true;
    const n = parseInt(String(w), 10);
    return Number.isFinite(n) && n >= 600;
  })();
  const isItalic = (component.styles as any)?.fontStyle === "italic";
  const isUnderline = ((component.styles as any)?.textDecoration || "")
    .toString()
    .includes("underline");

  return (
    <div className="p-0.5 md:p-1 lg:p-1.5 bg-gray-100 rounded-b-md">
      {/* Breadcrumb showing ancestry of selected node */}
      <div className="mb-2 text-xs md:text-sm text-gray-600">
        {ancestors.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {hiddenAncestorCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">
                +{hiddenAncestorCount}
              </span>
            )}
            {immediateParent && (
              <button
                key={immediateParent.id}
                onClick={() => selectComponent(immediateParent.id)}
                className="text-xs px-2 py-1 bg-white border rounded text-gray-700 hover:bg-gray-50"
              >
                {getNodeLabel(immediateParent)}
              </button>
            )}
            <span className="text-xs text-gray-400">›</span>
            <span className="text-xs font-semibold text-gray-800 px-2 py-1 rounded border border-dotted border-sky-400 bg-sky-50">
              {getNodeLabel(component)}
            </span>
          </div>
        )}
      </div>

      <div className="max-h-[75vh] overflow-y-auto">
        <div className="mb-2">
          <button
            onClick={() => toggleGroup("toolbar")}
            className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 bg-gray-300 py-1.5 md:py-2"
          >
            <span className="pl-1">Toolbar</span>
            {React.createElement(
              openGroups.toolbar
                ? (FiChevronDown as any)
                : (FiChevronRight as any),
              { className: "w-4 h-4 text-gray-500" },
            )}
          </button>
          {openGroups.toolbar && (
            <div className="pl-1.5 p-1 bg-gray-200 border-b border-gray-300">
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() =>
                    handleStyleChange("fontWeight", isBold ? "400" : "700")
                  }
                  title="Bold"
                  aria-label="Bold"
                  className={`w-8 h-8 rounded border flex items-center justify-center ${
                    isBold
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {React.createElement(FiBold as any, {
                    className: "w-4 h-4",
                  })}
                </button>
                <button
                  onClick={() =>
                    handleStyleChange("fontStyle", isItalic ? "normal" : "italic")
                  }
                  title="Italic"
                  aria-label="Italic"
                  className={`w-8 h-8 rounded border flex items-center justify-center ${
                    isItalic
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {React.createElement(FiItalic as any, {
                    className: "w-4 h-4",
                  })}
                </button>
                <button
                  onClick={() =>
                    handleStyleChange(
                      "textDecoration",
                      isUnderline ? "none" : "underline",
                    )
                  }
                  title="Underline"
                  aria-label="Underline"
                  className={`w-8 h-8 rounded border flex items-center justify-center ${
                    isUnderline
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {React.createElement(FiUnderline as any, {
                    className: "w-4 h-4",
                  })}
                </button>
              </div>
            </div>
          )}
        </div>

        {!isSection && !isLayout && (
          <div className="mb-10">
            <div className="">
              <button
                onClick={() => toggleGroup("content")}
                className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 bg-gray-300 py-1.5 md:py-2"
              >
                <span className="pl-1">Content</span>
                {React.createElement(
                  openGroups.content
                    ? (FiChevronDown as any)
                    : (FiChevronRight as any),
                  { className: "w-4 h-4 text-gray-500" },
                )}
              </button>
              {openGroups.content && (
                <div className="pl-1.5 p-1 bg-gray-200 border-b border-gray-300 gap-1 md:gap-2">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    Content
                  </label>
                  <textarea
                    value={component.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full min-h-[64px] p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                  />
                </div>
              )}
            </div>

            <div className="">
              <button
                onClick={() => toggleGroup("typography")}
                className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 bg-gray-300 py-1.5 md:py-2"
              >
                <span className="pl-1">Typography</span>
                {React.createElement(
                  openGroups.typography
                    ? (FiChevronDown as any)
                    : (FiChevronRight as any),
                  { className: "w-4 h-4 text-gray-500" },
                )}
              </button>
              {openGroups.typography && (
                <div className="pl-1.5 p-1 bg-gray-200 border-b border-gray-300 gap-1 md:gap-2">
                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={component.styles?.color || "#333333"}
                      onChange={(e) =>
                        handleStyleChange("color", e.target.value)
                      }
                      className="w-full h-8 md:h-10 border rounded"
                    />
                  </div>

                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      Font Size:{" "}
                      {parseInt(
                        component.styles?.fontSize?.toString?.() || "0",
                      )}
                      px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="72"
                      value={parseInt(
                        component.styles?.fontSize?.toString?.() || "0",
                      )}
                      onChange={(e) =>
                        handleStyleChange("fontSize", `${e.target.value}px`)
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      Font Family
                    </label>
                    <select
                      value={(component.styles as any)?.fontFamily || ""}
                      onChange={(e) =>
                        handleStyleChange("fontFamily", e.target.value)
                      }
                      className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                    >
                      <option value="">Default</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="'Helvetica Neue', Helvetica, sans-serif">
                        Helvetica
                      </option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="'Times New Roman', Times, serif">
                        Times New Roman
                      </option>
                      <option value="'Courier New', Courier, monospace">
                        Courier New
                      </option>
                      <option value="Verdana, sans-serif">Verdana</option>
                      <option value="Trebuchet MS, sans-serif">
                        Trebuchet MS
                      </option>
                      <option value="Impact, Charcoal, sans-serif">
                        Impact
                      </option>
                    </select>
                  </div>

                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      Font Weight
                    </label>
                    <select
                      value={(component.styles as any)?.fontWeight || ""}
                      onChange={(e) =>
                        handleStyleChange("fontWeight", e.target.value)
                      }
                      className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                    >
                      <option value="">Default</option>
                      <option value="300">Light (300)</option>
                      <option value="400">Normal (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semi-Bold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extra Bold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>

                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      Text Alignment
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {(["left", "center", "right", "justify"] as const).map(
                        (align) => {
                          const AlignIcon = textAlignIcons[align];
                          return (
                            <button
                              key={align}
                              onClick={() =>
                                handleStyleChange("textAlign", align)
                              }
                              title={`Align ${align}`}
                              aria-label={`Align ${align}`}
                              className={`w-10 h-9 rounded border flex items-center justify-center ${
                                component.styles?.textAlign === align
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {React.createElement(AlignIcon as any, {
                                className: "w-4 h-4",
                              })}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="">
              <button
                onClick={() => toggleGroup("layout")}
                className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 bg-gray-300 py-1.5 md:py-2"
              >
                <span className="pl-1">Layout</span>
                {React.createElement(
                  openGroups.layout
                    ? (FiChevronDown as any)
                    : (FiChevronRight as any),
                  { className: "w-4 h-4 text-gray-500" },
                )}
              </button>
              {openGroups.layout && (
                <div className="pl-1.5 p-1 bg-gray-200 border-b border-gray-300 gap-1 md:gap-2">
                  <div className="mb-2 md:mb-3 gap-1 md:gap-2">
                    <label className="block text-[9px] md:text-[10px] text-gray-600">
                      Background
                    </label>
                    <input
                      type="color"
                      value={component.styles?.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        handleStyleChange("backgroundColor", e.target.value)
                      }
                      className="w-full h-8 md:h-10 border rounded"
                    />
                  </div>

                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      Border Type
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {borderStyleOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleStyleChange("borderStyle", option.value)
                          }
                          title={option.label}
                          aria-label={option.label}
                          className={`w-7 sm:w-9 h-7 sm:h-8 shrink-0 rounded border flex items-center justify-center ${
                            (component.styles?.borderStyle || "none") ===
                            option.value
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {option.value === "none" ? (
                            <span className="text-[9px] font-semibold leading-none">
                              None
                            </span>
                          ) : (
                            <span
                              className="w-4 border-t-2 border-current"
                              style={{ borderTopStyle: option.value }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2 md:mb-3 gap-1 md:gap-2">
                    <label className="block text-[9px] md:text-[10px] text-gray-600">
                      Border Width (px)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={getPxValue("borderWidth")}
                      onChange={(e) =>
                        handleNumericStyleChange("borderWidth", e.target.value)
                      }
                      className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      placeholder="0"
                    />
                  </div>

                  <div className="mb-2 md:mb-3 gap-1 md:gap-2">
                    <label className="block text-[9px] md:text-[10px] text-gray-600">
                      Border Color
                    </label>
                    <input
                      type="color"
                      value={component.styles?.borderColor || "#000000"}
                      onChange={(e) =>
                        handleStyleChange("borderColor", e.target.value)
                      }
                      className="w-full h-8 md:h-10 border rounded"
                    />
                  </div>

                  <div className="gap-1 md:gap-2">
                    <label className="block text-[9px] md:text-[10px] text-gray-600">
                      Border Radius (px)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={getPxValue("borderRadius")}
                      onChange={(e) =>
                        handleNumericStyleChange(
                          "borderRadius",
                          e.target.value,
                        )
                      }
                      className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="">
              <button
                onClick={() => toggleGroup("spacing")}
                className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 bg-gray-300 py-1.5 md:py-2"
              >
                <span className="pl-1">Spacing</span>
                {React.createElement(
                  openGroups.spacing
                    ? (FiChevronDown as any)
                    : (FiChevronRight as any),
                  { className: "w-4 h-4 text-gray-500" },
                )}
              </button>
              {openGroups.spacing && (
                <div className="pl-1.5 p-1 bg-gray-200 border-b border-gray-300 gap-1 md:gap-2">
                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      All Padding (px)
                    </label>
                    <input
                      type="number"
                      value={
                        getPxValue("padding") || deriveShorthand("padding") || "0"
                      }
                      onChange={(e) => handleAllPaddingChange(e.target.value)}
                      className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px] mb-2"
                    />
                  </div>

                  <div className="mb-2 md:mb-3">
                    <h4 className="text-xs md:text-sm text-gray-700 mb-2">
                      Padding (px)
                    </h4>
                    <div className="grid grid-cols-2 gap-1 md:gap-2">
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">Top</label>
                        <input
                          type="number"
                          value={getPxValue("paddingTop") || "0"}
                          onChange={(e) =>
                            handlePxChange("paddingTop", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">
                          Right
                        </label>
                        <input
                          type="number"
                          value={getPxValue("paddingRight") || "0"}
                          onChange={(e) =>
                            handlePxChange("paddingRight", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">
                          Bottom
                        </label>
                        <input
                          type="number"
                          value={getPxValue("paddingBottom") || "0"}
                          onChange={(e) =>
                            handlePxChange("paddingBottom", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">
                          Left
                        </label>
                        <input
                          type="number"
                          value={getPxValue("paddingLeft") || "0"}
                          onChange={(e) =>
                            handlePxChange("paddingLeft", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      All Margin (px)
                    </label>
                    <input
                      type="number"
                      value={
                        getPxValue("margin") || deriveShorthand("margin") || "0"
                      }
                      onChange={(e) => handleAllMarginChange(e.target.value)}
                      className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                    />
                  </div>

                  <div className="mb-2 md:mb-3">
                    <h4 className="text-xs md:text-sm text-gray-700 mb-2">
                      Margin (px)
                    </h4>
                    <div className="grid grid-cols-2 gap-1 md:gap-2">
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">Top</label>
                        <input
                          type="number"
                          value={getPxValue("marginTop") || "0"}
                          onChange={(e) =>
                            handlePxChange("marginTop", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">
                          Right
                        </label>
                        <input
                          type="number"
                          value={getPxValue("marginRight") || "0"}
                          onChange={(e) =>
                            handlePxChange("marginRight", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">
                          Bottom
                        </label>
                        <input
                          type="number"
                          value={getPxValue("marginBottom") || "0"}
                          onChange={(e) =>
                            handlePxChange("marginBottom", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] text-gray-600">
                          Left
                        </label>
                        <input
                          type="number"
                          value={getPxValue("marginLeft") || "0"}
                          onChange={(e) =>
                            handlePxChange("marginLeft", e.target.value)
                          }
                          className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 md:mb-3">
                    <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                      Gap (px)
                    </label>
                    <input
                      type="number"
                      value={getPxValue("gap") || "0"}
                      onChange={(e) => handlePxChange("gap", e.target.value)}
                      className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(isSection || isLayout) && (
          <div className="mb-6">
            <button
              onClick={() => toggleGroup("spacing")}
              className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 bg-gray-300 py-1.5 md:py-2"
            >
              <span className="pl-1">Spacing</span>
              {React.createElement(
                openGroups.spacing
                  ? (FiChevronDown as any)
                  : (FiChevronRight as any),
                { className: "w-4 h-4 text-gray-500" },
              )}
            </button>
            {openGroups.spacing && (
              <div className="pl-1.5 p-1 bg-gray-200 border-b border-gray-300 gap-1 md:gap-2">
                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    All Padding (px)
                  </label>
                  <input
                    type="number"
                    value={
                      getPxValue("padding") || deriveShorthand("padding") || "0"
                    }
                    onChange={(e) => handleAllPaddingChange(e.target.value)}
                    className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px] mb-2"
                  />
                </div>
                <div className="mb-2 md:mb-3">
                  <h4 className="text-xs md:text-sm text-gray-700 mb-2">
                    Padding (px)
                  </h4>
                  <div className="grid grid-cols-2 gap-1 md:gap-2">
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">Top</label>
                      <input
                        type="number"
                        value={getPxValue("paddingTop") || "0"}
                        onChange={(e) =>
                          handlePxChange("paddingTop", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">
                        Right
                      </label>
                      <input
                        type="number"
                        value={getPxValue("paddingRight") || "0"}
                        onChange={(e) =>
                          handlePxChange("paddingRight", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">
                        Bottom
                      </label>
                      <input
                        type="number"
                        value={getPxValue("paddingBottom") || "0"}
                        onChange={(e) =>
                          handlePxChange("paddingBottom", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">
                        Left
                      </label>
                      <input
                        type="number"
                        value={getPxValue("paddingLeft") || "0"}
                        onChange={(e) =>
                          handlePxChange("paddingLeft", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    All Margin (px)
                  </label>
                  <input
                    type="number"
                    value={
                      getPxValue("margin") || deriveShorthand("margin") || "0"
                    }
                    onChange={(e) => handleAllMarginChange(e.target.value)}
                    className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                  />
                </div>

                <div className="mb-2 md:mb-3">
                  <h4 className="text-xs md:text-sm text-gray-700 mb-2">
                    Margin (px)
                  </h4>
                  <div className="grid grid-cols-2 gap-1 md:gap-2">
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">Top</label>
                      <input
                        type="number"
                        value={getPxValue("marginTop") || "0"}
                        onChange={(e) =>
                          handlePxChange("marginTop", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">
                        Right
                      </label>
                      <input
                        type="number"
                        value={getPxValue("marginRight") || "0"}
                        onChange={(e) =>
                          handlePxChange("marginRight", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">
                        Bottom
                      </label>
                      <input
                        type="number"
                        value={getPxValue("marginBottom") || "0"}
                        onChange={(e) =>
                          handlePxChange("marginBottom", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] md:text-[10px] text-gray-600">
                        Left
                      </label>
                      <input
                        type="number"
                        value={getPxValue("marginLeft") || "0"}
                        onChange={(e) =>
                          handlePxChange("marginLeft", e.target.value)
                        }
                        className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    Gap (px)
                  </label>
                  <input
                    type="number"
                    value={getPxValue("gap") || "0"}
                    onChange={(e) => handlePxChange("gap", e.target.value)}
                    className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => toggleGroup("layout")}
              className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 bg-gray-300 py-1.5 md:py-2"
            >
              <span className="pl-1">Layout</span>
              {React.createElement(
                openGroups.layout
                  ? (FiChevronDown as any)
                  : (FiChevronRight as any),
                { className: "w-4 h-4 text-gray-500" },
              )}
            </button>
            {openGroups.layout && (
              <div className="pl-1.5 p-1 bg-gray-200 border-b border-gray-300 gap-1 md:gap-2">
                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    Background
                  </label>
                  <input
                    type="color"
                    value={component.styles?.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    className="w-full h-8 md:h-10 border rounded"
                  />
                </div>

                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    Border Type
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {borderStyleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleStyleChange("borderStyle", option.value)
                        }
                        title={option.label}
                        aria-label={option.label}
                        className={`w-7 sm:w-9 h-7 sm:h-8 shrink-0 rounded border flex items-center justify-center ${
                          (component.styles?.borderStyle || "none") ===
                          option.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option.value === "none" ? (
                          <span className="text-[9px] font-semibold leading-none">
                            None
                          </span>
                        ) : (
                          <span
                            className="w-4 border-t-2 border-current"
                            style={{ borderTopStyle: option.value }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    Border Width (px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={getPxValue("borderWidth")}
                    onChange={(e) =>
                      handleNumericStyleChange("borderWidth", e.target.value)
                    }
                    className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                    placeholder="0"
                  />
                </div>

                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    Border Color
                  </label>
                  <input
                    type="color"
                    value={component.styles?.borderColor || "#000000"}
                    onChange={(e) =>
                      handleStyleChange("borderColor", e.target.value)
                    }
                    className="w-full h-8 md:h-10 border rounded"
                  />
                </div>

                <div className="mb-2 md:mb-3">
                  <label className="block mb-1 md:mb-1.5 text-[9px] md:text-[10px] text-gray-600">
                    Border Radius (px)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={getPxValue("borderRadius")}
                    onChange={(e) =>
                      handleNumericStyleChange("borderRadius", e.target.value)
                    }
                    className="w-full p-1.5 md:p-2 border rounded text-[10px] md:text-xs placeholder:text-[9px] md:placeholder:text-[10px]"
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;

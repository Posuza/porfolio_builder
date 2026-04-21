import type { CSSProperties } from "react";
import type { Component } from "../store/slices/componentSlice";
import type { Layout } from "../store/slices/layoutSlice";

type ComponentStyleMap = Component["styles"];

export const SHARED_LAYOUT_FIELDS = [
  "maxWidth",
  "padding",
  "backgroundColor",
  "gap",
  "surfaceColor",
  "textColor",
  "accentColor",
] as const;

type SharedLayoutField = (typeof SHARED_LAYOUT_FIELDS)[number];

export type ResolvedLayoutSettings = {
  maxWidth: string;
  padding: string;
  backgroundColor: string;
  gap: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
};

export const normalizeLayoutTemplate = (template?: string) => {
  const raw = (template || "").toLowerCase();

  if (
    raw === "verticle-column" ||
    raw === "verticle_column" ||
    raw === "vertical-column" ||
    raw === "vertical_column" ||
    raw === "single_column"
  ) {
    return "single-column";
  }

  if (
    raw === "horizontal_columns" ||
    raw === "horizontal-columns" ||
    raw === "horizontal_more" ||
    raw === "column_more" ||
    raw === "column-more" ||
    raw === "two-column" ||
    raw === "two_columns"
  ) {
    return "column-more";
  }

  return raw;
};

export const getResolvedLayoutSettings = (
  settings?: Layout["settings"],
): ResolvedLayoutSettings => ({
  maxWidth: settings?.maxWidth || "1200px",
  padding: settings?.padding || "20px",
  backgroundColor: settings?.backgroundColor || "#ffffff",
  gap: settings?.gap || "16px",
  surfaceColor: settings?.surfaceColor || settings?.backgroundColor || "#f8fafc",
  textColor: settings?.textColor || "#111827",
  accentColor: settings?.accentColor || "#3b82f6",
});

export const getPageShellStyle = (
  settings?: Layout["settings"],
): CSSProperties => {
  const resolved = getResolvedLayoutSettings(settings);

  return {
    width: "100%",
    maxWidth: resolved.maxWidth,
    padding: resolved.padding,
    backgroundColor: resolved.backgroundColor,
    margin: "0 auto",
  };
};

export const getLayoutTemplateDefaults = (
  template?: string,
  gap = "16px",
): ComponentStyleMap => {
  const normalized = normalizeLayoutTemplate(template);

  switch (normalized) {
    case "column-more":
      return {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap,
      };
    case "grid":
      return {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap,
      };
    case "uneven-grid":
      return {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap,
      };
    default:
      return {
        display: "block",
        gap,
      };
  }
};

export const resolveLayoutComponentStyles = (
  component: Pick<Component, "template" | "icon" | "styles">,
  layoutSettings?: Layout["settings"],
): ComponentStyleMap => {
  const resolved = getResolvedLayoutSettings(layoutSettings);
  const template = normalizeLayoutTemplate(component.template || component.icon);
  const templateDefaults = getLayoutTemplateDefaults(template, resolved.gap);
  const styles = (component.styles || {}) as ComponentStyleMap;
  const display = styles.display || templateDefaults.display || "block";
  const shouldUseGridTemplate = display === "grid";

  return {
    ...templateDefaults,
    ...styles,
    display,
    gap: styles.gap || templateDefaults.gap || resolved.gap,
    gridTemplateColumns: shouldUseGridTemplate
      ? styles.gridTemplateColumns || templateDefaults.gridTemplateColumns
      : styles.gridTemplateColumns,
  };
};

export const pickSharedLayoutSettings = (
  styles: Record<string, string>,
): Partial<Layout["settings"]> => {
  const shared: Partial<Layout["settings"]> = {};

  SHARED_LAYOUT_FIELDS.forEach((field) => {
    const value = styles[field as SharedLayoutField];
    if (value !== undefined) {
      shared[field] = value;
    }
  });

  return shared;
};

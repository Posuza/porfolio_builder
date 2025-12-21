import React, { useState } from "react";
import { usePortfolioStore } from "../../store/store";
import { FaPlus, FaCheck, FaRedo } from "react-icons/fa";
import { FaCaretUp,FaCaretDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export const ThemeManager: React.FC = () => {
  const { getCurrentLayout, updateLayout, currentLayoutId } =
    usePortfolioStore();
  const currentLayout = getCurrentLayout();
  const [customOpen, setCustomOpen] = useState(false);
  const [formCollapse, setFormCollapse] = useState(false);

  const initialThemes = [
    {
      name: "Light",
      colors: {
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#111827",
        accent: "#0ea5ff",
      },
    },
    {
      name: "Dark",
      colors: {
        background: "#0b1220",
        surface: "#0f172a",
        text: "#e6eef8",
        accent: "#00d4aa",
      },
    },
    {
      name: "Blue",
      colors: {
        background: "#f0f8ff",
        surface: "#e6f0ff",
        text: "#0f172a",
        accent: "#3b82f6",
      },
    },
    {
      name: "Green",
      colors: {
        background: "#f0fdf4",
        surface: "#dcfce7",
        text: "#064e3b",
        accent: "#22c55e",
      },
    },
    {
      name: "Purple",
      colors: {
        background: "#faf5ff",
        surface: "#f5f3ff",
        text: "#3b0764",
        accent: "#a855f7",
      },
    },
  ];

  const [themes, setThemes] = useState(initialThemes);

  const applyTheme = (theme: any) => {
    if (!currentLayoutId) return;

    updateLayout(currentLayoutId, {
      settings: {
        ...currentLayout?.settings,
        backgroundColor: theme.colors.background,
        surfaceColor: theme.colors.surface,
        textColor: theme.colors.text,
        accentColor: theme.colors.accent,
      },
    });
  };

  // Helpers to compute a visible border for swatches
  const hexToRgb = (hex: string) => {
    if (!hex) return null;
    const cleaned = hex.replace("#", "");
    const full =
      cleaned.length === 3
        ? cleaned
            .split("")
            .map((c) => c + c)
            .join("")
        : cleaned;
    if (full.length !== 6) return null;
    const r = parseInt(full.substring(0, 2), 16);
    const g = parseInt(full.substring(2, 4), 16);
    const b = parseInt(full.substring(4, 6), 16);
    return { r, g, b };
  };

  const luminance = (rgb: { r: number; g: number; b: number }) => {
    const srgb = [rgb.r, rgb.g, rgb.b]
      .map((v) => v / 255)
      .map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };

  const borderFor = (swatch: string, bg: string, accent: string) => {
    const s = hexToRgb(swatch);
    const b = hexToRgb(bg);
    if (!s || !b) return accent || "rgba(0,0,0,0.12)";
    const ls = luminance(s);
    const lb = luminance(b);
    const delta = Math.abs(ls - lb);
    // If swatch is very similar to button background, use accent to outline it; otherwise use a subtle neutral border
    if (delta < 0.18) return accent || "rgba(0,0,0,0.12)";
    return "rgba(0,0,0,0.12)";
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md mb-4">
      <div className="flex felx-row justify-between">
        <div className="flex felx-row">
          <h3 className="mb-2 text-gray-800">Themes</h3>
          <button
            onClick={() => setThemes(initialThemes)}
            title="Reset themes"
            aria-label="Reset themes to defaults"
            className="w-6 h-6 flex items-center justify-center borde text-sky-600 rounded"
          >
            {React.createElement(
              FaRedo as unknown as React.ComponentType<{ size?: number }>,
              { size: 14 }
            )}
          </button>
        </div>
        <button
          onClick={() => setFormCollapse(!formCollapse)}
          title="Toggle collapse"
          aria-label="Toggle collapse"
          className="w-6 h-6 flex items-center justify-center text-sky-600"
        >
          {formCollapse ? (
            React.createElement(
              FaCaretUp as unknown as React.ComponentType<{ size?: number }>,
              { size: 20 }
            )
          ) : (
            React.createElement(
              FaCaretDown as unknown as React.ComponentType<{ size?: number }>,
              { size: 20 }
            )
          )}
        </button>
      </div>

      {!formCollapse && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
          <div className=" relative bg-gray-200" key={theme.name}>
            <button
              onClick={() => {
                // allow deleting any theme (built-ins included)
                setThemes((prev) => prev.filter((t) => t.name !== theme.name));
              }}
              aria-label={`Delete theme ${theme.name}`}
              title={`Delete ${theme.name}`}
              className="absolute right-0.5 top-0.5 p-[1px] rounded hover:bg-gray-400 bg-gray-300"
              style={{ lineHeight: 0 }}
            >
              {React.createElement(
                RxCross2 as unknown as React.ComponentType<{
                  size?: number;
                  className?: string;
                }>,
                { size: 12 }
              )}
            </button>
            <button
              onClick={() => applyTheme(theme)}
              className="p-2 w-full border rounded text-sm flex items-center justify-center min-h-[40px] flex flex-col"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              }}
            >
              <span className="ml-2">{theme.name}</span>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: theme.colors.background,
                    borderRadius: 3,
                    border: `1px solid ${borderFor(
                      theme.colors.background,
                      theme.colors.background,
                      theme.colors.accent
                    )}`,
                  }}
                />
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: theme.colors.surface,
                    borderRadius: 3,
                    border: `1px solid ${borderFor(
                      theme.colors.surface,
                      theme.colors.background,
                      theme.colors.accent
                    )}`,
                  }}
                />
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: theme.colors.text,
                    borderRadius: 3,
                    border: `1px solid ${borderFor(
                      theme.colors.text,
                      theme.colors.background,
                      theme.colors.accent
                    )}`,
                  }}
                />
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: theme.colors.accent,
                    borderRadius: 3,
                    border: `1px solid ${borderFor(
                      theme.colors.accent,
                      theme.colors.background,
                      theme.colors.accent
                    )}`,
                  }}
                />
              </div>
            </button>
          </div>
            ))}

            {!customOpen && (
              <button
                onClick={() => setCustomOpen(true)}
                title="Custom colors"
                className="col-span-2 flex flex-col w-full py-2 items-center justify-center border rounded text-sm cursor-pointer"
              >
                {React.createElement(
                  FaPlus as unknown as React.ComponentType<{
                    size?: number;
                    className?: string;
                  }>,
                  { size: 16 }
                )}
                <div className="text-sm text-gray-600">Custom colors</div>
              </button>
            )}
          </div>

          {/* Custom color form (controlled by outer + button) */}
          <div className="mt-3">
            <CustomColorForm
              currentLayout={currentLayout}
              open={customOpen}
              setOpen={setCustomOpen}
              existingNames={themes.map((t) => t.name)}
              onSaveTheme={(themeEntry: any) =>
                setThemes((prev) => [...prev, themeEntry])
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

const CustomColorForm: React.FC<{
  currentLayout: any;
  open?: boolean;
  setOpen?: (v: boolean) => void;
  existingNames?: string[];
  onSaveTheme?: (themeEntry: { name: string; colors: any }) => void;
}> = ({
  currentLayout,
  open: openProp,
  setOpen: setOpenProp,
  existingNames = [],
  onSaveTheme,
}) => {
  const [openLocal, setOpenLocal] = useState(false);
  const open = typeof openProp === "boolean" ? openProp : openLocal;
  // don't unify prop setter and local setter into one variable (their signatures differ)
  const [colors, setColors] = useState({
    background: currentLayout?.settings?.backgroundColor || "#ffffff",
    surface: currentLayout?.settings?.surfaceColor || "#f8fafc",
    text: currentLayout?.settings?.textColor || "#111827",
    accent: currentLayout?.settings?.accentColor || "#3b82f6",
  });

  const [name, setName] = useState("");

  const nameTrim = name.trim();
  const nameExists =
    nameTrim.length > 0 &&
    existingNames.some((n) => n.toLowerCase() === nameTrim.toLowerCase());

  React.useEffect(() => {
    setColors({
      background: currentLayout?.settings?.backgroundColor || "#ffffff",
      surface: currentLayout?.settings?.surfaceColor || "#f8fafc",
      text: currentLayout?.settings?.textColor || "#111827",
      accent: currentLayout?.settings?.accentColor || "#3b82f6",
    });
  }, [currentLayout]);

  const apply = () => {
    // Guard against duplicate names
    if (nameExists) return;

    const themeEntry = {
      name: nameTrim || `Custom ${Date.now()}`,
      colors: { ...colors },
    };
    if (onSaveTheme) onSaveTheme(themeEntry);
    if (setOpenProp) setOpenProp(false);
    else setOpenLocal(false);
  };

  return (
    <div>
      {open && (
        <div className="mt-2 p-3 bg-white border  rounded-md shadow-sm relative">
          <button
            onClick={() => {
              if (setOpenProp) setOpenProp(false);
              else setOpenLocal(false);
            }}
            aria-label="Close custom colors"
            className="absolute right-1 top-1 p-0.5 rounded hover:bg-gray-300 bg-gray-200"
            style={{ lineHeight: 0 }}
          >
            {React.createElement(
              RxCross2 as unknown as React.ComponentType<{
                size?: number;
                className?: string;
              }>,
              { size: 16 }
            )}
          </button>
          <div className="mb-2 text-sm font-medium">Custom colors</div>

          <div className="flex flex-col">
            <div className="md:col-span-1">
              <div
                className="p-3 rounded-lg border"
                style={{ background: colors.surface }}
              >
                <h4 style={{ color: colors.text, margin: 0 }}>
                  Preview Heading
                </h4>
                <p
                  style={{
                    color: colors.text,
                    marginTop: 8,
                    marginBottom: 12,
                    fontSize: 13,
                  }}
                >
                  Sample paragraph text to preview how text looks on the
                  selected surface color.
                </p>
                <button
                  style={{
                    background: colors.accent,
                    color: "#fff",
                    padding: "1px 4px",
                    borderRadius: 5,
                    border: "none",
                    fontSize: "15px",
                  }}
                >
                  Primary
                </button>
              </div>
              <div className="my-3 text-[11px] text-gray-500">
                Preview updates live as you pick colors.
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="text-sm block mb-1">Theme name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My custom theme"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
                {nameExists && (
                  <div className="text-xs text-red-600 mt-1">
                    A theme named "{nameTrim}" already exists.
                  </div>
                )}
              </div>
              {[
                { key: "background", label: "Background" },
                { key: "surface", label: "Surface" },
                { key: "text", label: "Text" },
                { key: "accent", label: "Accent" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: (colors as any)[key],
                      border: "1px solid rgba(0,0,0,0.12)",
                    }}
                  />
                  <label className="flex items-center gap-2 grow">
                    <span className="text-sm w-24">{label}</span>
                    <input
                      type="color"
                      value={(colors as any)[key]}
                      onChange={(e) =>
                        setColors({ ...colors, [key]: e.target.value })
                      }
                      className="h-6 w-12 border rounded"
                    />
                  </label>
                </div>
              ))}

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() =>
                    setColors({
                      background: "#ffffff",
                      surface: "#f8fafc",
                      text: "#111827",
                      accent: "#3b82f6",
                    })
                  }
                  title="Reset"
                  aria-label="Reset"
                  className="w-8 h-8 flex items-center justify-center border rounded"
                >
                  {React.createElement(
                    FaRedo as unknown as React.ComponentType<{ size?: number }>,
                    { size: 14 }
                  )}
                </button>
                <button
                  onClick={apply}
                  title="Apply"
                  aria-label="Apply"
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded"
                >
                  {React.createElement(
                    FaCheck as unknown as React.ComponentType<{
                      size?: number;
                    }>,
                    { size: 14 }
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeManager;

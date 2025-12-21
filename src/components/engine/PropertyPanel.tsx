import React from 'react';
import { usePortfolioStore } from '../../store/store';

export const PropertyPanel: React.FC = () => {
  const { selectedComponent, components, updateComponent, selectComponent } = usePortfolioStore();

  const component = components.find((c: any) => c.id === selectedComponent);
  // compute ancestors in a stable hook so hooks order is preserved
  const ancestors = React.useMemo(() => {
    if (!selectedComponent) return [];
    const arr: any[] = [];
    const start = components.find((c: any) => c.id === selectedComponent);
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
  }, [selectedComponent, components]);

  if (!component) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ color: '#666' }}>Select a component to edit its properties.</div>
      </div>
    );
  }

  const handleContentChange = (content: string) => {
    updateComponent(component.id, { content });
  };

  const handleStyleChange = (property: string, value: string) => {
    updateComponent(component.id, {
      styles: { ...component.styles, [property]: value }
    });
  };

  // helpers for numeric px inputs for padding/margin
  const getPxValue = (key: string) => {
    const styles = component.styles as Record<string, any> | undefined;
    const v = styles?.[key];
    if (!v) return '';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'string' && v.endsWith('px')) return v.replace('px', '');
    return v;
  };

  const handlePxChange = (key: string, raw: string) => {
    const n = raw === '' ? '' : `${raw}px`;
    handleStyleChange(key, n);
  };

  const handleAllPaddingChange = (raw: string) => {
    const n = raw === '' ? '' : `${raw}px`;
    // set both individual sides and the shorthand `padding` so the
    // "All Padding" input reflects the applied value
    handleStyleChange('padding', n);
    ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach((k) =>
      handleStyleChange(k, n)
    );
  };

  const handleAllMarginChange = (raw: string) => {
    const n = raw === '' ? '' : `${raw}px`;
    // set both individual sides and the shorthand `margin` so the
    // "All Margin" input reflects the applied value
    handleStyleChange('margin', n);
    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach((k) =>
      handleStyleChange(k, n)
    );
  };

  // If shorthand `padding` or `margin` is not set, but individual sides
  // exist and are equal, allow getPxValue('padding'|'margin') to derive
  // a sensible value so the All inputs show the current effective size.
  const deriveShorthand = (key: 'padding' | 'margin') => {
    const styles = component.styles as Record<string, any> | undefined;
    if (!styles) return '';
    if (styles[key]) return getPxValue(key);
    const top = styles[`${key}Top`];
    const right = styles[`${key}Right`];
    const bottom = styles[`${key}Bottom`];
    const left = styles[`${key}Left`];
    if (!top && !right && !bottom && !left) return '';
    // normalize to px strings
    const toVal = (v: any) => {
      if (typeof v === 'string' && v.endsWith('px')) return v.replace('px', '');
      if (typeof v === 'number') return String(v);
      return null;
    };
    const t = toVal(top);
    const r = toVal(right);
    const b = toVal(bottom);
    const l = toVal(left);
    if (t && r && b && l && t === r && r === b && b === l) return t;
    return '';
  };

  const isSection = component.type === 'section';
  const isLayout = component.type === 'layout';

  

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="mb-4 text-lg text-gray-800">Properties</h3>

      {/* Breadcrumb showing ancestry of selected node — hidden for layout containers */}
      <div className="mb-3 text-sm text-gray-600">
        {ancestors.length > 0 && !isLayout && (
          <div className="flex items-center gap-2 flex-wrap">
            {ancestors.map((a) => (
              <button
                key={a.id}
                onClick={() => selectComponent(a.id)}
                className="text-xs px-2 py-1 bg-white border rounded text-gray-700 hover:bg-gray-50"
              >
                {a.type === 'layout' ? 'Layout' : a.type === 'section' ? 'Section' : (a.content || a.type).toString().slice(0, 20)}
              </button>
            ))}
            <span className="text-xs text-gray-400">›</span>
            <span className="text-xs font-semibold text-gray-800">{component.type === 'layout' ? 'Layout' : component.type === 'section' ? 'Section' : (component.content || component.type).toString().slice(0, 20)}</span>
          </div>
        )}
      </div>

      {!isSection && !isLayout && (
        <>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600">Content</label>
            <textarea
              value={component.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full min-h-[80px] p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm text-gray-600">Background</label>
            <input
              type="color"
              value={component.styles?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm text-gray-600">Text Color</label>
            <input
              type="color"
              value={component.styles?.color || '#333333'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-full h-10 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm text-gray-600">Font Size</label>
            <input
              type="range"
              min="12"
              max="48"
              value={parseInt(component.styles?.fontSize?.toString?.() || '16')}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
              className="w-full"
            />
          </div>
        </>
      )}

      {isSection && (
        <>
          <div className="mb-3">
            <label className="block mb-2 text-sm text-gray-600">All Padding (px)</label>
            <input
              type="number"
              value={getPxValue('padding') || deriveShorthand('padding') || ''}
              onChange={(e) => handleAllPaddingChange(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />

            <label className="block mb-2 text-sm text-gray-600">All Margin (px)</label>
            <input
              type="number"
              value={getPxValue('margin') || deriveShorthand('margin') || ''}
              onChange={(e) => handleAllMarginChange(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <h4 className="text-sm text-gray-700 mb-2">Padding (px)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600">Top</label>
                <input type="number" value={getPxValue('paddingTop')} onChange={(e) => handlePxChange('paddingTop', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Right</label>
                <input type="number" value={getPxValue('paddingRight')} onChange={(e) => handlePxChange('paddingRight', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Bottom</label>
                <input type="number" value={getPxValue('paddingBottom')} onChange={(e) => handlePxChange('paddingBottom', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Left</label>
                <input type="number" value={getPxValue('paddingLeft')} onChange={(e) => handlePxChange('paddingLeft', e.target.value)} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-sm text-gray-700 mb-2">Margin (px)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600">Top</label>
                <input type="number" value={getPxValue('marginTop')} onChange={(e) => handlePxChange('marginTop', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Right</label>
                <input type="number" value={getPxValue('marginRight')} onChange={(e) => handlePxChange('marginRight', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Bottom</label>
                <input type="number" value={getPxValue('marginBottom')} onChange={(e) => handlePxChange('marginBottom', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Left</label>
                <input type="number" value={getPxValue('marginLeft')} onChange={(e) => handlePxChange('marginLeft', e.target.value)} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm text-gray-600">Gap (px)</label>
            <input type="number" value={getPxValue('gap')} onChange={(e) => handlePxChange('gap', e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </>
      )}
      {isLayout && (
        <>
          <div className="mb-3">
            <label className="block mb-2 text-sm text-gray-600">All Padding (px)</label>
            <input
              type="number"
              value={getPxValue('padding') || deriveShorthand('padding') || ''}
              onChange={(e) => handleAllPaddingChange(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />

            <label className="block mb-2 text-sm text-gray-600">All Margin (px)</label>
            <input
              type="number"
              value={getPxValue('margin') || deriveShorthand('margin') || ''}
              onChange={(e) => handleAllMarginChange(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <h4 className="text-sm text-gray-700 mb-2">Padding (px)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600">Top</label>
                <input type="number" value={getPxValue('paddingTop')} onChange={(e) => handlePxChange('paddingTop', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Right</label>
                <input type="number" value={getPxValue('paddingRight')} onChange={(e) => handlePxChange('paddingRight', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Bottom</label>
                <input type="number" value={getPxValue('paddingBottom')} onChange={(e) => handlePxChange('paddingBottom', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Left</label>
                <input type="number" value={getPxValue('paddingLeft')} onChange={(e) => handlePxChange('paddingLeft', e.target.value)} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-sm text-gray-700 mb-2">Margin (px)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600">Top</label>
                <input type="number" value={getPxValue('marginTop')} onChange={(e) => handlePxChange('marginTop', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Right</label>
                <input type="number" value={getPxValue('marginRight')} onChange={(e) => handlePxChange('marginRight', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Bottom</label>
                <input type="number" value={getPxValue('marginBottom')} onChange={(e) => handlePxChange('marginBottom', e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Left</label>
                <input type="number" value={getPxValue('marginLeft')} onChange={(e) => handlePxChange('marginLeft', e.target.value)} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm text-gray-600">Gap (px)</label>
            <input type="number" value={getPxValue('gap')} onChange={(e) => handlePxChange('gap', e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyPanel;

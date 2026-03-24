import React, { useState } from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { usePortfolioStore } from '../../store/store';

/** Recursively build HTML for a component and its children. */
function renderComponentToHTML(component: any, allComponents: any[]): string {
  const children = allComponents.filter((c: any) => c.parentId === component.id);
  const styleStr = Object.entries(component.styles || {})
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
    .join(';');

  if (component.type === 'layout' || component.type === 'section') {
    const template = (component.template || '').toLowerCase();
    const isHorizontal = /horizontal|columns/.test(template);
    const isGrid = /grid/.test(template);
    let extraStyle = '';
    if (isGrid) extraStyle = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));';
    else if (isHorizontal) extraStyle = 'display:flex;flex-wrap:wrap;';
    const childrenHTML = children.map((ch: any) => renderComponentToHTML(ch, allComponents)).join('');
    return `<div style="${extraStyle}${styleStr}">${childrenHTML}</div>`;
  }

  switch (component.type) {
    case 'header':
      return `<h1 style="${styleStr}">${component.content}</h1>`;
    case 'text':
      return `<p style="${styleStr}">${component.content}</p>`;
    case 'image':
      return `<img src="${component.content}" alt="Portfolio" style="max-width:100%;height:auto;${styleStr}" />`;
    case 'button':
      return `<button style="${styleStr}">${component.content}</button>`;
    case 'card':
      return `<div style="border:1px solid #ddd;border-radius:8px;padding:12px;${styleStr}">${component.content}</div>`;
    case 'list': {
      const items = component.content.split('\n').filter(Boolean);
      return `<ul style="${styleStr}">${items.map((item: string) => `<li>${item}</li>`).join('')}</ul>`;
    }
    case 'quote':
      return `<blockquote style="${styleStr}">${component.content}</blockquote>`;
    case 'divider':
      return `<hr style="border:none;border-top:2px solid #ddd;margin:20px 0;${styleStr}" />`;
    default:
      return `<div style="${styleStr}">${component.content}</div>`;
  }
}

export const AdvancedControls: React.FC = () => {
  const { components, currentPageId, getComponentsByPage, getCurrentLayout } = usePortfolioStore();
  const [formCollapse, setFormCollapse] = useState(false);

  const getPageComponents = () => {
    if (typeof getComponentsByPage === 'function' && currentPageId) {
      return getComponentsByPage(currentPageId);
    }
    return components;
  };

  const buildBodyHTML = () => {
    const pageComps = getPageComponents();
    const topLevel = pageComps.filter((c: any) => !c.parentId);
    return topLevel.map((c: any) => renderComponentToHTML(c, pageComps)).join('\n');
  };

  const exportAsHTML = () => {
    const layout = getCurrentLayout?.();
    const bgColor = layout?.settings?.backgroundColor || '#ffffff';
    const textColor = layout?.settings?.textColor || '#333333';
    const bodyHTML = buildBodyHTML();
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Portfolio</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 20px; background: ${bgColor}; color: ${textColor}; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div style="max-width:${layout?.settings?.maxWidth || '1200px'};margin:0 auto;padding:${layout?.settings?.padding || '20px'}">
    ${bodyHTML}
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const layout = getCurrentLayout?.();
    const bgColor = layout?.settings?.backgroundColor || '#ffffff';
    const textColor = layout?.settings?.textColor || '#333333';
    const bodyHTML = buildBodyHTML();
    const html = `<html><head><meta charset="utf-8"><title>Portfolio</title>
<style>*, *::before, *::after { box-sizing: border-box; } body{font-family:Arial,Helvetica,sans-serif;padding:20px;background:${bgColor};color:${textColor};} img{max-width:100%;height:auto;}</style>
</head><body><div style="max-width:${layout?.settings?.maxWidth || '1200px'};margin:0 auto">
${bodyHTML}</div></body></html>`;
    const w = window.open('', '_blank', 'noopener');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="pt-3">
      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <div className="flex items-center justify-between">
          <h3 className="mb-3 text-gray-800">Export</h3>
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
                  FaCaretDown as unknown as React.ComponentType<{ size?: number }>,
                  { size: 20 }
                )}
          </button>
        </div>
        {formCollapse && (
          <div className="flex items-center justify-between gap-1">
            <button onClick={exportAsHTML} className="px-2 py-1 rounded border text-sm bg-white hover:bg-gray-50">
              Export HTML
            </button>
            <button onClick={exportAsPDF} className="px-2 py-1 rounded border text-sm bg-white hover:bg-gray-50">
              Export PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedControls;

import React from 'react';
import { BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { PiFileHtmlBold } from 'react-icons/pi';
import { usePortfolioStore } from '../../store/store';
import {
  getPageShellStyle,
  getResolvedLayoutSettings,
  resolveLayoutComponentStyles,
} from '../../utils/layout';

function renderComponentToHTML(component: any, accentColor: string): string {
  const styleStr = Object.entries(component.styles || {})
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
    .join(';');

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
      return `<div style="border:1px solid ${accentColor};border-radius:8px;padding:12px;${styleStr}">${component.content}</div>`;
    case 'list': {
      const items = component.content.split('\n').filter(Boolean);
      return `<ul style="${styleStr}">${items.map((item: string) => `<li>${item}</li>`).join('')}</ul>`;
    }
    case 'quote':
      return `<blockquote style="${styleStr}">${component.content}</blockquote>`;
    case 'divider':
      return `<hr style="border:none;border-top:2px solid ${accentColor};margin:20px 0;${styleStr}" />`;
    default:
      return `<div style="${styleStr}">${component.content}</div>`;
  }
}

export const AdvancedControls: React.FC = () => {
  const { components, currentPageId, getComponentsByPage, getCurrentLayout } = usePortfolioStore();

  const getPageComponents = () => {
    if (typeof getComponentsByPage === 'function' && currentPageId) {
      return getComponentsByPage(currentPageId);
    }
    return components;
  };

  const layout = getCurrentLayout?.();
  const resolvedLayout = getResolvedLayoutSettings(layout?.settings);
  const pageShellStyle = getPageShellStyle(layout?.settings);
  const pageShellStr = Object.entries(pageShellStyle)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
    .join(';');

  const renderNodeHTML = (component: any, pageComps: any[]): string => {
    const children = pageComps.filter((c: any) => c.parentId === component.id);

    if (component.type === 'layout' || component.type === 'section') {
      const styles =
        component.type === 'layout'
          ? resolveLayoutComponentStyles(component, layout?.settings)
          : component.styles || {};
      const style = Object.entries(styles)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
        .join(';');
      const childrenHTML = children.map((ch: any) => renderNodeHTML(ch, pageComps)).join('');
      return `<div style="${style}">${childrenHTML}</div>`;
    }

    return renderComponentToHTML(component, resolvedLayout.accentColor);
  };

  const buildBodyHTML = () => {
    const pageComps = getPageComponents();
    const topLevel = pageComps.filter((c: any) => !c.parentId);
    return topLevel.map((c: any) => renderNodeHTML(c, pageComps)).join('\n');
  };

  const exportAsHTML = () => {
    const bodyHTML = buildBodyHTML();
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Portfolio</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 20px; background: ${resolvedLayout.backgroundColor}; color: ${resolvedLayout.textColor}; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div style="${pageShellStr}">
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
    const bodyHTML = buildBodyHTML();
    const html = `<html><head><meta charset="utf-8"><title>Portfolio</title>
<style>*, *::before, *::after { box-sizing: border-box; } body{font-family:Arial,Helvetica,sans-serif;padding:20px;background:${resolvedLayout.backgroundColor};color:${resolvedLayout.textColor};} img{max-width:100%;height:auto;}</style>
</head><body><div style="${pageShellStr}">
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
    <div className="flex flex-col lg:flex-row items-center gap-1 md:gap-2">
      <button
        onClick={exportAsHTML}
        className="p-1 md:p-2 rounded border text-xs md:text-sm bg-white hover:bg-gray-50 w-full flex items-center justify-center"
        aria-label="Export HTML"
      >
        {React.createElement(
          PiFileHtmlBold as unknown as React.ComponentType<{ className?: string }>,
          { className: 'md:hidden text-base' }
        )}
        <span className="hidden md:inline">Export HTML</span>
      </button>
      <button
        onClick={exportAsPDF}
        className="p-1 md:p-2 rounded border text-xs md:text-sm bg-white hover:bg-gray-50 w-full flex items-center justify-center"
        aria-label="Export PDF"
      >
        {React.createElement(
          BsFillFileEarmarkPdfFill as unknown as React.ComponentType<{ className?: string }>,
          { className: 'md:hidden text-sm' }
        )}
        <span className="hidden md:inline">Export PDF</span>
      </button>
    </div>
  );
};

export default AdvancedControls;

import React, { useRef, useState } from 'react';
import { usePortfolioStore } from '../../store/store';

export const AdvancedControls: React.FC = () => {
  const { components } = usePortfolioStore();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportAsHTML = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} .component{margin-bottom:16px}</style></head><body><div class="container">${components.map((comp: any) => `<div class="component" style="${Object.entries(comp.styles || {}).map(([k,v]) => `${k}:${v}`).join(';')}">${comp.type === 'image' ? `<img src="${comp.content}" style="max-width:100%"/>` : comp.content}</div>`).join('')}</div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const html = `<html><head><meta charset="utf-8"><title>Portfolio</title><style>body{font-family:Arial;padding:20px}.component{margin-bottom:16px}</style></head><body>${components.map((comp: any) => `<div class="component" style="${Object.entries(comp.styles || {}).map(([k,v]) => `${k}:${v}`).join(';')}">${comp.type === 'image' ? `<img src="${comp.content}" style="max-width:100%"/>` : comp.content}</div>`).join('')}</body></html>`;
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
      <button onClick={exportAsHTML} className="mr-2 px-3 py-1 rounded border">Export HTML</button>
      <button onClick={exportAsPDF} className="px-3 py-1 rounded border">Export PDF</button>
    </div>
  );
};

export default AdvancedControls;

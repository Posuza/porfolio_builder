import React, { useState, useRef } from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { usePortfolioStore } from '../../store/store';

export const AdvancedControls: React.FC = () => {
  const { components } = usePortfolioStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [formCollapse, setFormCollapse] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportAsHTML = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} .component{margin-bottom:16px}</style></head><body><div class="container">${components.filter((c:any)=>c.type!=='layout').map((comp: any) => `<div class="component" style="${Object.entries(comp.styles || {}).map(([k,v]) => `${k}:${v}`).join(';')}">${comp.type === 'image' ? `<img src="${comp.content}" style="max-width:100%"/>` : comp.content}</div>`).join('')}</div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const html = `<html><head><meta charset="utf-8"><title>Portfolio</title><style>body{font-family:Arial;padding:20px}.component{margin-bottom:16px}</style></head><body>${components.filter((c:any)=>c.type!=='layout').map((comp: any) => `<div class="component" style="${Object.entries(comp.styles || {}).map(([k,v]) => `${k}:${v}`).join(';')}">${comp.type === 'image' ? `<img src="${comp.content}" style="max-width:100%"/>` : comp.content}</div>`).join('')}</body></html>`;
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
        {formCollapse ? (

        <div className="flex items-center justify-between gap-1">
          <button onClick={exportAsHTML} className="px-2 py-1 rounded border text-md">Export HTML</button>
          <button onClick={exportAsPDF} className="px-2 py-1 rounded border text-md">Export PDF</button>
        </div>
        ) : null}

      </div>

    </div>
  );
};

export default AdvancedControls;

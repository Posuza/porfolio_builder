import React, { useRef, useState } from 'react';
import { Component, usePortfolioStore } from '../store/store';

export const AdvancedControls: React.FC = () => {
  const { components, pages, layouts, addComponent, currentPageId } = usePortfolioStore();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportAsHTML = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} .component{margin-bottom:16px}</style></head><body><div class="container">${components.map((comp: Component) => `<div class="component" style="${Object.entries(comp.styles || {}).map(([k,v]) => `${k}:${v}`).join(';')}">${comp.type === 'image' ? `<img src="${comp.content}" style="max-width:100%"/>` : comp.content}</div>`).join('')}</div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    // open printable window — user can Save as PDF from print dialog
    const html = `<html><head><meta charset="utf-8"><title>Portfolio</title><style>body{font-family:Arial;padding:20px}.component{margin-bottom:16px}</style></head><body>${components.map((comp: Component) => `<div class="component" style="${Object.entries(comp.styles || {}).map(([k,v]) => `${k}:${v}`).join(';')}">${comp.type === 'image' ? `<img src="${comp.content}" style="max-width:100%"/>` : comp.content}</div>`).join('')}</body></html>`;
    const w = window.open('', '_blank', 'noopener');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const exportAsWord = () => {
    const htmlBody = `<html><body>${components.map((comp: Component) => `<div>${comp.type === 'image' ? `<img src="${comp.content}" style="max-width:100%"/>` : comp.content}</div>`).join('')}</body></html>`;
    const blob = new Blob([htmlBody], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'html' || ext === 'htm') {
        // import as one section component containing body HTML
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyHtml = bodyMatch ? bodyMatch[1] : text;
        addComponent({
          type: 'section',
          content: bodyHtml,
          styles: { padding: '16px', margin: '8px' },
          position: { x: 0, y: 0 },
          pageId: currentPageId || 'default',
        });
      } else {
        // plain text or word-like files: import as text component
        addComponent({
          type: 'text',
          content: text,
          styles: { padding: '16px', margin: '8px' },
          position: { x: 0, y: 0 },
          pageId: currentPageId || 'default',
        });
      }
      // clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const duplicatePage = () => {
    console.log('Duplicate current page');
  };

  const clearAll = () => {
    if (window.confirm('Clear all components? This cannot be undone.')) {
      // not implemented here — keep placeholder
      console.log('Clear all components');
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Advanced</h3>

      {/* Primary export/import controls moved up */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={exportAsHTML} style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📄 Export HTML</button>
        <button onClick={exportAsPDF} style={{ padding: '8px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🖨️ Export PDF</button>
        <button onClick={exportAsWord} style={{ padding: '8px 12px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📄 Export Word</button>
        <button onClick={onImportClick} style={{ padding: '8px 12px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📥 Import</button>
        <input ref={fileInputRef} type="file" accept=".html,.htm,.txt,.doc,.docx" onChange={handleImport} style={{ display: 'none' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={() => setShowExportOptions(!showExportOptions)} style={{ padding: '8px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>🚀 More</button>

        {showExportOptions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '12px' }}>
            <button onClick={exportAsHTML} style={{ padding: '6px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📄 Export as HTML</button>
            <button onClick={exportAsPDF} style={{ padding: '6px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>🖨️ Export as PDF (print)</button>
            <button onClick={exportAsWord} style={{ padding: '6px 10px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📄 Export as Word</button>
          </div>
        )}

        <button onClick={duplicatePage} style={{ padding: '8px 12px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>📋 Duplicate Page</button>
        <button onClick={clearAll} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>🗑️ Clear All</button>
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: '#666' }}>
        <div>📊 {components.length} components</div>
        <div>📄 {pages.length} pages</div>
        <div>🎨 {layouts.length} layouts</div>
      </div>
    </div>
  );
};
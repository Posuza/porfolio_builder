import React from 'react';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const inferLayoutLabel = (comp: any) => {
  if (!comp || comp.type !== 'layout' || !comp.styles) return 'Layout';
  const s = comp.styles || {};
  const cols = String(s.gridTemplateColumns || '').replace(/\s+/g, '');
  if (cols.includes('repeat(3') || cols.split(' ').length >= 3) return 'Grid';
  if (cols.includes('2fr1fr') || cols.includes('2fr')) return 'Uneven Grid';
  if (cols.includes('repeat(2') || cols.split(' ').length === 2) return 'Horizontal Columns';
  return 'Vertical Column';
};

export const getLabel = (comp: any) => {
  if (!comp) return '';
  if (comp.type === 'layout') return inferLayoutLabel(comp);
  return capitalize(comp.type || 'component');
};

export const renderIcon = (type: string) => {
  const common = { className: 'w-4 h-4 text-gray-500', width: 16, height: 16 } as any;
  switch (type) {
    case 'header':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="3" rx="1" fill="currentColor" />
          <rect x="3" y="10" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
      );
    case 'text':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="10" width="14" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="14" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      );
    case 'image':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="9" r="1.2" fill="currentColor" />
          <path d="M3 17l5-5 4 4 6-6v7H3z" fill="currentColor" />
        </svg>
      );
    case 'button':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="7" width="18" height="10" rx="3" fill="currentColor" />
        </svg>
      );
    case 'layout':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
          <rect x="13" y="3" width="8" height="4" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="13" y="9" width="8" height="7" rx="1" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'section':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="4" rx="1" fill="currentColor" />
          <rect x="3" y="11" width="18" height="4" rx="1" fill="currentColor" opacity="0.9" />
        </svg>
      );
    case 'card':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <rect x="6" y="7" width="6" height="3" rx="1" fill="currentColor" />
        </svg>
      );
    case 'list':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="5" cy="6" r="1.2" fill="currentColor" />
          <rect x="8" y="5" width="12" height="2" rx="1" fill="currentColor" />
          <circle cx="5" cy="12" r="1.2" fill="currentColor" />
          <rect x="8" y="11" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
      );
    case 'quote':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 7h3v7H5V9a2 2 0 0 1 2-2zM14 7h3v7h-5V9a2 2 0 0 1 2-2z" fill="currentColor" />
        </svg>
      );
    case 'divider':
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="11.5" width="18" height="1" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
  }
};

const uiMeta = { getLabel, renderIcon };

export default uiMeta;

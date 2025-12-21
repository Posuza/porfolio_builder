import React from 'react';
import iconRegistry from './iconRegistry';

type ComponentType =
  | 'header'
  | 'text'
  | 'image'
  | 'button'
  | 'section'
  | 'layout'
  | 'card'
  | 'list'
  | 'quote'
  | 'divider'
  | string;

export function getLabel(typeOrComp: ComponentType | any): string {
  const type = typeof typeOrComp === 'string' ? typeOrComp : typeOrComp?.type;
  switch (type) {
    case 'header':
      return 'Header';
    case 'text':
      return 'Text';
    case 'image':
      return 'Image';
    case 'button':
      return 'Button';
    case 'section':
      return 'Section';
    case 'layout':
      return 'Layout';
    case 'card':
      return 'Card';
    case 'list':
      return 'List';
    case 'quote':
      return 'Quote';
    case 'divider':
      return 'Divider';
    default:
      return String(type || 'Component');
  }
}

const IconCommon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={props.className}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export function renderIcon(typeOrComp: ComponentType | any) {
  const commonProps = { width: 16, height: 16, className: 'inline-block mr-2 text-gray-600' };
  // accept either a plain type string or a component object
  const compObj = typeof typeOrComp === 'string' ? null : typeOrComp;
  // Resolve a deterministic icon key for the input.
  // Priority: explicit `component.icon` -> for layouts use `component.template` -> component.type -> plain string
  let key: string | undefined;
  if (compObj) {
    if (compObj.icon) {
      key = compObj.icon;
    } else if (compObj.type === 'layout') {
      key = compObj.template || 'layout';
    } else {
      key = compObj.type;
    }
  } else if (typeof typeOrComp === 'string') {
    key = typeOrComp;
  }

  // If registry contains an icon for this key, render it (keeps icons consistent)
  if (key) {
    const RegIcon = iconRegistry[key];
    if (RegIcon) return React.createElement(RegIcon as any, { className: 'w-4 h-4 inline-block mr-2 text-gray-600' });
  }

  switch (key) {
    case 'header':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M4 6h16M4 18h16M8 6v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'text':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M4 6h16M4 12h14M4 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'image':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8" cy="9" r="1" fill="currentColor" />
        </svg>
      );
    case 'button':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'section':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 9h18" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'layout':
      // layout container: show a slightly different icon to indicate container
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="2.5" y="4" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 8h12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    // specific layout templates
    case 'grid':
    case 'uneven-grid':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'horizontal_columns':
    case 'verticle-column':
    case 'vertical-column':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="4" width="6" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="10" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="16" y="4" width="5" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'grid-2cols':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="13" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'card':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 10h8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'list':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'quote':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M7 7h4v4H7zM13 7h4v4h-4z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'divider':
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return <IconCommon className="inline-block mr-2 text-gray-600" />;
  }
}

export function getIconKey(typeOrComp: ComponentType | any): string | undefined {
  const compObj = typeof typeOrComp === 'string' ? null : typeOrComp;
  if (compObj) {
    if (compObj.icon) return compObj.icon;
    if (compObj.type === 'layout') return compObj.template || 'layout';
    return compObj.type;
  }
  return typeof typeOrComp === 'string' ? typeOrComp : undefined;
}

export const uiMeta = { getLabel, renderIcon, getIconKey };

export default uiMeta;

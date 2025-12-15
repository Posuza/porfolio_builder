import React from 'react';
import { usePortfolioStore } from '../store/store';

export const ThemeManager: React.FC = () => {
  const { getCurrentLayout, updateLayout, currentLayoutId } = usePortfolioStore();
  const currentLayout = getCurrentLayout();

  const themes = [
    { name: 'Light', bg: '#ffffff', text: '#333333', accent: '#007bff' },
    { name: 'Dark', bg: '#1a1a1a', text: '#ffffff', accent: '#00d4aa' },
    { name: 'Blue', bg: '#f0f8ff', text: '#1e3a8a', accent: '#3b82f6' },
    { name: 'Green', bg: '#f0fdf4', text: '#166534', accent: '#22c55e' },
    { name: 'Purple', bg: '#faf5ff', text: '#581c87', accent: '#a855f7' },
  ];

  const applyTheme = (theme: any) => {
    if (!currentLayoutId) return;
    
    updateLayout(currentLayoutId, {
      settings: {
        ...currentLayout?.settings,
        backgroundColor: theme.bg,
       }
     });
   };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Themes</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => applyTheme(theme)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: theme.bg,
              color: theme.text,
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '40px',
            }}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};
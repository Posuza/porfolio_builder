import React from 'react';
import { usePortfolioStore } from '../../store/store';

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
    <div className="p-4 bg-gray-100 rounded-md mb-4">
      <h3 className="mb-3 text-gray-800">Themes</h3>

      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => applyTheme(theme)}
            className="p-2 border rounded text-sm flex items-center justify-center min-h-[40px]"
            style={{ backgroundColor: theme.bg, color: theme.text }}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeManager;

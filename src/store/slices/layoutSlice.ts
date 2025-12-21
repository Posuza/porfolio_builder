import { StateCreator } from 'zustand';

export interface Layout {
  id: string;
  name: string;
  // allow flexible template keys (including legacy/alternate names)
  template: string;
  settings: {
    maxWidth?: string;
    padding?: string;
    backgroundColor?: string;
    gap?: string;
    surfaceColor?: string;
    textColor?: string;
    accentColor?: string;
  };
}

export interface LayoutSlice {
  layouts: Layout[];
  currentLayoutId: string | null;
  addLayout: (layout: Omit<Layout, 'id'>) => void;
  updateLayout: (id: string, updates: Partial<Layout>) => void;
  deleteLayout: (id: string) => void;
  setCurrentLayout: (id: string) => void;
  getCurrentLayout: () => Layout | null;
}

export const createLayoutSlice: StateCreator<LayoutSlice> = (set, get) => ({
  layouts: [
    {
      id: 'default',
      name: 'Single Column',
      template: 'single-column',
      settings: {
        maxWidth: '1200px',
        padding: '20px',
        backgroundColor: '#ffffff',
        gap: '16px',
      },
    }
  ],
  currentLayoutId: 'default',
  
  addLayout: (layout) => {
    const newLayout: Layout = {
      ...layout,
      id: Date.now().toString(),
    };
    set((state) => ({
      layouts: [...state.layouts, newLayout],
      currentLayoutId: newLayout.id,
    }));
  },
  
  updateLayout: (id, updates) => {
    set((state) => ({
      layouts: state.layouts.map(layout =>
        layout.id === id ? { ...layout, ...updates } : layout
      ),
    }));
  },
  
  deleteLayout: (id) => {
    const { layouts, currentLayoutId } = get();
    if (layouts.length <= 1) return;
    
    const newLayouts = layouts.filter(layout => layout.id !== id);
    const newCurrentId = currentLayoutId === id ? newLayouts[0]?.id : currentLayoutId;
    
    set({
      layouts: newLayouts,
      currentLayoutId: newCurrentId,
    });
  },
  
  setCurrentLayout: (id) => {
    set({ currentLayoutId: id });
  },
  
  getCurrentLayout: () => {
    const { layouts, currentLayoutId } = get();
    return layouts.find(layout => layout.id === currentLayoutId) || null;
  },
});
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ComponentSlice, createComponentSlice } from './slices/componentSlice';
import { PageSlice, createPageSlice } from './slices/pageSlice';
import { LayoutSlice, createLayoutSlice } from './slices/layoutSlice';
import { HistorySlice, createHistorySlice } from './slices/historySlice';

export type PortfolioStore = ComponentSlice & PageSlice & LayoutSlice & HistorySlice;

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (...a) => ({
      ...createComponentSlice(...a),
      ...createPageSlice(...a),
      ...createLayoutSlice(...a),
      ...createHistorySlice(...a),
    }),
    {
      name: 'portfolio-builder-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the data fields, not computed/action functions or history stacks
      partialize: (state) => ({
        components: state.components,
        pages: state.pages,
        currentPageId: state.currentPageId,
        layouts: state.layouts,
        currentLayoutId: state.currentLayoutId,
        selectedComponent: state.selectedComponent,
      }),
    }
  )
);

// Re-export types for convenience
export type { Component } from './slices/componentSlice';
export type { Page } from './slices/pageSlice';
export type { Layout } from './slices/layoutSlice';

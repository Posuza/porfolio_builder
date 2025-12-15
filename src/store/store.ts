import { create } from 'zustand';
import { ComponentSlice, createComponentSlice } from './slices/componentSlice';
import { PageSlice, createPageSlice } from './slices/pageSlice';
import { LayoutSlice, createLayoutSlice } from './slices/layoutSlice';

export type PortfolioStore = ComponentSlice & PageSlice & LayoutSlice;

export const usePortfolioStore = create<PortfolioStore>()((...a) => ({
  ...createComponentSlice(...a),
  ...createPageSlice(...a),
  ...createLayoutSlice(...a),
}));

// Re-export types for convenience
export type { Component } from './slices/componentSlice';
export type { Page } from './slices/pageSlice';
export type { Layout } from './slices/layoutSlice';
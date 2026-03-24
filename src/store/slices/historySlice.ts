import { StateCreator } from 'zustand';
import { ComponentSlice } from './componentSlice';
import { PageSlice } from './pageSlice';
import { LayoutSlice } from './layoutSlice';

type HistorySnapshot = {
  components: ComponentSlice['components'];
  pages: PageSlice['pages'];
  currentPageId: PageSlice['currentPageId'];
  layouts: LayoutSlice['layouts'];
  currentLayoutId: LayoutSlice['currentLayoutId'];
};

export interface HistorySlice {
  _past: HistorySnapshot[];
  _future: HistorySnapshot[];
  /** Call this before any mutation to push a snapshot onto the undo stack. */
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const createHistorySlice: StateCreator<
  ComponentSlice & PageSlice & LayoutSlice & HistorySlice,
  [],
  [],
  HistorySlice
> = (set, get) => ({
  _past: [],
  _future: [],

  pushHistory: () => {
    const state = get();
    const snapshot: HistorySnapshot = {
      components: JSON.parse(JSON.stringify(state.components)),
      pages: JSON.parse(JSON.stringify(state.pages)),
      currentPageId: state.currentPageId,
      layouts: JSON.parse(JSON.stringify(state.layouts)),
      currentLayoutId: state.currentLayoutId,
    };
    set((s) => ({
      _past: [...s._past.slice(-49), snapshot], // keep at most 50 snapshots
      _future: [],
    }));
  },

  undo: () => {
    const { _past, _future } = get();
    if (_past.length === 0) return;

    const current: HistorySnapshot = {
      components: JSON.parse(JSON.stringify(get().components)),
      pages: JSON.parse(JSON.stringify(get().pages)),
      currentPageId: get().currentPageId,
      layouts: JSON.parse(JSON.stringify(get().layouts)),
      currentLayoutId: get().currentLayoutId,
    };

    const prev = _past[_past.length - 1];
    set({
      ...(prev as any),
      _past: _past.slice(0, -1),
      _future: [current, ..._future],
    });
  },

  redo: () => {
    const { _past, _future } = get();
    if (_future.length === 0) return;

    const current: HistorySnapshot = {
      components: JSON.parse(JSON.stringify(get().components)),
      pages: JSON.parse(JSON.stringify(get().pages)),
      currentPageId: get().currentPageId,
      layouts: JSON.parse(JSON.stringify(get().layouts)),
      currentLayoutId: get().currentLayoutId,
    };

    const next = _future[0];
    set({
      ...(next as any),
      _past: [..._past, current],
      _future: _future.slice(1),
    });
  },

  canUndo: () => get()._past.length > 0,
  canRedo: () => get()._future.length > 0,
});

import { StateCreator } from 'zustand';

export interface Component {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'section' | 'layout' | 'card' | 'list' | 'quote' | 'divider';
  content: string;
  styles: {
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
  position: { x: number; y: number };
  parentId?: string;
  // optional template identifier for layout-type components
  template?: string;
  // optional explicit icon key to force icon selection in UI
  icon?: string;
  pageId: string;
}

export interface ComponentSlice {
  components: Component[];
  selectedComponent: string | null;
  addComponent: (component: Omit<Component, 'id'> & { id?: string }) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, position: { x: number; y: number }) => void;
  reorderComponents: (dragIndex: number, hoverIndex: number) => void;
  getComponentsByPage: (pageId: string) => Component[];
}

export const createComponentSlice: StateCreator<ComponentSlice> = (set, get) => ({
  components: [],
  selectedComponent: null,
  
  addComponent: (component) => {
    const newComponent: Component = {
      ...component,
      id: (component as any).id || Date.now().toString(),
    };
    // Debug: log layout creations to help trace drag/drop vs click flows
    if (newComponent.type === 'layout') {
      // eslint-disable-next-line no-console
      console.info('[store] addComponent (layout):', JSON.parse(JSON.stringify(newComponent)));
    }
    set((state) => ({
      components: [...state.components, newComponent],
    }));
  },
  
  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    }));
  },
  
  deleteComponent: (id) => {
    set((state) => {
      // remove the target component and any descendants (by parentId) recursively
      const toRemove = new Set<string>([id]);
      let added = true;
      while (added) {
        added = false;
        for (const comp of state.components) {
          if (!comp) continue;
          if (comp.parentId && toRemove.has(comp.parentId) && !toRemove.has(comp.id)) {
            toRemove.add(comp.id);
            added = true;
          }
        }
      }

      const newComponents = state.components.filter((comp) => !toRemove.has(comp.id));
      const newSelected = toRemove.has(state.selectedComponent || '') ? null : state.selectedComponent;

      return {
        components: newComponents,
        selectedComponent: newSelected,
      };
    });
  },
  
  selectComponent: (id) => {
    set({ selectedComponent: id });
  },
  
  moveComponent: (id, position) => {
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, position } : comp
      ),
    }));
  },
  
  reorderComponents: (dragIndex, hoverIndex) => {
    const { components } = get();
    // guard against invalid indices or missing dragged item
    if (!Array.isArray(components)) return;
    if (typeof dragIndex !== 'number' || typeof hoverIndex !== 'number') return;
    if (dragIndex < 0 || dragIndex >= components.length) return;
    const draggedComponent = components[dragIndex];
    if (!draggedComponent) return;

    const newComponents = [...components];
    newComponents.splice(dragIndex, 1);
    // if hoverIndex is now out of bounds after removal, clamp it
    const clampedIndex = Math.max(0, Math.min(hoverIndex, newComponents.length));
    newComponents.splice(clampedIndex, 0, draggedComponent);
    set({ components: newComponents });
  },

  getComponentsByPage: (pageId) => {
    return get().components.filter(comp => comp && comp.pageId === pageId);
  },
});
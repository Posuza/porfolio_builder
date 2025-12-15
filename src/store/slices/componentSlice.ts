import { StateCreator } from 'zustand';

export interface Component {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'section' | 'card' | 'list' | 'quote' | 'divider';
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
  pageId: string;
}

export interface ComponentSlice {
  components: Component[];
  selectedComponent: string | null;
  addComponent: (component: Omit<Component, 'id'>) => void;
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
      id: Date.now().toString(),
    };
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
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id),
      selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
    }));
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
    const draggedComponent = components[dragIndex];
    const newComponents = [...components];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, draggedComponent);
    set({ components: newComponents });
  },

  getComponentsByPage: (pageId) => {
    return get().components.filter(comp => comp.pageId === pageId);
  },
});
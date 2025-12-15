import { StateCreator } from 'zustand';

export interface Page {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export interface PageSlice {
  pages: Page[];
  currentPageId: string | null;
  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  getCurrentPage: () => Page | null;
}

export const createPageSlice: StateCreator<PageSlice> = (set, get) => ({
  pages: [
    {
      id: 'default',
      name: 'Home',
      slug: 'home',
      isActive: true,
      createdAt: new Date().toISOString(),
    }
  ],
  currentPageId: 'default',
  
  addPage: (name) => {
    const newPage: Page = {
      id: Date.now().toString(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      pages: [...state.pages, newPage],
      currentPageId: newPage.id,
    }));

    // Auto-load sample components for the new page if component slice is available
    const store = get() as any;
    if (typeof store.getComponentsByPage === 'function' && typeof store.addComponent === 'function') {
      const comps = store.getComponentsByPage(newPage.id);
      if (!comps || comps.length === 0) {
        const samples = [
          {
            type: 'header',
            content: 'Welcome to my portfolio',
            styles: { color: '#222', fontSize: '28px', textAlign: 'center', padding: '12px' },
            position: { x: 0, y: 0 },
            pageId: newPage.id,
          },
          {
            type: 'text',
            content: 'A short about section. Tell visitors who you are.',
            styles: { color: '#444', fontSize: '16px', padding: '12px', textAlign: 'left' },
            position: { x: 0, y: 80 },
            pageId: newPage.id,
          },
        ];
        samples.forEach((s) => store.addComponent(s));
      }
    }
  },
  
  deletePage: (id) => {
    const { pages, currentPageId } = get();
    if (pages.length <= 1) return;
    
    const newPages = pages.filter(page => page.id !== id);
    const newCurrentId = currentPageId === id ? newPages[0]?.id : currentPageId;
    
    set({
      pages: newPages,
      currentPageId: newCurrentId,
    });
  },
  
  setCurrentPage: (id) => {
    set({ currentPageId: id });

    // If the target page has no components, auto-load a small sample set.
    const store = get() as any;
    if (typeof store.getComponentsByPage === 'function' && typeof store.addComponent === 'function') {
      const comps = store.getComponentsByPage(id);
      if (!comps || comps.length === 0) {
        const samples = [
          {
            type: 'header',
            content: 'Page title',
            styles: { color: '#111', fontSize: '24px', textAlign: 'center', padding: '12px' },
            position: { x: 0, y: 0 },
            pageId: id,
          },
          {
            type: 'text',
            content: 'Add your content here.',
            styles: { color: '#333', fontSize: '16px', padding: '12px', textAlign: 'left' },
            position: { x: 0, y: 64 },
            pageId: id,
          },
        ];
        samples.forEach((s) => store.addComponent(s));
      }
    }
  },
  
  updatePage: (id, updates) => {
    set((state) => ({
      pages: state.pages.map(page =>
        page.id === id ? { ...page, ...updates } : page
      ),
    }));
  },
  
  getCurrentPage: () => {
    const { pages, currentPageId } = get();
    return pages.find(page => page.id === currentPageId) || null;
  },
});
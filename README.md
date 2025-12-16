# Portfolio Builder

A small React + TypeScript portfolio builder (CRA) with an editor (studio) and public preview pages.

## Overview
- Editor (studio): build pages with drag-and-drop components, manage layouts and themes.
- Public pages: rendered previews of saved pages at `/pages/:slug`.
- State: Zustand slices for pages, components and layouts.
- Components: two folders — `src/components/engine/` (editor engine copies) and `src/components/project/` (project-specific components).

## Project structure (key files)
- `src/App.tsx` — app entry that renders the router.
- `src/router.tsx` — routes (editor under `/studio`, public pages under `/pages/:slug`).
- `src/pages/` — `builderPage`, `previewPage`, `PublicPage`.
- `src/components/engine/` — editor UI (Canvas, Palette, PropertyPanel, etc.).
- `src/components/project/` — your project components (can be used to replace engine copies).
- `src/store/` — Zustand store slices: `pageSlice`, `componentSlice`, `layoutSlice`.

## Getting started (local)
1. Install dependencies:

```bash
yarn install
```

2. (Optional) Install Tailwind deps if you want Tailwind utilities to work:

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Run dev server:

```bash
yarn start
```

4. Build for production:

```bash
yarn build
```

## Notes and next steps
- The repository currently uses `components/engine/*` for the editor. If you prefer the original project components, I can switch imports to `components/project/*` or add a runtime toggle to choose between them.
- Some TypeScript/react-dnd ref casts are pragmatic to get the editor working; these can be tightened later.
- Run `yarn build` locally to surface any remaining TypeScript / ESLint issues.

## Contact / Contributing
- Edit files in `src/` and open a PR. If you want, I can implement the project-component revert or add the runtime toggle next.
yarn build
# Portfolio Builder — concise

Simple CRA + TypeScript portfolio builder with an editor (studio) and public previews.

Quick summary
- Editor: drag & drop components, manage pages, layouts and themes.
- Public preview: view published pages at /pages/:slug.
- State: Zustand slices under `src/store`.

Quick start
1. Install dependencies:

```bash
yarn install
```

2. (Optional) If you want Tailwind utilities to be available:

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

After installing, ensure `postcss.config.js` and `tailwind.config.js` are created, and replace `src/index.css` with the Tailwind directives (this file already contains the directives; installing the deps is required for them to be processed):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Run dev server:

```bash
yarn start
```

Main files
- `src/router.tsx` — routing for editor and public pages.
- `src/pages/` — editor and preview page components.
- `src/components/engine/` — editor (engine) components.
- `src/components/project/` — place for project-specific component implementations.
- `src/store/` — Zustand slices: `pageSlice`, `componentSlice`, `layoutSlice`.

Developer notes
- The editor currently imports `components/engine/*`. I can switch these back to `components/project/*` or add a runtime toggle.
- Some quick type casts are used for react-dnd refs; these can be tightened later.
- Run `yarn build` locally to surface any remaining TypeScript or ESLint issues.

Next steps you can ask me to do
- Revert builder imports to `components/project/*`.
- Add a runtime/dev toggle to pick engine vs project components.
- Tighten TypeScript types around react-dnd usage.

License & contributions
- Edit files in `src/` and open a PR. Ask me to implement the next step you prefer.

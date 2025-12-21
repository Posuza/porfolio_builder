// Re-export helpers from the TSX implementation without including JSX in .ts files
// Lightweight re-export to the .tsx implementation. Import without extension
// so TypeScript and the bundler resolve the proper implementation file.
// Re-export everything from the TSX implementation to avoid local bindings
// that can create circular alias issues in TypeScript.
export * from './uiMeta_impl';
export { uiMeta } from './uiMeta_impl';
export { uiMeta as default } from './uiMeta_impl';

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BuilderPage from './pages/builderPage';
import PreviewPage from './pages/previewPage';
import PublicPage from './pages/PublicPage';
import Layout from './layout/Layout';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Editor / Studio routes */}
      <Route path="/studio" element={<Layout />}>
        <Route index element={<Navigate to="builder" replace />} />
        <Route path="builder" element={<BuilderPage />} />
        <Route path="builder/:pageId" element={<BuilderPage />} />
        <Route path="preview" element={<PreviewPage />} />
      </Route>

      {/* Public project pages (wrapped with Layout so header/footer show) */}
      <Route path="/pages" element={<Layout />}>
        <Route path=":slug" element={<PublicPage />} />
      </Route>

      {/* Root redirect to editor studio */}
      <Route path="/" element={<Navigate to="/studio/builder" replace />} />
    </Routes>
  );
};

export default AppRouter;

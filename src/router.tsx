import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BuilderPage from './pages/builderPage';
import PreviewPage from './pages/previewPage';
import PublicPage from './pages/PublicPage';
import Layout from './layout/Layout';

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '80px 20px' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#1e293b' }}>404</h1>
    <p style={{ fontSize: '18px', color: '#64748b', marginTop: '8px' }}>Page not found.</p>
    <a href="/" style={{ display: 'inline-block', marginTop: '24px', padding: '10px 24px', background: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
      Go to Editor
    </a>
  </div>
);

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

      {/* 404 fallback */}
      <Route path="*" element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

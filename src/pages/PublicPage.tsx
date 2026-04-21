import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioStore } from '../store/store';
import { PreviewMode } from '../components/engine/PreviewMode';
import { getResolvedLayoutSettings } from '../utils/layout';

const PublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pages, setCurrentPage, getCurrentPage, getCurrentLayout } = usePortfolioStore();

  useEffect(() => {
    if (!slug) return;
    const page = pages.find((p) => p.slug === slug || p.id === slug);
    if (page) setCurrentPage(page.id);
  }, [slug, pages, setCurrentPage]);

  const current = getCurrentPage();
  const resolvedLayout = getResolvedLayoutSettings(getCurrentLayout()?.settings);
  if (!current) return <div style={{ padding: 40 }}>Page not found.</div>;

  return (
    <div style={{ background: resolvedLayout.backgroundColor, minHeight: '100vh' }}>
      <PreviewMode />
    </div>
  );
};

export default PublicPage;

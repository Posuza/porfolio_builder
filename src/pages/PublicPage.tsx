import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioStore } from '../store/store';
import { PreviewMode } from '../components/engine/PreviewMode';

const PublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pages, setCurrentPage, getCurrentPage } = usePortfolioStore();

  useEffect(() => {
    if (!slug) return;
    const page = pages.find((p) => p.slug === slug || p.id === slug);
    if (page) setCurrentPage(page.id);
  }, [slug, pages, setCurrentPage]);

  const current = getCurrentPage();
  if (!current) return <div style={{ padding: 40 }}>Page not found.</div>;

  return (
    <div style={{ background: current ? '#fff' : undefined }}>
      <PreviewMode />
    </div>
  );
};

export default PublicPage;

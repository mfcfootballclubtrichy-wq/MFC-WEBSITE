/**
 * NewsDetail.jsx — Dedicated Article Page for MFC Announcements, Camp Reports & Match Updates.
 * Displays high-resolution gallery, structured paragraphs, dates, tags, and related news.
 */
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content } = useContent();
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);

  const updatesList = content?.updates || [];

  // Find update by ID or slug match
  const article = updatesList.find((item, index) => {
    if (item.id === id) return true;
    const itemSlug = encodeURIComponent((item.title || `update-${index}`).toLowerCase().replace(/\s+/g, '-'));
    return itemSlug === id;
  }) || updatesList[0];

  if (!article) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--muted)', margin: 'var(--space-4) 0 var(--space-6)' }}>
          The news post or announcement you are looking for may have been updated or removed.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  // Gallery images support (item.gallery or array of image URLs)
  const galleryImages = Array.isArray(article.gallery) && article.gallery.length > 0
    ? article.gallery
    : (article.image ? [article.image] : []);

  // Other related updates
  const otherUpdates = updatesList.filter((item) => (item.id || item.title) !== (article.id || article.title));

  return (
    <>
      {/* Article Hero */}
      <section className="page-hero" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: 'var(--fs-sm)',
              marginBottom: 'var(--space-4)',
              padding: 0,
            }}
          >
            ← Back to Updates
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <span className="card__tag" style={{ background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px' }}>
              {article.tag || 'MFC Bulletin'}
            </span>
            {article.date && (
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>
                {new Date(article.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          <h1 className="page-hero__title" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1.15, maxWidth: '900px' }}>
            {article.title}
          </h1>
        </div>
      </section>

      {/* Main Article Content */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Primary Featured Image */}
            {article.image && (
              <ScrollReveal>
                <div
                  onClick={() => setSelectedLightboxImage(article.image)}
                  style={{
                    width: '100%',
                    height: article.objectFit === 'contain' ? `${article.maxHeight || 440}px` : undefined,
                    maxHeight: `${article.maxHeight || 480}px`,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: 'var(--space-8)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    border: '1px solid var(--border)',
                    background: article.objectFit === 'contain'
                      ? 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)'
                      : 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  title="Click to view full photo"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: article.objectFit || 'cover',
                      transform: `scale(${article.scale || 1}) translateY(${article.offsetY || 0}px)`,
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      pointerEvents: 'none',
                    }}
                  >
                    🔍 Tap to Expand
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Long Structured Content / Paragraphs */}
            <ScrollReveal delay={0.1}>
              <div
                className="card"
                style={{
                  padding: 'clamp(1.25rem, 4vw, 2.5rem)',
                  borderRadius: '20px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  marginBottom: 'var(--space-8)',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                    lineHeight: 1.8,
                    color: 'var(--text)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {article.content || article.description}
                </div>
              </div>
            </ScrollReveal>

            {/* Structured Image Gallery (Multi-photo Support) */}
            {galleryImages.length > 1 && (
              <ScrollReveal delay={0.15}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <h3 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📸</span> Photo Gallery & Match Moments
                    </h3>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', background: 'var(--surface-2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                      {galleryImages.length} Photos • Tap any photo to expand
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: article.galleryColumns === '2'
                        ? 'repeat(auto-fit, minmax(340px, 1fr))'
                        : article.galleryColumns === '3'
                        ? 'repeat(auto-fit, minmax(260px, 1fr))'
                        : article.galleryColumns === '4'
                        ? 'repeat(auto-fit, minmax(200px, 1fr))'
                        : 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 'var(--space-4)',
                    }}
                  >
                    {galleryImages.map((imgUrl, imgIdx) => {
                      const fitMode = article.galleryFit || 'contain';
                      const cardHeight = fitMode === 'natural'
                        ? 'auto'
                        : `${article.galleryHeight || 340}px`;
                      const zoomScale = article.galleryScale || 1;

                      return (
                        <div
                          key={imgIdx}
                          onClick={() => setSelectedLightboxImage(imgUrl)}
                          style={{
                            height: cardHeight,
                            minHeight: fitMode === 'natural' ? '240px' : undefined,
                            maxHeight: fitMode === 'natural' ? `${article.galleryHeight || 480}px` : undefined,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid var(--border)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            background: fitMode === 'cover'
                              ? 'var(--surface-2)'
                              : 'radial-gradient(circle, rgba(210, 4, 45, 0.08) 0%, rgba(248, 250, 252, 0.98) 75%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            padding: fitMode === 'contain' ? '12px' : '0',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                          }}
                          title="Click to view full uncropped photo"
                        >
                          <img
                            src={imgUrl}
                            alt={`${article.title} gallery ${imgIdx + 1}`}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: fitMode === 'natural' ? 'auto' : '100%',
                              maxHeight: fitMode === 'natural' ? `${article.galleryHeight || 480}px` : undefined,
                              objectFit: fitMode === 'natural' ? 'contain' : fitMode,
                              transform: `scale(${zoomScale})`,
                              transition: 'transform 0.3s ease',
                              filter: fitMode !== 'cover' ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))' : 'none',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '10px',
                              right: '10px',
                              background: 'rgba(0,0,0,0.7)',
                              backdropFilter: 'blur(4px)',
                              color: '#fff',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-sm)',
                              pointerEvents: 'none',
                            }}
                          >
                            🔍 Tap to Expand
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            )}

            <SectionDivider />

            {/* Other News Carousel / Grid */}
            {otherUpdates.length > 0 && (
              <ScrollReveal delay={0.2}>
                <div style={{ marginTop: 'var(--space-8)' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-6)' }}>
                    More News & Updates from MFC
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: 'var(--space-5)',
                    }}
                  >
                    {otherUpdates.slice(0, 3).map((rel, relIdx) => {
                      const relId = rel.id || encodeURIComponent((rel.title || `rel-${relIdx}`).toLowerCase().replace(/\s+/g, '-'));
                      return (
                        <Link
                          key={rel.id || relIdx}
                          to={`/news/${relId}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <article
                            className="card"
                            style={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              overflow: 'hidden',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            {rel.image && (
                              <div style={{ height: '140px', width: '100%', overflow: 'hidden' }}>
                                <img
                                  src={rel.image}
                                  alt={rel.title}
                                  loading="lazy"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            )}
                            <div className="card__body" style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <span className="card__tag" style={{ fontSize: '0.65rem' }}>{rel.tag || 'Update'}</span>
                              <h4 style={{ fontSize: '1rem', margin: '4px 0 8px 0', lineHeight: 1.3 }}>
                                {rel.title}
                              </h4>
                              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'auto', lineHeight: 1.5 }}>
                                Read Full Article →
                              </p>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Fullscreen Interactive Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-6)',
            cursor: 'zoom-out',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLightboxImage(null)}
              style={{
                position: 'absolute',
                top: '-44px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.25)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
              title="Close full-size view"
            >
              ✕
            </button>
            <img
              src={selectedLightboxImage}
              alt="Full resolution preview"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

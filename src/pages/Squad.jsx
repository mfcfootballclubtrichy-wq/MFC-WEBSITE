/**
 * Squad.jsx — Academy Teams & Staff Roster
 *
 * Implements the Real Madrid squad visual style:
 * - Rounded player portrait cards with sleek gradients
 * - Large jersey numbers and clean typography
 * - Left / Right floating arrow buttons for horizontal scrolling through position lines
 * - Category tabs: All, Super Seniors, Seniors, Juniors, Coaches & Staff
 * - Server-side / youth consent filtering
 */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext.jsx';
import { DEFAULT_SQUAD } from '../data/content.js';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';

/**
 * SquadPositionRow: Renders a horizontal slider with next/prev arrows for a position line.
 */
function SquadPositionRow({ title, members }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [members]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 320;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!members || members.length === 0) return null;

  return (
    <div style={{ marginBottom: 'var(--space-8)', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>
          {title}
        </h3>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--muted)', fontWeight: 600 }}>
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </span>
      </div>

      {/* ── Carousel Container with Floating Next/Prev Arrows ── */}
      <div style={{ position: 'relative' }}>
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            style={{
              position: 'absolute',
              left: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#FFFFFF',
              color: '#0A0A0A',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.25rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
          >
            ‹
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            style={{
              position: 'absolute',
              right: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#FFFFFF',
              color: '#0A0A0A',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.25rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
          >
            ›
          </button>
        )}

        {/* Horizontal Card Track */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 'var(--space-5)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: '8px 4px 20px 4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {members.map((member, idx) => (
            <motion.article
              key={member.id || idx}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                flex: '0 0 260px',
                width: '260px',
                height: '370px',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                scrollSnapAlign: 'start',
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 35%, #1E1B4B 80%, #0F172A 100%)',
              }}
            >
              {/* Photo Display */}
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: member.objectFit || 'cover',
                    objectPosition: 'top center',
                    transform: `scale(${member.scale || 1}) translateY(${member.offsetY || 0}px)`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.25s ease',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '4rem',
                  }}
                >
                  ⚽
                </div>
              )}

              {/* Real Madrid Style Bottom Gradient Overlay & Typography */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 30%, transparent 65%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 'var(--space-4) var(--space-5)',
                  gap: 'var(--space-3)',
                }}
              >
                {/* Large Jersey Number */}
                {member.number && (
                  <span
                    style={{
                      fontSize: '3.6rem',
                      fontWeight: 800,
                      lineHeight: 0.85,
                      color: '#FFFFFF',
                      letterSpacing: '-0.04em',
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      fontFamily: 'inherit',
                    }}
                  >
                    {member.number}
                  </span>
                )}

                {/* Name & Position */}
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <h4
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: 1.15,
                      textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.name}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: '#CBD5E1',
                      fontWeight: 500,
                      marginTop: '3px',
                      textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.position}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Squad() {
  const { content } = useContent();
  const [selectedTier, setSelectedTier] = useState('all');

  const rawSquad = content?.squad || DEFAULT_SQUAD;
  // Respect data privacy: only show players with consent verified
  const squadList = rawSquad.filter((m) => m.hasConsent ?? true);

  // Filter by tier (or all)
  const filteredSquad = squadList.filter((item) => {
    if (selectedTier === 'all') return true;
    return item.tier === selectedTier;
  });

  // Group by standard football position lines & technical staff
  const goalkeepers = filteredSquad.filter(
    (m) => (m.position || '').toLowerCase().includes('goalkeeper') || (m.position || '').toLowerCase().includes('portero')
  );
  const defenders = filteredSquad.filter((m) =>
    (m.position || '').toLowerCase().includes('defender') || (m.position || '').toLowerCase().includes('defense')
  );
  const midfielders = filteredSquad.filter((m) =>
    (m.position || '').toLowerCase().includes('midfielder') || (m.position || '').toLowerCase().includes('midfield')
  );
  const forwards = filteredSquad.filter(
    (m) =>
      (m.position || '').toLowerCase().includes('forward') ||
      (m.position || '').toLowerCase().includes('striker') ||
      (m.position || '').toLowerCase().includes('winger')
  );
  const staff = filteredSquad.filter(
    (m) =>
      m.tier === 'staff' ||
      (m.position || '').toLowerCase().includes('coach') ||
      (m.position || '').toLowerCase().includes('physio') ||
      (m.position || '').toLowerCase().includes('doctor') ||
      (m.position || '').toLowerCase().includes('analyst') ||
      (m.position || '').toLowerCase().includes('trainer')
  );

  // Non-staff position groupings
  const nonStaffPositions = [
    { title: 'Goalkeepers', members: goalkeepers },
    { title: 'Defenders', members: defenders },
    { title: 'Midfielders', members: midfielders },
    { title: 'Forwards', members: forwards },
  ];

  return (
    <>
      <section className="section section--white" style={{ paddingTop: 'calc(var(--header-height) + var(--space-8))' }}>
        <div className="container">
          {/* ── Page Header ── */}
          <ScrollReveal>
            <div className="section__header" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="section__eyebrow">MFC Academy Roster</span>
              <h1 className="section__title" style={{ fontSize: '2.75rem', marginBottom: 'var(--space-2)' }}>
                Squad
              </h1>
              <p className="section__subtitle" style={{ maxWidth: '640px', margin: '0 auto' }}>
                Discover our young talent and technical leaders. Organized by position and competitive age tiers.
              </p>
            </div>
          </ScrollReveal>

          {/* ── Tier Filter Tabs ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-10)',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedTier('all')}
              className={`btn ${selectedTier === 'all' ? 'btn-primary' : 'btn--outline'}`}
              style={{ fontSize: 'var(--fs-sm)', padding: '0.45rem 1.25rem', borderRadius: 'var(--radius-full)' }}
            >
              All Squad ({squadList.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier('super_seniors')}
              className={`btn ${selectedTier === 'super_seniors' ? 'btn-primary' : 'btn--outline'}`}
              style={{ fontSize: 'var(--fs-sm)', padding: '0.45rem 1.25rem', borderRadius: 'var(--radius-full)' }}
            >
              Super Seniors (2009–2011)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier('seniors')}
              className={`btn ${selectedTier === 'seniors' ? 'btn-primary' : 'btn--outline'}`}
              style={{ fontSize: 'var(--fs-sm)', padding: '0.45rem 1.25rem', borderRadius: 'var(--radius-full)' }}
            >
              Seniors (2012–2014)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier('juniors')}
              className={`btn ${selectedTier === 'juniors' ? 'btn-primary' : 'btn--outline'}`}
              style={{ fontSize: 'var(--fs-sm)', padding: '0.45rem 1.25rem', borderRadius: 'var(--radius-full)' }}
            >
              Juniors (2015–2017)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier('staff')}
              className={`btn ${selectedTier === 'staff' ? 'btn-primary' : 'btn--outline'}`}
              style={{ fontSize: 'var(--fs-sm)', padding: '0.45rem 1.25rem', borderRadius: 'var(--radius-full)' }}
            >
              Coaches & Medical Staff
            </button>
          </div>

          {/* ── Position Carousel Rows ── */}
          {selectedTier !== 'staff' && (
            <>
              {nonStaffPositions.map(
                (pos) =>
                  pos.members.length > 0 && (
                    <SquadPositionRow key={pos.title} title={pos.title} members={pos.members} />
                  )
              )}
            </>
          )}

          {/* Staff Section */}
          {(selectedTier === 'all' || selectedTier === 'staff') && staff.length > 0 && (
            <SquadPositionRow title="Coaching & Medical Staff" members={staff} />
          )}

          {filteredSquad.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--muted)' }}>
              <h3>No squad members found in this category.</h3>
            </div>
          )}

          <SectionDivider />

          {/* Privacy Note */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: 'var(--space-5) var(--space-6)',
              marginTop: 'var(--space-8)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>🛡️</span>
            <div>
              <h5 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--fs-sm)' }}>
                Youth Player Privacy & Guardian Verification
              </h5>
              <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--muted)', lineHeight: 1.5 }}>
                Player profiles and photos are showcased under written parental/guardian consent in full compliance with academy youth sports guidelines. To request an update or image removal, please contact club administration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

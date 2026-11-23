import { useRef, useEffect, useState } from 'react';

/**
 * SectionDivider.jsx — Animated thin cherry red line that grows from left to right as scrolled into view.
 * Uses transform: scaleX for optimal performance.
 * Respects prefers-reduced-motion.
 */
export default function SectionDivider({ className = '', style = {} }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`section-divider ${isVisible ? 'is-visible' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

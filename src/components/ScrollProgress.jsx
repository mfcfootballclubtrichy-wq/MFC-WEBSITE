import { useState, useEffect } from 'react';

/**
 * ScrollProgress.jsx — Displays a thin reading progress bar at the very top of the window.
 * Uses --accent (#D2042D) with transform scaleX (GPU accelerated).
 * Turns off transitions / animations under prefers-reduced-motion.
 */
export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(scrollProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        transform: `scaleX(${scrollProgress})`,
      }}
    />
  );
}

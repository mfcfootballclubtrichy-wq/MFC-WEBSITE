/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DEFAULT_HERO_ACTION_SLIDES = [
  {
    id: 'slide-1',
    image: '/coaches/mfc-player-action.png',
    title: 'MFC Player Match Action',
    maxHeight: 530,
    scale: 1.05,
    offsetY: 0,
  },
  {
    id: 'slide-2',
    image: '/coaches/sample-coach.png',
    title: 'Coach & Player Tactical Pose',
    maxHeight: 500,
    scale: 1,
    offsetY: 0,
  },
  {
    id: 'slide-3',
    image: '/about-mfc-freestyle.png',
    title: 'Freestyle Skill & Dribble',
    maxHeight: 500,
    scale: 1,
    offsetY: 0,
  },
];

export default function HeroPlayerSlider({ slides = DEFAULT_HERO_ACTION_SLIDES, autoPlayInterval = 3800 }) {
  const activeSlides = (Array.isArray(slides) && slides.length > 0) ? slides : DEFAULT_HERO_ACTION_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, autoPlayInterval, activeSlides.length]);

  const current = activeSlides[currentIndex] || activeSlides[0];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.92,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const imgMaxHeight = current?.maxHeight || 520;
  const imgScale = current?.scale || 1;
  const imgOffsetY = current?.offsetY || 0;
  const stageHeight = Math.max(imgMaxHeight + 10, 520);

  return (
    <div
      className="hero-action-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Hero Action Showcase"
    >
      {/* Dynamic Lighting Glow behind the action cutout */}
      <div className="hero-action-showcase__glow" aria-hidden="true" />

      {/* Subtle Background Watermark */}
      <div className="hero-action-showcase__watermark" aria-hidden="true">
        MFC
      </div>

      {/* Dynamic Sizing Stage */}
      <div
        className="hero-action-showcase__stage"
        style={{
          '--desktop-stage-height': `${stageHeight}px`,
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current?.id || current?.image || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="hero-action-showcase__slide"
          >
            <img
              src={current?.image || '/coaches/mfc-player-action.png'}
              alt={current?.title || 'MFC Football Action'}
              className="hero-action-showcase__img"
              style={{
                '--desktop-img-height': `${imgMaxHeight}px`,
                transform: `scale(${imgScale}) translateY(${imgOffsetY}px)`,
                objectFit: current?.objectFit || 'contain',
              }}
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Minimal clean slide indicators if more than 1 image */}
      {activeSlides.length > 1 && (
        <div className="hero-action-showcase__controls">
          <div className="hero-action-showcase__dots">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`hero-action-showcase__dot${idx === currentIndex ? ' active' : ''}`}
                aria-label={`Slide ${idx + 1}`}
                aria-current={idx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

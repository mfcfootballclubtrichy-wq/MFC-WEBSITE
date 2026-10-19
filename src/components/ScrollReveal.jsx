/**
 * ScrollReveal.jsx — Wraps children in a fade-up reveal triggered once on scroll.
 *
 * Behaviour:
 * - opacity: 0 → 1, translateY: 40px → 0, 0.6 s ease-out
 * - Triggered once via Framer Motion's whileInView
 * - Respects prefers-reduced-motion: only opacity animates when set
 *
 * Usage:
 *   <ScrollReveal>
 *     <YourContent />
 *   </ScrollReveal>
 *
 *   <ScrollReveal delay={0.2} y={60}>
 *     <YourContent />
 *   </ScrollReveal>
 */
import { motion, useReducedMotion } from 'framer-motion';

const DEFAULT_Y_OFFSET = 40;
const DEFAULT_DURATION = 0.6;

export default function ScrollReveal({
  children,
  delay = 0,
  y = DEFAULT_Y_OFFSET,
  duration = DEFAULT_DURATION,
  className = '',
  style = {},
}) {
  const prefersReduced = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      // Skip translateY when reduced motion is preferred.
      y: prefersReduced ? 0 : y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

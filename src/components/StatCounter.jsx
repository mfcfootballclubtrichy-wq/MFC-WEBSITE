/**
 * StatCounter.jsx — Animated counter that counts up once when visible.
 *
 * Behaviour:
 * - Counts from 0 to `value` over ~1.5 s using requestAnimationFrame
 * - Starts only once when the element enters the viewport
 * - Respects prefers-reduced-motion: shows final value immediately if set
 *
 * Props:
 *   value    {number}  Target number
 *   suffix   {string}  Text appended to the number (e.g. '+', '%')
 *   label    {string}  Accessible label for the stat
 *   duration {number}  Animation duration in ms (default 1500)
 */
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const COUNTER_DURATION_MS = 1500;

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export default function StatCounter({
  value,
  suffix = '',
  label,
  duration = COUNTER_DURATION_MS,
}) {
  const ref              = useRef(null);
  const isInView         = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced   = useReducedMotion();
  const [count, setCount] = useState(0);
  const startedRef       = useRef(false);

  useEffect(() => {
    // Skip animation if reduced motion or not in view yet, or already ran.
    if (!isInView || startedRef.current) return;
    startedRef.current = true;

    if (prefersReduced) {
      setCount(value);
      return;
    }

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);

      setCount(Math.round(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, value, duration, prefersReduced]);

  return (
    <div className="stat-item" ref={ref}>
      <p className="stat-item__number" aria-live="polite" aria-label={`${count}${suffix} ${label}`}>
        {count}
        <span className="stat-item__suffix" aria-hidden="true">{suffix}</span>
      </p>
      <p className="stat-item__label" aria-hidden="true">{label}</p>
      <div
        className={`stat-item__bar ${startedRef.current || prefersReduced ? 'is-filled' : ''}`}
        aria-hidden="true"
      />
    </div>
  );
}

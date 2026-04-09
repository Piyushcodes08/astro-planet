import { useState, useRef, useEffect, useCallback } from 'react';
import { PLANETS } from '../Data';

export function usePlanetNavigation(disabled = false) {
  const [idx, setIdx] = useState(0); // Pluto default
  const idxRef = useRef(0);
  const targetRef = useRef(0);
  const timerRef = useRef(null);

  const go = useCallback((next) => {
    if (disabled) return;

    const n = Math.max(0, Math.min(PLANETS.length - 1, next));
    if (n === targetRef.current && n === idxRef.current) return;

    targetRef.current = n;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const step = () => {
      if (idxRef.current === targetRef.current) return;

      const dir = targetRef.current > idxRef.current ? 1 : -1;
      idxRef.current = idxRef.current + dir;
      setIdx(idxRef.current);

      if (idxRef.current !== targetRef.current) {
        timerRef.current = setTimeout(step, 300);
      }
    };

    step();
  }, [disabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* wheel */
  useEffect(() => {
    if (disabled) return;

    let last = 0;

    const fn = (e) => {
      const now = Date.now();
      if (now - last < 500) return;
      last = now;

      go(idxRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    window.addEventListener('wheel', fn, { passive: true });
    return () => window.removeEventListener('wheel', fn);
  }, [go, disabled]);

  /* keyboard */
  useEffect(() => {
    if (disabled) return;

    const fn = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        go(idxRef.current + 1);
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        go(idxRef.current - 1);
      }
    };

    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [go, disabled]);

  /* mobile touch swipe */
  useEffect(() => {
    if (disabled) return;

    let startY = 0;
    let lastScroll = 0;
    let isSwiping = false;

    const handleStart = (e) => {
      if (!e.touches || !e.touches.length) return;
      startY = e.touches[0].clientY;
      isSwiping = true;
    };

    const handleMove = (e) => {
      if (!isSwiping || !e.touches || !e.touches.length) return;
      
      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;
      const now = Date.now();

      // Trigger immediately when threshold is reached, giving a responsive feel
      if (Math.abs(diff) > 40) {
        if (now - lastScroll > 800) { // Prevent consecutive triggers too fast
          go(idxRef.current + (diff > 0 ? 1 : -1));
          lastScroll = now;
        }
        isSwiping = false; // Wait for user to lift finger and touch again
      }
    };

    const handleEnd = () => {
      isSwiping = false;
    };

    // Need non-passive to fully intercept on older devices sometimes, but passive is better for performance.
    // We kept passive since we use `touch-action: none` in CSS anyway.
    window.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [go, disabled]);

  return { idx, go };
}
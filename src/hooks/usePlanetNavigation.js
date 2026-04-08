import { useState, useRef, useEffect, useCallback } from 'react';
import { PLANETS } from '../Data';

export function usePlanetNavigation(disabled = false) {
  const [idx, setIdx] = useState(5); // Default to Mars for the screenshot match
  const idxRef = useRef(idx);
  const targetRef = useRef(idx);
  const timerRef = useRef();

  const go = useCallback((next) => {
    if (disabled) return;
    const n = Math.max(0, Math.min(PLANETS.length - 1, next));
    if (n === idxRef.current) return;
    
    targetRef.current = n;
    if (timerRef.current) clearTimeout(timerRef.current);

    const step = () => {
      const dir = targetRef.current > idxRef.current ? 1 : -1;
      idxRef.current = idxRef.current + dir;
      setIdx(idxRef.current);
      
      if (idxRef.current !== targetRef.current) {
        timerRef.current = setTimeout(step, 1000);
      }
    };
    
    step();
  }, [disabled]);

  /* wheel scroll */
  useEffect(() => {
    if (disabled) return;
    let last = 0;
    const fn = (e) => {
      const now = Date.now();
      if (now - last < 1200) return;
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
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(idxRef.current + 1);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  go(idxRef.current - 1);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [go, disabled]);

  /* mobile touch swipe — throttle MUST be >= CSS transition duration */
  useEffect(() => {
    if (disabled) return;
    let startY = 0;
    let startTime = 0;
    let lastScroll = 0;
    let isDragging = false;

    const handleStart = (e) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isDragging = true;
    };

    const handleMove = (e) => {
      // Removed e.preventDefault() to allow passive listeners.
      // We use touch-action: none in CSS instead to prevent scroll.
    };

    const handleEnd = (e) => {
      isDragging = false;
      const now = Date.now();
      // 950ms throttle — slightly above 0.9s CSS transition to prevent mid-animation glitch
      if (now - lastScroll < 950) return;

      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;
      const elapsed = now - startTime;
      const velocity = Math.abs(diff) / elapsed; // px/ms

      // Trigger if: long swipe (>35px) OR fast flick (velocity > 0.25 px/ms)
      if (Math.abs(diff) > 35 || velocity > 0.25) {
        lastScroll = now;
        go(idxRef.current + (diff > 0 ? 1 : -1));
      }
    };

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

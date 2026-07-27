import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* Scrolls to the hash target once the page has rendered. Covers both a fresh
   load of /#work and a client-side Link that only changes the hash — the
   browser's own hash jump fires before React has rendered the sections.
   The position is computed rather than left to scrollIntoView + scroll-margin,
   which lands inconsistently here, and re-applied once to absorb late layout
   shifts from fonts and images. */
export function useHashScroll(offset = 96) {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));

    const go = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const target = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    };

    let raf2;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(go); });
    const correction = setTimeout(go, 400);

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(correction);
    };
  }, [hash, offset]);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/* Fires once when the element scrolls into view (top above `visibleAt` of the
   viewport — mirrors the design's inView(el, f) check). Reduced motion skips
   straight to visible. */
export function useInViewOnce(visibleAt = 0.94) {
  const ref = useRef(null);
  const [inView, setInView] = useState(prefersReducedMotion);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: `0px 0px -${Math.round((1 - visibleAt) * 100)}% 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visibleAt, inView]);
  return [ref, inView];
}

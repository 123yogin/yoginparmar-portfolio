import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInViewOnce, usePrefersReducedMotion } from './hooks';

/* Block that fades/slides in on first view. */
export function Reveal({ visibleAt = 0.94, className = '', children, as = 'div', ...rest }) {
  const Tag = as;
  const [ref, inView] = useInViewOnce(visibleAt);
  return (
    <Tag ref={ref} data-reveal="" className={`${className}${inView ? ' is-in' : ''}`} {...rest}>
      {children}
    </Tag>
  );
}

/* Counts 0 → target over 1s (cubic ease-out) once scrolled into view. */
export function CountUp({ target }) {
  const [ref, inView] = useInViewOnce(0.85);
  const decimals = target % 1 !== 0 ? 2 : 0;
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return undefined;
    const dur = 1000;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      setValue(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return <span ref={ref} className="num">{value.toFixed(decimals)}</span>;
}

/* Anchor whose arrow drifts toward the cursor; the solid variant also warms
   its background from #dd2b0f to #ec3013 while hovered. */
export function MagnetLink({ variant = 'solid', className = '', arrow, children, ...rest }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  const onMouseMove = (ev) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const arrowEl = el.querySelector('[data-magnet-arrow]');
    const r = el.getBoundingClientRect();
    if (variant === 'solid') el.style.background = '#ec3013';
    if (arrowEl) {
      const dx = ((ev.clientX - (r.left + r.width / 2)) / r.width) * 12;
      const dy = variant === 'solid' ? ((ev.clientY - (r.top + r.height / 2)) / r.height) * 8 : 0;
      arrowEl.style.transform = `translate(${dx}px,${dy}px)`;
    }
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (variant === 'solid') el.style.background = '';
    const arrowEl = el.querySelector('[data-magnet-arrow]');
    if (arrowEl) arrowEl.style.transform = 'none';
  };

  return (
    <a ref={ref} className={className} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} {...rest}>
      {children}
      {arrow ? <span data-magnet-arrow="">{arrow}</span> : null}
    </a>
  );
}

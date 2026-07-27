import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import resumeFile from '../../assets/YOGIN-PARMAR-Java Resume-20251125.pdf';
import { MagnetLink } from './lib';

const SECTIONS = [
  ['work', 'Work'],
  ['cluster', 'Cluster'],
  ['stack', 'Stack'],
  ['journey', 'Journey'],
  ['writing', 'Writing'],
];

/* On the home route a section link is a same-page anchor (native smooth
   scroll). Anywhere else it must be a client-side Link — a plain href="/#id"
   triggers a full reload and the browser's hash jump fires before React has
   rendered the sections, so the scroll silently fails. */
function SectionLink({ id, label, onHome, className, onClick }) {
  if (onHome) {
    return (
      <a href={`#${id}`} className={className} onClick={onClick}>
        {label}
      </a>
    );
  }
  return (
    <Link to={{ pathname: '/', hash: `#${id}` }} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

export function NavBar() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef(null);
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const onWriting = pathname.startsWith('/blog');

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
        setCompact(y > 60);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close the menu when the route changes — adjusted during render rather than
     in an effect, so it never causes a second pass */
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 719) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const linkClass = (active) => `pv2-nav-link${active ? ' is-current' : ''}`;

  return (
    <nav className={`pv2-nav${compact ? ' is-compact' : ''}`} aria-label="Primary">
      <div className="pv2-nav-inner pv2-side">
        {onHome ? (
          <a href="#top" className="pv2-nav-brand">YOGIN PARMAR</a>
        ) : (
          <Link to="/" className="pv2-nav-brand">YOGIN PARMAR</Link>
        )}

        <div className="pv2-nav-links">
          {SECTIONS.map(([id, label]) => (
            <SectionLink
              key={id}
              id={id}
              label={label}
              onHome={onHome}
              className={linkClass(onWriting && id === 'writing')}
            />
          ))}
          <MagnetLink
            className="pv2-nav-cta"
            href={resumeFile}
            download="Yogin-Parmar-Resume.pdf"
            arrow="↓"
          >
            Résumé
          </MagnetLink>
          <button
            type="button"
            className="pv2-nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="pv2-mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div className="pv2-nav-rail">
        <div ref={progressRef} className="pv2-nav-progress" />
      </div>

      {menuOpen ? (
        <div className="pv2-mobile-menu" id="pv2-mobile-menu">
          <div className="pv2-side">
            {SECTIONS.map(([id, label]) => (
              <SectionLink
                key={id}
                id={id}
                label={label}
                onHome={onHome}
                className={`pv2-mobile-link${onWriting && id === 'writing' ? ' is-current' : ''}`}
                onClick={() => setMenuOpen(false)}
              />
            ))}
            <a
              className="pv2-mobile-resume"
              href={resumeFile}
              download="Yogin-Parmar-Resume.pdf"
              onClick={() => setMenuOpen(false)}
            >
              Résumé <span>↓</span>
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="pv2-side pv2-footer">
      <div className="pv2-footer-row">
        <span>© 2026 Yogin Parmar</span>
        <span>Ahmedabad, Gujarat, India</span>
        <span>Set in Archivo · built with React + Vite</span>
      </div>
    </footer>
  );
}

/* Page shell: applies the v2 theme class and the light body background. */
export function Pv2Page({ children }) {
  useEffect(() => {
    document.body.classList.add('pv2-body');
    return () => document.body.classList.remove('pv2-body');
  }, []);
  return <div className="pv2">{children}</div>;
}

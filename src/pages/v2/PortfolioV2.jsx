import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import resumeFile from '../../assets/YOGIN-PARMAR-Java Resume-20251125.pdf';
import figureImg from '../../assets/yp-figure.webp';
import { Footer, NavBar, Pv2Page } from './Chrome';
import { AVAILABILITY, JOURNEY, PROOF, SHIP, WRITING } from './data';
import { useHashScroll, useInViewOnce, usePrefersReducedMotion } from './hooks';
import { CountUp, MagnetLink, Reveal } from './lib';
import Cluster from './sections/Cluster';
import Stack from './sections/Stack';
import Work from './sections/Work';
import './portfolio-v2.css';

function Hero() {
  const photoRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const img = photoRef.current;
        if (img) img.style.transform = `translateY(${14 + Math.min(window.scrollY, 900) * 0.1}px) scale(1.08)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  return (
    <header id="top" className="pv2-hero">
      <div className="pv2-hero-photo">
        <img ref={photoRef} src={figureImg} alt="Yogin Parmar" />
      </div>
      <div className="pv2-side pv2-hero-inner">
        <div className="pv2-hero-copy">
          <Reveal className="pv2-hero-avail">
            <span className="pv2-hero-dot" />
            <span>{AVAILABILITY}</span>
          </Reveal>
          <h1>
            <Reveal as="span">I build the back end</Reveal>
            <Reveal as="span">
              and keep it <span className="pv2-accent">running.</span>
            </Reveal>
          </h1>
          <Reveal as="p" className="pv2-hero-lede">
            Associate Software Engineer at UpVision Software Services, Ahmedabad. I build REST
            APIs and microservices in Java and Spring Boot — then automate how they get tested,
            containerised and deployed with CI/CD, Docker and AWS/OCI. Computer Engineering at
            LDRP, class of 2026.
          </Reveal>
          <Reveal className="pv2-hero-ctas">
            <MagnetLink
              className="pv2-btn-primary"
              href={resumeFile}
              download="Yogin-Parmar-Resume.pdf"
              arrow="↓"
            >
              Download résumé
            </MagnetLink>
            <a className="pv2-btn-outline" href="#cluster">
              Run a deploy <span>→</span>
            </a>
          </Reveal>
          <Reveal className="pv2-hero-meta">
            <span className="is-ink">Ahmedabad, IN</span>
            <span>GMT+5:30</span>
            <span>Java · Spring Boot · CI/CD · Docker</span>
            <span className="is-accent">Class of 2026</span>
          </Reveal>
        </div>
      </div>
    </header>
  );
}

function Proof() {
  return (
    <section className="pv2-side pv2-proof" aria-label="Proof">
      <div className="pv2-proof-grid">
        {PROOF.map((p) => (
          <div key={p.label} className="pv2-proof-cell">
            <div className="pv2-proof-value">
              <CountUp target={p.value} />
              <span className="suffix">{p.suffix}</span>
            </div>
            <div className="pv2-proof-label">{p.label}</div>
            <div className="pv2-proof-note">{p.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ship() {
  return (
    <section id="ship" className="pv2-side pv2-section" aria-label="How I ship">
      <Reveal className="pv2-ship-intro">
        <h2 className="pv2-h2">How I ship</h2>
        <p>
          The part most junior portfolios leave out. This is what happens after the code
          compiles.
        </p>
      </Reveal>
      <div className="pv2-ship-grid">
        {SHIP.map((s) => (
          <Reveal key={s.num} className="pv2-ship-cell" visibleAt={0.9}>
            <span className="pv2-ship-num">{s.num}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <span className="pv2-ship-tools">{s.tools}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  const timelineRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const tl = timelineRef.current;
        const fill = fillRef.current;
        if (!tl || !fill) return;
        const r = tl.getBoundingClientRect();
        fill.style.height = `${Math.max(0, Math.min(1, (window.innerHeight * 0.6 - r.top) / r.height)) * 100}%`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="journey" className="pv2-side pv2-section pv2-journey" aria-label="Journey">
      <Reveal as="h2" className="pv2-h2">Journey</Reveal>
      <div ref={timelineRef} className="pv2-timeline">
        <div className="pv2-timeline-rail" />
        <div ref={fillRef} className="pv2-timeline-fill" />
        {JOURNEY.map((j) => (
          <Reveal key={j.title} className="pv2-journey-entry">
            <span className="pv2-journey-dot" style={{ background: j.dot }} />
            <div className="pv2-journey-grid">
              <div>
                <div className="pv2-journey-titlerow">
                  <h3>{j.title}</h3>
                  <span className="pv2-journey-badge" style={{ color: j.badgeColor }}>
                    {j.badge}
                  </span>
                </div>
                <div className="pv2-journey-org">
                  {j.org} — {j.place}
                </div>
                <p className="pv2-journey-body">{j.body}</p>
                <ul className="pv2-journey-points">
                  {j.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="pv2-journey-dates">{j.dates}</div>
                <div className="pv2-tags" style={{ marginTop: 0 }}>
                  {j.tags.map((t) => (
                    <span key={t} className="pv2-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className="pv2-side pv2-section pv2-writing" aria-label="Writing">
      <Reveal className="pv2-writing-head">
        <h2 className="pv2-h2">Writing</h2>
        <span className="pv2-eyebrow">
          Working notes on architecture · <Link to="/blog">all posts</Link>
        </span>
      </Reveal>
      <div className="pv2-writing-list">
        {WRITING.map((a) => (
          <Link key={a.slug} to={`/blog/${a.slug}`} className="pv2-write-row">
            <span className="pv2-write-num">{a.num}</span>
            <span className="pv2-write-title">{a.title}</span>
            <span className="pv2-write-meta">{a.meta}</span>
            <span className="pv2-write-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Hire() {
  const [sectionRef, inView] = useInViewOnce(0.95);

  return (
    <section id="hire" ref={sectionRef} className="pv2-hire" aria-label="Hire">
      <div className={`pv2-hire-block${inView ? ' is-in' : ''}`}>
        <div className="pv2-side pv2-hire-inner">
          <div className="pv2-hire-grid">
            <div>
              <div className="pv2-hire-avail">{AVAILABILITY}</div>
              <h2>Hiring for backend or DevOps?</h2>
              <p className="pv2-hire-lede">
                Tell me what the role owns and I'll tell you honestly whether I can do it. Reply
                usually same day.
              </p>
            </div>
            <div className="pv2-hire-links">
              <MagnetLink
                variant="light"
                className="pv2-hire-email"
                href="mailto:parmaryogin04@gmail.com"
                arrow="→"
              >
                parmaryogin04@gmail.com
              </MagnetLink>
              <a className="pv2-hire-link" href={resumeFile} download="Yogin-Parmar-Resume.pdf">
                Download résumé (PDF) <span className="pv2-arrow">↓</span>
              </a>
              <a
                className="pv2-hire-link"
                href="https://linkedin.com/in/yogin-parmar-15b7aa1a8"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <span className="pv2-arrow">↗</span>
              </a>
              <a
                className="pv2-hire-link"
                href="https://github.com/123yogin"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub — @123yogin <span className="pv2-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PortfolioV2() {
  useHashScroll();

  return (
    <Pv2Page>
      <Helmet>
        <title>Yogin Parmar — Backend Engineer with DevOps focus</title>
        <meta
          name="description"
          content="Backend engineer with DevOps focus — Java, Spring Boot, REST APIs, microservices, CI/CD, Docker, AWS/OCI. Associate Software Engineer at UpVision Software Services, Ahmedabad. I build backend systems that stay up, ship fast, and don't wake anyone up at 3 a.m."
        />
        <link rel="canonical" href="https://yoginparmar.dev" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              name: 'Yogin Parmar',
              jobTitle: 'Associate Software Engineer',
              worksFor: {
                '@type': 'Organization',
                name: 'UpVision Software Services Private Limited',
              },
              url: 'https://yoginparmar.dev',
              sameAs: [
                'https://github.com/123yogin',
                'https://linkedin.com/in/yogin-parmar-15b7aa1a8',
              ],
              email: 'parmaryogin04@gmail.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ahmedabad',
                addressRegion: 'Gujarat',
                addressCountry: 'IN',
              },
            },
          })}
        </script>
      </Helmet>
      <NavBar />
      <main>
        <Hero />
        <Proof />
        <Cluster />
        <Work />
        <Stack />
        <Ship />
        <Journey />
        <Writing />
        <Hire />
      </main>
      <Footer />
    </Pv2Page>
  );
}

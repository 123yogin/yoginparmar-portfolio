import { useEffect, useRef, useState } from 'react';
import { WORK } from '../data';
import { Reveal } from '../lib';

export default function Work() {
  const [openId, setOpenId] = useState(null);
  const panelRefs = useRef({});

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  /* animate panels the way the design does: max-height 0 ↔ content height */
  useEffect(() => {
    Object.entries(panelRefs.current).forEach(([id, el]) => {
      if (!el) return;
      el.style.maxHeight = id === openId ? `${el.scrollHeight + 40}px` : '0px';
    });
  }, [openId]);

  return (
    <section id="work" className="pv2-side pv2-section" aria-label="Selected work">
      <Reveal className="pv2-work-head">
        <h2 className="pv2-h2">Selected work</h2>
        <span className="pv2-eyebrow">
          Three of forty-three · <a href="#index">see the index</a>
        </span>
      </Reveal>

      <div className="pv2-work-list">
        {WORK.map((w) => {
          const open = openId === w.id;
          return (
            <div key={w.id} className="pv2-work-row">
              <button
                type="button"
                className="pv2-work-toggle"
                aria-expanded={open}
                onClick={() => toggle(w.id)}
              >
                <span className="pv2-work-num">{w.num}</span>
                <span>
                  <span className="pv2-work-title">{w.title}</span>
                  <span className="pv2-work-blurb">{w.blurb}</span>
                  <span className="pv2-tags">
                    {w.tech.map((t) => (
                      <span key={t} className="pv2-tag">{t}</span>
                    ))}
                  </span>
                </span>
                <span className="pv2-work-metrics">
                  {w.metrics.map((m) => (
                    <span key={m.k} className="pv2-work-metric">
                      <span className="v">{m.v}</span>
                      <span className="k">{m.k}</span>
                    </span>
                  ))}
                </span>
                <span className="pv2-work-thumb" aria-hidden="true">
                  <span className="pv2-thumb-ph">
                    <span className="num">{w.num}</span>
                    <span className="name">{w.title}</span>
                  </span>
                </span>
              </button>
              <div
                ref={(el) => { panelRefs.current[w.id] = el; }}
                className="pv2-work-panel"
              >
                <div className="pv2-work-panel-grid">
                  <div className="pv2-work-cell">
                    <h3>The problem</h3>
                    <p>{w.problem}</p>
                  </div>
                  <div className="pv2-work-cell">
                    <h3>Architecture</h3>
                    <p>{w.architecture}</p>
                  </div>
                  <div className="pv2-work-cell">
                    <h3>Trade-off I made</h3>
                    <p>{w.tradeoff}</p>
                    <a
                      className="pv2-work-repo"
                      href={w.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Repository →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div id="index" className="pv2-work-index">
        <span>
          Forty more repositories — Flask APIs, ML classifiers, React storefronts, a quiz
          backend, coursework.
        </span>
        <a
          className="pv2-btn-index"
          href="https://github.com/123yogin"
          target="_blank"
          rel="noopener noreferrer"
        >
          Browse the index <span>→</span>
        </a>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { ROLES } from '../data';
import { Reveal } from '../lib';

export default function Stack() {
  const [active, setActive] = useState('backend');
  const role = ROLES.find((r) => r.id === active) ?? ROLES[0];

  return (
    <section id="stack" className="pv2-side pv2-section" aria-label="Stack">
      <Reveal className="pv2-stack-intro">
        <h2 className="pv2-h2">The stack, by what it's for</h2>
        <p>No percentage bars. Each tool is listed against the thing I actually shipped with it.</p>
      </Reveal>

      <div className="pv2-stack-grid">
        <div className="pv2-stack-tabs" role="tablist" aria-label="Skill areas">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={r.id === active}
              className={`pv2-role-tab${r.id === active ? ' is-active' : ''}`}
              onClick={() => setActive(r.id)}
            >
              <span className="pv2-role-num">{r.num}</span>
              <span>
                <span className="pv2-role-name">{r.name}</span>
                <span className="pv2-role-note">{r.note}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="pv2-stack-panel" role="tabpanel">
          <div key={role.id} className="pv2-stack-skills">
            {role.skills.map((s) => (
              <div key={s.name} className="pv2-skill-row">
                <span className="pv2-skill-name">{s.name}</span>
                <span className="pv2-skill-evidence">{s.evidence}</span>
                <span className="pv2-skill-depth">{s.depth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

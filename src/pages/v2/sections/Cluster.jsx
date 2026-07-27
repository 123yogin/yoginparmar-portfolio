import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ClusterEngine, POD_STYLE } from '../cluster/engine';
import { Iso3d } from '../cluster/Iso3d';
import { CLUSTER_LEGEND, CLUSTER_NODES } from '../data';
import { Reveal } from '../lib';

export default function Cluster() {
  const [engine] = useState(() => new ClusterEngine());
  const [view, setView] = useState('3d');
  const [no3d, setNo3d] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const logRef = useRef(null);
  const isoRef = useRef(null);
  const autoRanRef = useRef(false);

  useEffect(() => {
    engine.start();
    return () => engine.dispose();
  }, [engine]);

  const snap = useSyncExternalStore(
    useCallback((cb) => engine.subscribe(cb), [engine]),
    () => engine.getSnapshot()
  );

  /* three.js view — falls back to the flat grid if WebGL/three is unavailable */
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const iso = new Iso3d(canvasRef.current, engine);
    isoRef.current = iso;
    iso.init().then((ok) => {
      if (!ok) {
        setNo3d(true);
        setView('grid');
      }
    });
    return () => {
      iso.dispose();
      isoRef.current = null;
    };
  }, [engine]);

  /* mirror every engine tick into the 3D scene */
  useEffect(() => {
    isoRef.current?.sync();
  }, [snap]);

  /* keep the log pinned to the newest line */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [engine?.logs.length, snap]);

  /* run one deploy automatically the first time the section scrolls in */
  useEffect(() => {
    if (!engine || !sectionRef.current) return undefined;
    let timer;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || autoRanRef.current) return;
        autoRanRef.current = true;
        io.disconnect();
        timer = setTimeout(() => {
          if (!engine.rolling && engine.version === '2.4.0') engine.action('deploy');
        }, 1100);
      },
      { rootMargin: '0px 0px -45% 0px' }
    );
    io.observe(sectionRef.current);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [engine]);

  const selectView = (v) => {
    setView(v);
    if (v === '3d') requestAnimationFrame(() => isoRef.current?.resize());
  };

  const byNode = [[], [], []];
  engine?.pods.forEach((p) => byNode[p.node].push(p));

  return (
    <section id="cluster" ref={sectionRef} className="pv2-side pv2-section" aria-label="Cluster simulator">
      <Reveal className="pv2-cluster-head">
        <div>
          <div className="pv2-kicker">Live — try it</div>
          <h2 className="pv2-h2">A rolling deploy, the way I actually run one</h2>
        </div>
        <p>
          Twenty-four replicas across three nodes. Press deploy and watch it roll — or kill a pod
          and watch the scheduler put it back.
        </p>
      </Reveal>

      <div className="pv2-cluster-frame">
        <div className="pv2-k-stats">
          <div className="pv2-k-stat">
            <div className="pv2-k-label">Image</div>
            <div className="pv2-k-image">yogin/pos-api:{engine?.version ?? '2.4.0'}</div>
          </div>
          <div className="pv2-k-stat">
            <div className="pv2-k-label">Healthy</div>
            <div className="pv2-k-big">
              <span className="val">{engine?.healthy() ?? 24}</span>
              <span className="unit">/ {engine?.pods.length ?? 24}</span>
            </div>
          </div>
          <div className="pv2-k-stat">
            <div className="pv2-k-label">p99 latency</div>
            <div className="pv2-k-big">
              <span className="val">{Math.round(engine?.p99 ?? 84)}</span>
              <span className="unit">ms</span>
            </div>
          </div>
          <div className="pv2-k-stat">
            <div className="pv2-k-label">Error rate</div>
            <div className="pv2-k-big">
              <span className="val">{(engine?.err ?? 0).toFixed(2)}</span>
              <span className="unit">%</span>
            </div>
          </div>
          <div className="pv2-k-stat">
            <div className="pv2-k-label">Status</div>
            <div className={`pv2-k-status${engine?.rolling ? ' is-rolling' : ''}`}>
              {engine?.status ?? 'Steady state'}
            </div>
          </div>
        </div>

        <div className="pv2-k-main">
          <div className="pv2-k-left">
            <div className="pv2-k-toolbar">
              <button type="button" className="pv2-k-btn is-primary" onClick={() => engine?.action('deploy')}>
                Deploy v2.4.1
              </button>
              <button type="button" className="pv2-k-btn" onClick={() => engine?.action('chaos')}>
                Kill a pod
              </button>
              <button type="button" className="pv2-k-btn is-tight" onClick={() => engine?.action('scale-up')}>
                Scale +6
              </button>
              <button type="button" className="pv2-k-btn is-tight" onClick={() => engine?.action('scale-down')}>
                −6
              </button>
              <button
                type="button"
                className={`pv2-k-btn is-quiet${engine?.version === '2.4.1' ? ' is-armed' : ''}`}
                onClick={() => engine?.action('rollback')}
              >
                Rollback
              </button>
            </div>

            <div className="pv2-k-body">
              <div className="pv2-k-split">
                <span className="pv2-k-label">Version split</span>
                <span className="pv2-k-split-bar">
                  <span
                    className="pv2-k-split-old"
                    style={{ width: `${((engine?.countOld() ?? 24) / Math.max(1, engine?.pods.length ?? 24)) * 100}%` }}
                  />
                  <span
                    className="pv2-k-split-new"
                    style={{ width: `${((engine?.countNew() ?? 0) / Math.max(1, engine?.pods.length ?? 24)) * 100}%` }}
                  />
                </span>
                <span className="pv2-k-split-label">
                  {engine?.countOld() ?? 24} old · {engine?.countNew() ?? 0} new
                </span>
              </div>

              <div className="pv2-k-viewrow">
                <span className="pv2-k-label" style={{ marginBottom: 0 }}>Topology</span>
                <span className="pv2-k-views">
                  <button
                    type="button"
                    className={`pv2-k-view${view === '3d' ? ' is-active' : ''}`}
                    onClick={() => selectView('3d')}
                    disabled={no3d}
                  >
                    Isometric 3D
                  </button>
                  <button
                    type="button"
                    className={`pv2-k-view${view === 'grid' ? ' is-active' : ''}`}
                    onClick={() => selectView('grid')}
                  >
                    Flat grid
                  </button>
                </span>
              </div>

              <div className="pv2-k-3d" style={{ display: view === '3d' ? 'block' : 'none' }}>
                <canvas ref={canvasRef} />
                <div className="pv2-k-3d-nodes">
                  <div>node-01 · ap-south-1a</div>
                  <div>node-02 · ap-south-1b</div>
                  <div>node-03 · ap-south-1c</div>
                </div>
                <div className="pv2-k-3d-hint">Drag to orbit · click a pod to kill it</div>
              </div>

              <div style={{ display: view === 'grid' ? 'block' : 'none' }}>
                {CLUSTER_NODES.map((n) => (
                  <div key={n.idx} className="pv2-k-node-block">
                    <div className="pv2-k-node-head">
                      <span className="pv2-k-node-name">{n.name}</span>
                      <span className="pv2-k-node-meta">{n.meta}</span>
                    </div>
                    <div className="pv2-k-pods">
                      {byNode[n.idx].map((p) => {
                        const s = POD_STYLE[p.state] || POD_STYLE.old;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className="pv2-k-pod"
                            title={`pos-api-${String(p.id).padStart(2, '0')} — click to kill`}
                            onClick={() => engine?.killPod(p.id)}
                            style={{
                              borderColor: s.border,
                              background: s.bg,
                              color: s.fg,
                              transform: p.state === 'starting' || p.state === 'pulling' ? 'scale(.86)' : 'none',
                            }}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pv2-k-legend">
                {CLUSTER_LEGEND.map((l) => (
                  <span key={l.label}>
                    <span className="chip" style={{ border: `1px solid ${l.border}`, background: l.bg }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pv2-k-right">
            <div className="pv2-k-log-head">
              <span className="pv2-k-label" style={{ marginBottom: 0 }}>Event stream</span>
              <span className="pv2-k-clock">{engine?.clockText ?? '--:--:--'}</span>
            </div>
            <div ref={logRef} className="pv2-k-log" role="log" aria-live="polite">
              {engine?.logs.map((row) => (
                <div
                  key={row.id}
                  className={`pv2-k-log-row${row.kind === '$' ? ' is-cmd' : ''}${row.kind === 'warn' ? ' is-warn' : ''}`}
                >
                  <span className="stamp">{row.stamp}</span>
                  <span className="tag">
                    {row.kind === '$' ? '$' : row.kind === 'warn' ? '!' : row.kind === 'ok' ? '✓' : '·'}
                  </span>
                  <span className="text">{row.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="pv2-cluster-caption">
        Not a video — it's a real state machine: maxSurge 25%, readiness probes, a canary gate at
        25% traffic, and automatic rescheduling. Deployments made boring — in the best way.
      </p>
    </section>
  );
}

/* Rolling-deploy state machine behind the cluster simulator.
   Pure data + timers; the React section and the 3D view both subscribe. */

export const POD_STYLE = {
  old: { border: '#201e1d', bg: 'transparent', fg: '#605d5d', label: '0' },
  draining: {
    border: '#605d5d',
    bg: 'repeating-linear-gradient(45deg,#d7d3d3,#d7d3d3 2px,#f3f2f2 2px,#f3f2f2 5px)',
    fg: '#444141',
    label: '·',
  },
  pulling: { border: '#ae1800', bg: '#fff2ef', fg: '#ae1800', label: '↓' },
  starting: { border: '#ec3013', bg: '#ffe0d9', fg: '#ae1800', label: '◐' },
  new: { border: '#ec3013', bg: '#ec3013', fg: '#fff', label: '1' },
  failed: { border: '#201e1d', bg: '#201e1d', fg: '#ffc4b8', label: '×' },
  pending: { border: 'rgba(32,30,29,.28)', bg: 'transparent', fg: '#9b9797', label: '?' },
};

export class ClusterEngine {
  constructor() {
    this.pods = [];
    for (let i = 0; i < 24; i++) this.pods.push({ id: i, node: i % 3, state: 'old' });
    this.version = '2.4.0';
    this.target = '2.4.0';
    this.p99 = 84;
    this.err = 0;
    this.status = 'Steady state';
    this.rolling = false;
    this.logs = [];
    this.clockText = '--:--:--';
    this._logSeq = 0;
    this._timers = [];
    this._listeners = new Set();
    this._snapshot = 0;
    this._started = false;
  }

  /* Timers live between start() and dispose() so the constructor stays pure
     (safe to run in a lazy useState initializer). Restartable after dispose. */
  start() {
    if (!this._started) {
      this._started = true;
      this.log('$', 'kubectl get pods -l app=pos-api');
      this.log('ok', '24/24 Running · image yogin/pos-api:2.4.0');
    }
    if (this._clock) clearInterval(this._clock);
    this._clock = setInterval(() => {
      this.clockText = new Date().toTimeString().slice(0, 8);
      if (!this.rolling) {
        this.p99 = Math.max(70, Math.min(96, this.p99 + (Math.random() - 0.5) * 3));
      }
      this._notify();
    }, 1000);
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  getSnapshot() {
    return this._snapshot;
  }

  _notify() {
    this._snapshot++;
    this._listeners.forEach((fn) => fn());
  }

  dispose() {
    clearInterval(this._clock);
    this._clock = null;
    this._timers.forEach(clearTimeout);
    this._timers = [];
  }

  healthy() {
    return this.pods.filter((p) => p.state === 'old' || p.state === 'new').length;
  }

  countNew() {
    return this.pods.filter((p) => p.state === 'new').length;
  }

  countOld() {
    return this.pods.filter((p) => p.state === 'old').length;
  }

  log(kind, text) {
    this.logs.push({ id: this._logSeq++, stamp: new Date().toTimeString().slice(0, 8), kind, text });
    if (this.logs.length > 90) this.logs = this.logs.slice(-90);
    this._notify();
  }

  _step(fn, ms) {
    this._timers.push(setTimeout(fn, ms));
  }

  action(act) {
    if (act === 'chaos') {
      const victim = this.pods[Math.floor(Math.random() * this.pods.length)];
      return this.killPod(victim.id);
    }
    if (act === 'scale-up') return this.scale(6);
    if (act === 'scale-down') return this.scale(-6);
    if (act === 'rollback') return this.roll('2.4.0', true);
    return this.roll('2.4.1', false);
  }

  scale(delta) {
    if (delta > 0) {
      if (this.pods.length >= 42) return this.log('warn', 'replica cap reached for this demo (42)');
      this.log('$', `kubectl scale deploy/pos-api --replicas=${this.pods.length + delta}`);
      for (let i = 0; i < delta; i++) {
        const id = (this.pods[this.pods.length - 1]?.id ?? -1) + 1;
        this.pods.push({ id, node: id % 3, state: 'pending' });
      }
      this._notify();
      this.pods
        .filter((p) => p.state === 'pending')
        .forEach((p, i, arr) => {
          this._step(() => { p.state = 'pulling'; this._notify(); }, 200 + i * 130);
          this._step(() => { p.state = 'starting'; this._notify(); }, 700 + i * 130);
          this._step(() => {
            p.state = this.version === '2.4.1' ? 'new' : 'old';
            this._notify();
            if (i === arr.length - 1) this.log('ok', `scaled to ${this.pods.length} replicas — all Ready`);
          }, 1300 + i * 130);
        });
    } else {
      if (this.pods.length <= 6) return this.log('warn', 'not going below 6 replicas');
      this.log('$', `kubectl scale deploy/pos-api --replicas=${this.pods.length + delta}`);
      const doomed = this.pods.slice(delta);
      doomed.forEach((p, i) => this._step(() => { p.state = 'draining'; this._notify(); }, i * 120));
      this._step(() => {
        this.pods = this.pods.slice(0, delta);
        this.log('ok', `scaled to ${this.pods.length} replicas — connections drained`);
      }, 700 + doomed.length * 120);
    }
    return undefined;
  }

  killPod(id) {
    const p = this.pods.find((x) => x.id === id);
    if (!p || p.state === 'failed' || p.state === 'draining') return;
    const was = p.state;
    p.state = 'failed';
    this.err = 0.4 + Math.random() * 0.6;
    this.p99 += 22;
    this.log('warn', `pod pos-api-${String(id).padStart(2, '0')} on node-0${p.node + 1} terminated (exit 137)`);
    this._step(() => this.log('·', 'ReplicaSet detected 1 missing replica — rescheduling'), 600);
    this._step(() => { p.state = 'pulling'; this._notify(); }, 1100);
    this._step(() => { p.state = 'starting'; this._notify(); }, 1700);
    this._step(() => {
      p.state = was;
      this.err = 0;
      this.p99 = Math.max(74, this.p99 - 22);
      this.log('ok', `pod pos-api-${String(id).padStart(2, '0')} Ready — self-healed in 2.4s`);
    }, 2500);
  }

  roll(to, isRollback) {
    if (this.rolling) return this.log('warn', 'a rollout is already in progress');
    if (this.version === to) return this.log('warn', `already at ${to} — nothing to do`);
    this._timers.forEach(clearTimeout);
    this._timers = [];
    this.rolling = true;
    this.target = to;
    const fromState = isRollback ? 'new' : 'old';
    const toState = isRollback ? 'old' : 'new';
    this.pods.forEach((p) => {
      if (p.state !== 'old' && p.state !== 'new') p.state = fromState;
    });

    this.log('$', isRollback
      ? 'kubectl rollout undo deploy/pos-api'
      : 'kubectl set image deploy/pos-api app=yogin/pos-api:2.4.1');
    this.log('·', 'strategy RollingUpdate · maxSurge 25% · maxUnavailable 0');

    const order = [...this.pods].sort(() => Math.random() - 0.5);
    const batch = 4;
    let done = 0;
    let t = 500;
    for (let b = 0; b * batch < order.length; b++) {
      const slice = order.slice(b * batch, b * batch + batch);
      const base = t;
      slice.forEach((p, i) => {
        this._step(() => { p.state = 'draining'; this._notify(); }, base + i * 60);
        this._step(() => { p.state = 'pulling'; this._notify(); }, base + 320 + i * 60);
        this._step(() => { p.state = 'starting'; this._notify(); }, base + 700 + i * 60);
        this._step(() => {
          p.state = toState;
          done++;
          this.p99 = 84 + Math.sin(done) * 8;
          this._notify();
          if (done % batch === 0 || done === order.length) this.log('ok', `${done}/${order.length} replicas on ${to}`);
          if (done === Math.round(order.length * 0.25)) this.log('·', 'canary gate — 25% of traffic on new version, watching p99');
          if (done === Math.round(order.length * 0.25) + 1) this.log('ok', 'canary healthy — error budget untouched, continuing');
          if (done === order.length) {
            this.version = to;
            this.rolling = false;
            this.status = 'Steady state';
            this.p99 = isRollback ? 84 : 71;
            this.err = 0;
            this.log('ok', isRollback
              ? 'rollback complete — 24/24 on 2.4.0 in 38s'
              : 'rollout complete — 24/24 on 2.4.1, zero downtime');
          }
        }, base + 1150 + i * 60);
      });
      t = base + 1150 + slice.length * 60 + 220;
    }
    this.status = isRollback ? 'Rolling back…' : 'Rolling out 2.4.1…';
    this._notify();
    return undefined;
  }
}

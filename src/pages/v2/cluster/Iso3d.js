/* Isometric three.js view of the live cluster state. Cubes are pods, thin
   slabs are nodes; drag orbits, click kills the pod under the cursor. */

const POD_3D = {
  old: { fill: 0xf8f4f4, edge: 0x201e1d, eo: 1, y: 0.5, sc: 1 },
  draining: { fill: 0xd7d3d3, edge: 0x605d5d, eo: 0.7, y: 0.15, sc: 0.72 },
  pulling: { fill: 0xfff2ef, edge: 0xae1800, eo: 1, y: 1.5, sc: 0.7 },
  starting: { fill: 0xffe0d9, edge: 0xec3013, eo: 1, y: 1.1, sc: 0.86 },
  new: { fill: 0xec3013, edge: 0xae1800, eo: 1, y: 0.5, sc: 1.06 },
  failed: { fill: 0x201e1d, edge: 0x201e1d, eo: 1, y: 0.5, sc: 0.9 },
  pending: { fill: 0xf3f2f2, edge: 0x9b9797, eo: 0.5, y: 2.6, sc: 0.5 },
};

export class Iso3d {
  constructor(canvas, engine) {
    this.canvas = canvas;
    this.engine = engine;
    this.disposed = false;
    this.ready = false;
  }

  async init() {
    let T;
    try {
      T = await import('three');
    } catch {
      return false;
    }
    if (this.disposed) return false;
    this.T = T;

    const canvas = this.canvas;
    const host = canvas.parentElement;
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    const scene = new T.Scene();
    const camera = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    camera.position.set(16, 13, 16);
    this.s = {
      renderer, scene, camera, host,
      cubes: new Map(), platforms: [],
      yaw: 0, targetYaw: 0, pointer: { x: 0, y: 0 }, drag: null, hover: null,
    };

    const world = new T.Group();
    scene.add(world);
    this.s.world = world;

    for (let n = 0; n < 3; n++) {
      const g = new T.Group();
      g.position.z = (n - 1) * 6.4;
      const slab = new T.BoxGeometry(19, 0.22, 4.4);
      const plate = new T.Mesh(slab, new T.MeshBasicMaterial({ color: 0xeae9e9 }));
      const edge = new T.LineSegments(
        new T.EdgesGeometry(slab),
        new T.LineBasicMaterial({ color: 0x201e1d, transparent: true, opacity: 0.55 })
      );
      plate.position.y = -0.62;
      edge.position.y = -0.62;
      g.add(plate);
      g.add(edge);
      world.add(g);
      this.s.platforms.push(g);
    }

    this.buildCubes();

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      const frustum = 11.2;
      const aspect = w / Math.max(1, h);
      camera.left = -frustum * aspect;
      camera.right = frustum * aspect;
      camera.top = frustum;
      camera.bottom = -frustum;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
    };
    resize();
    this._resize = resize;
    window.addEventListener('resize', resize);

    const ray = new T.Raycaster();
    const ndc = new T.Vector2();
    const pick = (ev) => {
      const r = canvas.getBoundingClientRect();
      ndc.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects([...this.s.cubes.values()].map((c) => c.mesh), false);
      return hits.length ? hits[0].object.userData.pid : null;
    };

    canvas.style.cursor = 'grab';
    this._onDown = (ev) => {
      this.s.drag = { x: ev.clientX, yaw: this.s.targetYaw, moved: false };
      canvas.style.cursor = 'grabbing';
    };
    this._onUp = (ev) => {
      const d = this.s.drag;
      canvas.style.cursor = 'grab';
      this.s.drag = null;
      if (d && !d.moved && ev.target === canvas) {
        const pid = pick(ev);
        if (pid !== null && pid !== undefined) this.engine.killPod(pid);
      }
    };
    this._onMove = (ev) => {
      const d = this.s.drag;
      if (d) {
        if (Math.abs(ev.clientX - d.x) > 3) d.moved = true;
        this.s.targetYaw = d.yaw + (ev.clientX - d.x) * 0.006;
      } else {
        const r = canvas.getBoundingClientRect();
        this.s.pointer.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
        const pid = pick(ev);
        canvas.style.cursor = pid !== null && pid !== undefined ? 'pointer' : 'grab';
        this.s.hover = pid;
      }
    };
    this._onLeave = () => { this.s.hover = null; };
    canvas.addEventListener('pointerdown', this._onDown);
    window.addEventListener('pointerup', this._onUp);
    canvas.addEventListener('pointermove', this._onMove);
    canvas.addEventListener('pointerleave', this._onLeave);

    const t0 = performance.now();
    const frame = () => {
      const s = this.s;
      if (!s || this.disposed) return;
      const r = host.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200 || host.offsetParent === null) return;
      const t = (performance.now() - t0) / 1000;
      s.yaw += (s.targetYaw + Math.sin(t * 0.12) * 0.06 + s.pointer.x * 0.12 - s.yaw) * 0.07;
      s.world.rotation.y = s.yaw;
      s.cubes.forEach((c, pid) => {
        c.y += (c.target.y - c.y) * 0.14;
        c.sc += (c.target.sc - c.sc) * 0.16;
        const bob = c.state === 'starting' || c.state === 'pulling'
          ? Math.sin(t * 6 + pid) * 0.07
          : Math.sin(t * 0.9 + pid * 0.7) * 0.045;
        c.mesh.position.y = c.y + bob;
        c.edge.position.y = c.mesh.position.y;
        const hov = s.hover === pid ? 1.14 : 1;
        c.mesh.scale.setScalar(c.sc * hov);
        c.edge.scale.setScalar(c.sc * hov * 1.002);
        if (c.state === 'starting') {
          c.mesh.rotation.y = t * 1.6;
          c.edge.rotation.y = c.mesh.rotation.y;
        }
      });
      renderer.render(scene, camera);
    };
    const loop = () => {
      if (this.disposed) return;
      this._raf = requestAnimationFrame(loop);
      frame();
    };
    loop();

    this.ready = true;
    return true;
  }

  buildCubes() {
    const { T, s, engine } = this;
    if (!T || !s) return;
    s.cubes.forEach((c) => {
      s.platforms[c.node].remove(c.mesh);
      s.platforms[c.node].remove(c.edge);
    });
    s.cubes.clear();
    const geo = new T.BoxGeometry(1.5, 1.5, 1.5);
    const eg = new T.EdgesGeometry(geo);
    const byNode = [[], [], []];
    engine.pods.forEach((p) => byNode[p.node].push(p));
    byNode.forEach((list, n) => {
      list.forEach((p, i) => {
        const mesh = new T.Mesh(geo, new T.MeshBasicMaterial({ color: 0xf8f4f4 }));
        const edge = new T.LineSegments(eg, new T.LineBasicMaterial({ color: 0x201e1d }));
        const x = (i - (list.length - 1) / 2) * 2.0;
        mesh.position.set(x, 0.5, 0);
        edge.position.copy(mesh.position);
        mesh.userData.pid = p.id;
        s.platforms[n].add(mesh);
        s.platforms[n].add(edge);
        s.cubes.set(p.id, { mesh, edge, node: n, y: 0.5, sc: 1, target: { y: 0.5, sc: 1 }, state: p.state });
      });
    });
    engine.pods.forEach((p) => this.paintPod(p));
  }

  paintPod(p) {
    const { s } = this;
    if (!s) return;
    const c = s.cubes.get(p.id);
    if (!c) return;
    c.state = p.state;
    const M = POD_3D[p.state] || POD_3D.old;
    c.mesh.material.color.setHex(M.fill);
    c.edge.material.color.setHex(M.edge);
    c.edge.material.opacity = M.eo;
    c.edge.material.transparent = M.eo < 1;
    c.target.y = M.y;
    c.target.sc = M.sc;
    if (p.state !== 'starting') {
      c.mesh.rotation.y = 0;
      c.edge.rotation.y = 0;
    }
  }

  /* Called on every engine notification: rebuild on scale, repaint on state change. */
  sync() {
    if (!this.ready) return;
    if (this.s.cubes.size !== this.engine.pods.length) this.buildCubes();
    else this.engine.pods.forEach((p) => this.paintPod(p));
  }

  resize() {
    if (this._resize) this._resize();
  }

  dispose() {
    this.disposed = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._resize) window.removeEventListener('resize', this._resize);
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this._onDown);
      this.canvas.removeEventListener('pointermove', this._onMove);
      this.canvas.removeEventListener('pointerleave', this._onLeave);
    }
    window.removeEventListener('pointerup', this._onUp);
    if (this.s) this.s.renderer.dispose();
  }
}

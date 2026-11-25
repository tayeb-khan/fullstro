/* ==========================================================================
   FullStro homepage – interactions
   Every section is a small module: init() once, render() on every
   language/region change. All copy comes from FS_I18N via FS_LOCALE.t().
   ========================================================================== */
(function () {
  'use strict';
  const C = window.FS_CONFIG, L = window.FS_LOCALE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const t = (p, v) => L.t(p, v);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, RM ? Math.min(ms, 60) : ms));
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const tidy = n => Number.isInteger(n) ? L.num(n) : L.num(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const listJoin = arr => arr.length < 2 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' ' + t('common.and') + ' ' + arr[arr.length - 1];

  /* Visibility helper: cb(isVisible) */
  function watch(el, cb, threshold = 0.25) {
    if (!el) return;
    new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { threshold }).observe(el);
  }

  /* Shared product art – the same Black Hoodie appears everywhere on the page */
  function hoodie(fill = '#1B1D29', line = 'rgba(255,255,255,.28)') {
    return `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M40 20c6-7 34-7 40 0l20 12 12 32-15 6-7-15v53H30V55l-7 15-15-6 12-32z" fill="${fill}"/>
      <path d="M45 19c3 15 27 15 30 0" fill="none" stroke="${line}" stroke-width="4" stroke-linecap="round"/>
      <path d="M53 30v15M67 30v15" stroke="${line}" stroke-width="2.6" stroke-linecap="round"/>
      <rect x="44" y="76" width="32" height="17" rx="6" fill="rgba(255,255,255,.07)" stroke="${line}" stroke-width="1.5"/>
      <path d="M30 104h60" stroke="${line}" stroke-width="3"/></svg>`;
  }

  /* Visitor profile, shared by Stro, pricing and tips */
  const P = Object.assign({ channels: [], cat: null, starter: false, set: false }, store.get('fs_profile') || {});
  const saveP = () => store.set('fs_profile', P);

  /* ====================================================================
     STATIC COPY, LINKS, LOCALE SWITCHER
     ==================================================================== */
  function applyStatic() {
    const lang = C.languages[L.lang];
    document.documentElement.lang = lang.htmlLang;
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.description'));
    const vars = { rating: C.trust.rating, year: L.num(new Date().getFullYear(), { useGrouping: false }) };
    $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n, vars); });
    $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':'); el.setAttribute(attr, t(key));
    }));
    $$('[data-link]').forEach(a => {
      const href = L.R.links[a.dataset.link] || C.links[a.dataset.link];
      if (!href) return;
      a.href = href;
      if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    });
    $('#localeLabel').textContent = `${lang.short} · ${L.R.symbol}`;
    $('#langSeg').innerHTML = Object.entries(C.languages).map(([id, l]) =>
      `<button type="button" data-lang="${id}" class="${id === L.lang ? 'on' : ''}" lang="${l.htmlLang}">${l.label}</button>`).join('');
    $('#regionSeg').innerHTML = Object.entries(C.regions).map(([id, r]) =>
      `<button type="button" data-region="${id}" class="${id === L.region ? 'on' : ''}">${r.flag} ${t(id === 'bd' ? 'nav.regionBd' : 'nav.regionGlobal')} <small>${r.symbol}</small></button>`).join('');
    $('#rights').textContent = t('footer.rights', vars);
  }

  const localeEl = $('#locale');
  $('#localeBtn').addEventListener('click', e => {
    e.stopPropagation();
    const open = localeEl.classList.toggle('open');
    $('#localeBtn').setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!localeEl.contains(e.target)) localeEl.classList.remove('open');
    const lb = e.target.closest('[data-lang]'); if (lb) L.setLang(lb.dataset.lang);
    const rb = e.target.closest('[data-region]'); if (rb) L.setRegion(rb.dataset.region);
    /* In-page anchors: smooth scroll, and stay on this language even under <base> */
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1) {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
        history.replaceState(null, '', location.pathname + location.search + a.getAttribute('href'));
        $('#nav').classList.remove('open');
      }
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { localeEl.classList.remove('open'); Modal.close(); } });

  /* ====================================================================
     NAV
     ==================================================================== */
  addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 8), { passive: true });
  $('#burger').addEventListener('click', () => {
    const open = $('#nav').classList.toggle('open');
    $('#burger').setAttribute('aria-expanded', open);
  });
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$('#navLinks a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['journey', 'agent', 'hub', 'builder', 'pricing'].forEach(id => navIO.observe($('#' + id)));

  /* Reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ====================================================================
     REAL APP SCREENSHOTS
     Captures of the actual FullStro tenant dashboard, filled with the page's
     demo data (assets/img/app/<name>.<region>.webp + manifest.json with the
     hotspot boxes). A Reel is a small "camera" that pans and zooms between
     hotspots with a cursor and a caption, so a still screenshot plays like a
     product video. Without the manifest every section keeps its mock-up.
     ==================================================================== */
  const Shots = {
    m: null,
    async load() {
      try { const r = await fetch('assets/img/app/manifest.json', { cache: 'no-cache' }); if (r.ok) this.m = await r.json(); } catch (e) {}
      return this.m;
    },
    has(n) { return !!(this.m && this.m[n]); },
    src(n, region = L.region) { return `assets/img/app/${n}.${region}.webp`; }
  };

  class Reel {
    constructor(el) {
      this.el = el; el.classList.add('reel');
      el.innerHTML = `<div class="reel-cam"><img alt="" decoding="async"><span class="reel-ring"></span></div>
        <span class="reel-cursor" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 2.5l14 8.2-6.3 1.6-3.2 6.2z"/></svg></span>
        <span class="reel-cap" aria-live="polite"></span><span class="reel-badge"></span>`;
      this.cam = $('.reel-cam', el); this.img = $('img', el); this.ring = $('.reel-ring', el);
      this.cur = $('.reel-cursor', el); this.cap = $('.reel-cap', el);
      this.img.addEventListener('error', () => {     // a region's capture missing → use the other one
        const alt = Shots.src(this.name, L.region === 'bd' ? 'global' : 'bd');
        if (!this.img.src.endsWith(alt)) this.img.src = alt;
      });
      if ('ResizeObserver' in window) new ResizeObserver(() => this.frame()).observe(el);
    }
    show(name, key, caption) {
      const s = Shots.m && Shots.m[name]; if (!s) return;
      if (this.name !== name || this.region !== L.region) {
        const swap = !!this.name;
        this.name = name; this.region = L.region;
        this.cam.style.width = s.w + 'px'; this.cam.style.height = s.h + 'px';
        if (swap && !RM) { this.el.classList.add('swap'); setTimeout(() => this.el.classList.remove('swap'), 380); }
        this.img.src = Shots.src(name);
      }
      this.img.alt = caption ? caption.replace(/<[^>]+>/g, '') : name;
      this.key = key;
      this.cap.innerHTML = caption || ''; this.cap.classList.toggle('on', !!caption);
      $('.reel-badge', this.el).textContent = t('reel.badge') + ' · ' + t('reel.demo');
      this.frame(true);
    }
    frame(click) {
      const s = this.name && Shots.m && Shots.m[this.name]; if (!s) return;
      const cw = this.el.clientWidth, ch = this.el.clientHeight; if (!cw || !ch) return;
      const fit = Math.max(cw / s.w, ch / s.h);
      const spots = (s.hotspotsByRegion && s.hotspotsByRegion[this.region]) || s.hotspots || {};
      const box = spots[this.key];
      let sc = fit, tx = (cw - s.w * fit) / 2, ty = 0;
      if (box) {
        const [bx, by, bw, bh] = box;
        // zoom toward the hotspot, but never so far that the screen loses its context
        sc = Math.min(Math.max(Math.min(cw * .8 / bw, ch * .72 / bh), fit), fit * 1.7);
        tx = cw / 2 - (bx + bw / 2) * sc; ty = ch / 2 - (by + bh / 2) * sc;
        tx = Math.min(0, Math.max(cw - s.w * sc, tx)); ty = Math.min(0, Math.max(ch - s.h * sc, ty));
        Object.assign(this.ring.style, { left: bx + 'px', top: by + 'px', width: bw + 'px', height: bh + 'px', borderWidth: (2.5 / sc) + 'px', borderRadius: (12 / sc) + 'px', opacity: 1 });
        const cx = tx + (bx + bw * .62) * sc, cy = ty + (by + bh * .6) * sc;
        this.cur.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`; this.cur.classList.add('on');
        if (click) { this.cur.classList.remove('click'); clearTimeout(this._c); this._c = setTimeout(() => this.cur.classList.add('click'), RM ? 0 : 1150); }
      } else { this.ring.style.opacity = 0; this.cur.classList.remove('on'); }
      this.cam.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${sc.toFixed(4)})`;
    }
  }

  /* Any element with data-reel="name:key1,key2" plays through its hotspots while visible */
  const Strips = {
    reels: [],
    init() {
      $$('[data-reel]').forEach(el => {
        const [name, keys] = el.dataset.reel.split(':');
        const host = document.createElement('div'); host.className = 'reel-host'; el.append(host);
        const r = { el, name, keys: keys.split(','), i: 0, vis: false, reel: null, host };
        this.reels.push(r);
        watch(el, v => { r.vis = v; }, 0.35);
      });
      setInterval(() => this.reels.forEach(r => { if (r.vis && r.reel && !RM) { r.i = (r.i + 1) % r.keys.length; this.play(r); } }), 3400);
    },
    render() {
      $$('[data-reel-wrap]').forEach(w => {
        w.hidden = !$$('[data-reel]', w).some(e => Shots.has(e.dataset.reel.split(':')[0]));
      });
      this.reels.forEach(r => {
        if (!Shots.has(r.name)) return;
        if (!r.reel) r.reel = new Reel(r.host);
        this.play(r);
      });
    },
    play(r) { const k = r.keys[r.i]; r.reel.show(r.name, k, t(`reel.caps.${r.name}.${k}`)); }
  };

  /* ====================================================================
     1. HERO – live dashboard cycling the four key moments
     ==================================================================== */
  const Hero = {
    i: -1, timer: null, visible: true, sales: 0, orders: 0,
    icons: ['🔄', '🛒', '💳', '🚚'],
    init() {
      watch($('#heroDash'), v => { this.visible = v; v ? this.play() : this.stop(); }, 0.2);
    },
    render() {
      const trust = [];
      if (C.trust.rating) trust.push(`<li><span class="stars">★★★★★</span>${t('hero.trust.rating', { rating: L.num(C.trust.rating, { minimumFractionDigits: 1 }) })}</li>`);
      if (C.trust.merchants) trust.push(`<li>${t('hero.trust.merchants', { n: L.num(C.trust.merchants) })}</li>`);
      trust.push(`<li class="ai">✦ ${t('hero.trust.ai')}</li>`, `<li>🎁 ${t('hero.trust.trial')}</li>`, `<li>↩️ ${t('hero.trust.refund')}</li>`);
      $('#trust').innerHTML = trust.join('');
      const steps = t('hero.dash.steps'), ev = t('hero.dash.events');
      $('#hdFlow').innerHTML = steps.map((s, k) => `<li><span class="fi">${this.icons[k]}</span><div><b>${s}</b><small>${ev[k]}</small></div><span class="ok">✓</span></li>`).join('');
      this.sales = L.S.price * 26; this.orders = 26;
      this.paintStats();
      const real = Shots.has('dashboard');
      $('.hero-vis').classList.toggle('real', real);
      if (real) { this.reel = this.reel || new Reel($('#heroReel')); this.cam(Math.max(this.i, 0)); }
      $('#hdChan').textContent = L.S.channel + ' ✓';
      $('#hdCourier').textContent = L.S.courier + ' ✓';
      if (RM) { $$('#hdFlow li').forEach(li => li.classList.add('done')); return; }
      this.paint(this.i < 0 ? 0 : this.i);
    },
    paintStats(flash) {
      const s = $('#hdSales'), o = $('#hdOrders');
      s.textContent = L.money(this.sales); o.textContent = L.num(this.orders);
      [s, o].forEach(el => el.classList.toggle('flash', !!flash));
    },
    paint(i) {
      $$('#hdFlow li').forEach((li, k) => { li.classList.toggle('done', k < i); li.classList.toggle('now', k === i); });
      this.cam(i);
    },
    cam(i) {
      if (!this.reel || !Shots.has('dashboard')) return;
      const key = ['products', 'stats', 'chart', 'stats'][i] || 'stats';
      this.reel.show('dashboard', key, t('reel.hero.' + key));
    },
    step() {
      this.i = (this.i + 1) % 5;
      if (this.i === 4) { // all four done: hold, then start a fresh cycle
        $$('#hdFlow li').forEach(li => { li.classList.add('done'); li.classList.remove('now'); });
        this.timer = setTimeout(() => { this.i = -1; this.step(); }, 2600);
        return;
      }
      this.paint(this.i);
      if (this.i === 1) { this.orders++; this.sales += L.S.price; this.paintStats(true); }
      const toast = $('#hdToast');
      toast.textContent = t('hero.dash.toast')[this.i];
      toast.classList.add('show'); clearTimeout(toast._h);
      toast._h = setTimeout(() => toast.classList.remove('show'), 1700);
      this.timer = setTimeout(() => this.step(), 2200);
    },
    play() { if (RM || this.timer) return; this.timer = setTimeout(() => this.step(), 500); },
    stop() { clearTimeout(this.timer); this.timer = null; }
  };

  /* ====================================================================
     1b. WHY FULLSTRO EXISTS – merchant ↔ Stro conversation
     The intro plays once when the card scrolls into view; topic chips let
     the visitor ask more. Each answer lights up one line of the goal list.
     ==================================================================== */
  const Goal = {
    run: 0, started: false, busy: false, asked: new Set(), lit: new Set(),
    init() {
      watch($('#goal'), v => { if (v && !this.started) this.start(); }, 0.35);
      $('#goalQuick').addEventListener('click', e => {
        const b = e.target.closest('[data-q]');
        if (b && !this.busy) this.ask(+b.dataset.q);
      });
      $('#goalReplay').addEventListener('click', () => this.start());
    },
    render() {
      // Language or region changed: rebuild in the new language (instantly if it had already played).
      this.paintList();
      if (this.started) this.start(true);
    },
    paintList() {
      const pillars = t('goal.pillars');
      $('#goalList').innerHTML = pillars.map((p, i) =>
        `<li class="${this.lit.has(i) ? 'on' : ''}"><span class="gk" aria-hidden="true">✓</span><span>${p}</span></li>`).join('');
      $('#goalDone').classList.toggle('show', this.lit.size === pillars.length);
    },
    light(i) {
      if (this.lit.has(i)) return;
      this.lit.add(i);
      const li = $$('#goalList li')[i];
      if (li) { li.classList.add('on', 'flash'); setTimeout(() => li.classList.remove('flash'), 600); }
      $('#goalDone').classList.toggle('show', this.lit.size === t('goal.pillars').length);
    },
    async start(instant = false) {
      const run = ++this.run;
      this.started = true; this.busy = true; this.asked.clear(); this.lit.clear();
      $('#goalMsgs').innerHTML = ''; $('#goalQuick').innerHTML = '';
      this.paintList();
      for (const m of t('goal.intro')) if (!(await this.say(m, run, instant))) return;
      this.busy = false; this.chips();
    },
    async ask(i) {
      const topic = t('goal.topics')[i];
      if (!topic) return;
      const run = this.run;
      this.busy = true; this.asked.add(i); $('#goalQuick').innerHTML = '';
      if (!(await this.say({ me: topic.q }, run))) return;
      for (const a of topic.a) if (!(await this.say({ bot: a }, run))) return;
      if (topic.all) t('goal.pillars').forEach((_, k) => this.light(k));
      else if (topic.pillar != null) this.light(topic.pillar);
      this.busy = false; this.chips();
    },
    // Adds one message (bot messages get a typing indicator first).
    // Returns false when a replay or language change started a newer run.
    async say(m, run, instant = false) {
      const box = $('#goalMsgs'), bot = m.bot != null;
      if (!instant) {
        if (bot) {
          const dots = document.createElement('div');
          dots.className = 'typing'; dots.setAttribute('aria-label', t('goal.typing')); dots.innerHTML = '<i></i><i></i><i></i>';
          box.appendChild(dots); this.scroll();
          await wait(Math.min(1500, 450 + m.bot.length * 8));
          dots.remove();
        } else await wait(420);
        if (run !== this.run) return false;
      }
      const b = document.createElement('div');
      b.className = 'b ' + (bot ? 'bot' : 'me');
      b.innerHTML = bot ? m.bot : esc(m.me);
      box.appendChild(b); this.scroll();
      if (bot && m.pillar != null) this.light(m.pillar);
      if (!instant) await wait(bot ? 600 : 220);
      return run === this.run;
    },
    chips() {
      const left = t('goal.topics').map((tp, i) => [tp, i]).filter(([, i]) => !this.asked.has(i));
      const html = [`<span class="gq-label">${t('goal.ask')}</span>`];
      left.forEach(([tp, i]) => html.push(`<button type="button" class="chip" data-q="${i}">${esc(tp.q)}</button>`));
      if (this.asked.size || !left.length) html.push(`<a class="chip go" href="#pricing">${esc(t('goal.cta'))}</a>`);
      if (!left.length) html.shift();
      $('#goalQuick').innerHTML = html.join('');
      this.scroll(); // the chip row changes the thread's height
    },
    scroll() { const box = $('#goalMsgs'); box.scrollTop = box.scrollHeight; }
  };

  /* Popup shared by the screenshot lightbox */
  const Modal = {
    init() {
      $('#modalX').addEventListener('click', () => this.close());
      $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') this.close(); });
    },
    close() {
      if (!$('#modal').classList.contains('open')) return;
      $('#modal').classList.remove('open'); $('#modal').setAttribute('aria-hidden', 'true');
      setTimeout(() => { $('#modalFrame').innerHTML = ''; }, 250);
    }
  };

  const Lightbox = {
    open(src, alt) {
      $('#modal').classList.add('lightbox');
      $('#modalFrame').innerHTML = `<div class="lb-scroll"><img src="${src}" alt="${esc(alt)}"></div>`;
      $('#modal').classList.add('open'); $('#modal').setAttribute('aria-hidden', 'false'); $('#modalX').focus();
    }
  };

  /* Hero background video: poster only for reduced motion / Data Saver, 720p on small screens,
     paused while the hero is off-screen or the tab is hidden. */
  const HeroBg = {
    init() {
      const box = $('#heroBg'), v = $('#heroVideo'), row = $('.hero-in'), cfg = C.heroVideo;
      if (!box || !v || !cfg || !cfg.enabled) { box && box.remove(); return; }
      const fit = () => box.style.setProperty('--hero-bg-h', (row.offsetTop + row.offsetHeight + 48) + 'px');
      fit(); new ResizeObserver(fit).observe(row);
      const src = innerWidth * (devicePixelRatio || 1) > 1600 ? cfg.hd : cfg.sd;
      v.poster = src.poster;
      box.classList.add('ready'); // poster shows straight away
      const saveData = navigator.connection && navigator.connection.saveData;
      if (RM || saveData) return;
      v.innerHTML = `<source src="${src.webm}" type="video/webm"><source src="${src.mp4}" type="video/mp4">`;
      v.preload = 'auto'; v.load();
      let seen = false;
      const sync = () => (seen && !document.hidden ? v.play().catch(() => {}) : v.pause());
      watch($('#top'), vis => { seen = vis; sync(); }, 0);
      document.addEventListener('visibilitychange', sync);
    }
  };

  /* ====================================================================
     2. PROBLEM → SOLUTION – drag-to-compare
     ==================================================================== */
  const Story = {
    pos: 50, swept: false,
    spots: [[4, 10, -3], [34, 22, 2], [10, 42, 1.5], [40, 56, -2], [6, 72, 2.5]],
    init() {
      const range = $('#cmpRange');
      const box = $('#compare');
      range.addEventListener('input', () => { box.classList.add('touched'); this.set(+range.value); });
      // drag the round handle only (mouse, pen or touch); the rest of the box ignores clicks
      const knob = $('.cmp-handle span', box);
      const at = e => { const r = box.getBoundingClientRect(); return Math.round(Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100))); };
      let id = null;
      knob.addEventListener('pointerdown', e => {
        if (e.button) return;
        id = e.pointerId; box.setPointerCapture(id);
        box.classList.add('touched', 'dragging'); e.preventDefault();
      });
      box.addEventListener('pointermove', e => { if (e.pointerId === id) this.set(at(e)); });
      const end = e => { if (e.pointerId !== id) return; id = null; box.classList.remove('dragging'); };
      box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
      watch($('#compare'), v => { if (v && !this.swept && !RM) { this.swept = true; this.sweep(); } }, 0.5);
    },
    render() {
      $('#chaos').innerHTML = t('story.beforeApps').map((a, i) => {
        const [l, tp, r] = this.spots[i];
        return `<div class="app-win" style="left:${l}%;top:${tp}%;--rot:${r}deg;animation-delay:${-i * 1.1}s"><div class="dots"><i></i><i></i><i></i></div><b>${a.app}<em>${a.badge}</em></b><p>${a.line}</p></div>`;
      }).join('');
      $('#calmList').innerHTML = t('story.afterItems').map(x => `<li>${x}</li>`).join('');
      this.set(this.pos);
    },
    set(p) {
      this.pos = p;
      $('#compare').style.setProperty('--pos', p + '%');
      $('#cmpRange').value = p;
      const f = 1 - p / 100; // share of "after" visible
      $('#metrics').innerHTML = t('story.metrics').map(m => {
        const v = m.before + (m.after - m.before) * f;
        const shown = m.before % 1 || m.after % 1 ? Math.round(v * 2) / 2 : Math.round(v);
        return `<div class="metric ${f > .5 ? 'good' : 'bad'}"><span>${m.label}</span><b>${tidy(shown)}</b></div>`;
      }).join('');
    },
    async sweep() {
      // a one-time hint: show the mess, then reveal the calm
      for (const target of [78, 22, 40]) {
        const from = this.pos, start = performance.now(), dur = 900;
        await new Promise(res => {
          const tick = now => {
            if ($('#compare').classList.contains('touched')) return res();
            const k = Math.min(1, (now - start) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            this.set(Math.round(from + (target - from) * e));
            k < 1 ? requestAnimationFrame(tick) : res();
          };
          requestAnimationFrame(tick);
        });
        await wait(350);
      }
    }
  };

  /* ====================================================================
     3. STRO – AI agent overview
     ==================================================================== */
  const MODS = [
    ['orders', '🛒'], ['inventory', '📦'], ['payments', '💳'],
    ['shipping', '🚚'], ['builder', '✦'], ['messaging', '💬']
  ];
  const CH_COLORS = { facebook: '#1877F2', instagram: '#E1306C', whatsapp: '#25D366', tiktok: '#111', website: '#09B0EE', shopify: '#5E8E3E', woocommerce: '#7F54B3', amazon: '#FF9900', ebay: '#E53238', daraz: '#F85606', shopee: '#EE4D2D', lazada: '#0F146D', shop: '#F59E0B' };

  const Stro = {
    gen: 0, q: Promise.resolve(), started: false,
    init() {
      $('#composer').addEventListener('submit', e => {
        e.preventDefault();
        const v = $('#chatInput').value.trim(); if (!v) return;
        $('#chatInput').value = ''; this.handle(v);
      });
      $('#chatReset').addEventListener('click', () => { Object.assign(P, { channels: [], cat: null, starter: false, set: false }); saveP(); this.restart(); Pricing.render(); });
      watch($('#chat'), v => { if (v && !this.started) { this.started = true; this.restart(); } }, 0.3);
    },
    render() {
      this.renderModules();
      if (P.set) this.applyBoard(false);
      if (this.started) this.restart();
    },
    restart() {
      this.gen++; this.q = Promise.resolve();
      $('#msgs').innerHTML = ''; $('#quick').innerHTML = '';
      this.say(t('agent.hello'), 500);
      if (P.set) { this.say(this.heardLine(), 300); this.say(this.doneHtml(), 300); }
      this.chips();
    },
    scroll() { const m = $('#msgs'); m.scrollTop = m.scrollHeight; },
    say(html, delay) {
      const g = this.gen;
      this.q = this.q.then(() => new Promise(res => {
        if (g !== this.gen) return res();
        const ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>';
        $('#msgs').append(ty); this.scroll();
        const plain = html.replace(/<[^>]+>/g, '');
        setTimeout(() => {
          ty.remove(); if (g !== this.gen) return res();
          const b = document.createElement('div'); b.className = 'b bot'; b.innerHTML = html;
          $('#msgs').append(b); this.scroll(); res();
        }, RM ? 60 : (delay ?? Math.min(1300, 350 + plain.length * 11)));
      }));
      return this.q;
    },
    me(text) {
      const b = document.createElement('div'); b.className = 'b me'; b.textContent = text;
      $('#msgs').append(b); this.scroll();
    },
    chips() {
      const g = this.gen;
      this.q.then(() => {
        if (g !== this.gen) return;
        const opts = t('agent.options.' + L.region);
        $('#quick').innerHTML = opts.map((o, i) => `<button type="button" class="chip" data-i="${i}" style="animation-delay:${i * 50}ms">${o.label}</button>`).join('');
        $$('#quick .chip').forEach(c => c.addEventListener('click', () => {
          const o = opts[+c.dataset.i]; this.handle(o.label, o.text, +c.dataset.i === 3);
        }));
      });
    },
    parse(text, starterHint) {
      const s = ' ' + text.toLowerCase().replace(/[+,.!?/&]/g, m => ' ' + m + ' ').replace(/\s+/g, ' ') + ' ';
      const K = C.stroKeywords;
      const hit = w => new RegExp('(?:^|[^\\p{L}\\p{M}\\p{N}])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'u').test(s);
      const channels = Object.keys(K.channels).filter(k => K.channels[k].some(hit));
      const cat = Object.keys(K.categories).find(k => K.categories[k].some(hit)) || null;
      const starter = !!starterHint || (!channels.length && /(start|new|begin|idea|শুরু|নতুন)/.test(s));
      return { channels, cat, starter };
    },
    async handle(label, text, starterHint) {
      this.gen++; this.q = Promise.resolve(); $('#quick').innerHTML = '';
      this.me(label);
      Object.assign(P, this.parse(text || label, starterHint), { set: true }); saveP();
      await this.say(t('agent.thinking'), 700);
      this.applyBoard(true);
      this.say(this.heardLine());
      this.say(this.doneHtml(), 900);
      this.chips();
      Pricing.render(); Tips.reset('pricing');
    },
    names(list) { const n = t('agent.channelNames'); return list.map(c => n[c] || c); },
    heardLine() {
      if (P.starter) return t('agent.heardStarter');
      if (!P.channels.length) return t('agent.heardNoChannel');
      const what = P.cat ? t('agent.categories.' + P.cat) : t('agent.products');
      return t('agent.heard', { what: esc(what), channels: esc(listJoin(this.names(P.channels))) });
    },
    doneHtml() { return `${t('agent.done')}<br><button type="button" class="linkish" data-goto="journey">${t('agent.follow')}</button>`; },

    /* Which modules matter most, and what each one does for *this* visitor */
    plan() {
      const ch = P.channels, has = c => ch.includes(c);
      const social = ch.filter(c => ['facebook', 'instagram', 'whatsapp', 'tiktok'].includes(c));
      const markets = ch.filter(c => ['amazon', 'ebay', 'daraz', 'shopee', 'lazada', 'shopify', 'woocommerce', 'tiktok'].includes(c));
      const ownStore = ['shopify', 'woocommerce', 'website'].find(has);
      const online = ch.filter(c => c !== 'shop');
      const names = this.names(ch);
      const sc = {
        orders: 2 + Math.min(ch.length, 3),
        inventory: 1 + markets.length + (has('shop') ? 2 : 0) + (ch.length > 1 ? 1 : 0),
        payments: 2,
        shipping: has('shop') && !online.length ? 1 : 2.5,
        builder: P.starter || !ownStore ? 4.5 : 0.5,
        messaging: social.length ? 3 + social.length : 0.8
      };
      const L_ = 'agent.lines.';
      const lines = {
        orders: P.starter || !ch.length ? t(L_ + 'ordersStarter') : t(L_ + 'orders', { channels: esc(listJoin(names)) }),
        inventory: has('shop') ? t(L_ + 'inventoryShop') : (P.starter || !ch.length) ? t(L_ + 'inventoryStarter') : t(L_ + 'inventory', { first: esc(names[0]) }),
        payments: t(L_ + 'payments'),
        shipping: has('shop') ? t(L_ + 'shippingShop') : t(L_ + 'shipping'),
        builder: ownStore && ownStore !== 'website' ? t(L_ + 'builderHas', { store: esc(this.names([ownStore])[0]) }) : t(L_ + 'builder'),
        messaging: social.length ? t(L_ + 'messaging', { social: esc(listJoin(this.names(social))) }) : t(L_ + 'messagingNone')
      };
      const ranked = Object.keys(sc).sort((a, b) => sc[b] - sc[a]);
      return { sc, lines, ranked, hits: new Set(ranked.filter(k => sc[k] >= 3).slice(0, 4)) };
    },
    renderModules() {
      const box = $('#modules');
      const cur = $$('.mod', box).map(m => m.dataset.id);
      const order = cur.length ? cur : MODS.map(m => m[0]);
      box.innerHTML = order.map(id => {
        const ic = MODS.find(m => m[0] === id)[1];
        return `<article class="mod" data-id="${id}"><span class="for">${t('agent.forYou')}</span><div class="mi">${ic}</div><h3>${t('agent.modules.' + id + '.name')}</h3><p>${t('agent.modules.' + id + '.desc')}</p><div class="you"></div><div class="bar"><i></i></div></article>`;
      }).join('');
      this.renderSetup();
    },
    renderSetup() {
      const ch = P.set ? P.channels : [];
      const names = this.names(ch);
      $('#setupIn').innerHTML = ch.length
        ? ch.map((c, i) => `<span class="sc" style="animation-delay:${i * 80}ms"><span class="ch-dot" style="background:${CH_COLORS[c] || '#888'}"></span>${esc(names[i])}</span>`).join('')
        : [L.S.channel, t('agent.channelNames.website'), L.S.market].map(n => `<span class="sc ghost">${esc(n)}</span>`).join('');
    },
    applyBoard(animate) {
      const box = $('#modules');
      const pl = this.plan();
      const els = $$('.mod', box);
      const first = new Map(els.map(el => [el, el.getBoundingClientRect()]));
      pl.ranked.forEach(id => box.append(box.querySelector(`[data-id="${id}"]`)));
      els.forEach(el => {
        const id = el.dataset.id;
        el.classList.toggle('hit', pl.hits.has(id));
        $('.you', el).innerHTML = pl.lines[id];
      });
      box.classList.add('active');
      this.renderSetup();
      if (!animate || RM) return;
      els.forEach(el => {               // FLIP: slide each card from its old spot
        const a = first.get(el), b = el.getBoundingClientRect();
        const dx = a.left - b.left, dy = a.top - b.top;
        if (!dx && !dy) return;
        el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    }
  };
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]');
    if (g) $('#' + g.dataset.goto).scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  });

  /* ====================================================================
     4. ORDER JOURNEY – auto-cycling, pausable
     ==================================================================== */
  /* Order #1042 journey. With the real screenshots loaded, every step is a short walkthrough:
     each beat moves the camera (and cursor) to the part of the real FullStro screen that does the job,
     narrated by journey.ops[step][beat]. Without them, the drawn mock-ups in screen() are used. */
  const Journey = {
    i: 0, b: 0, elapsed: 0, MS: 4600, BEAT: 2900, hover: false, visible: false, last: 0,
    beats: [
      [['orders', 'row1042'], ['orders', 'channel'], ['orders', 'status']],
      [['inventory', 'hoodie'], ['inventory', 'stock']],
      [['invoice', 'method'], ['invoice', 'total'], ['invoice', 'status']],
      [['label', 'print'], ['label', 'shipTo'], ['courier', 'book'], ['label', 'labelBtn']],
      [['tracking', 'status'], ['orders', 'status']],
      [['delivered', 'latest'], ['delivered', 'timeline']]
    ],
    real(k = this.i) { return this.beats[k].every(([n]) => Shots.has(n)); },
    dur(k = this.i) { return this.real(k) ? this.beats[k].length * this.BEAT : this.MS; },
    init() {
      const box = $('#journeyBox');
      box.addEventListener('mouseenter', () => { this.hover = true; this.state(); });
      box.addEventListener('mouseleave', () => { this.hover = false; this.state(); });
      box.addEventListener('focusin', () => { this.hover = true; this.state(); });
      box.addEventListener('focusout', () => { this.hover = false; this.state(); });
      watch(box, v => { this.visible = v; }, 0.3);
      const loop = now => {
        const dt = this.last ? now - this.last : 0; this.last = now;
        if (this.visible && !this.hover && !RM) {
          this.elapsed += dt;
          const d = this.dur();
          if (this.elapsed >= d) this.go((this.i + 1) % 6);
          else if (this.real()) { const b = Math.floor(this.elapsed / this.BEAT); if (b !== this.b) this.beat(b); }
          const f = $(`#rail li:nth-child(${this.i + 1}) .fill`);
          if (f) f.style.width = Math.min(100, this.elapsed / this.dur() * 100) + '%';
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
    render() {
      $('#rail').innerHTML = t('journey.stages').map((s, k) =>
        `<li role="presentation"><button type="button" role="tab" data-k="${k}"><span class="n">${L.num(k + 1)}</span><b>${s.name}</b><i class="fill"></i></button></li>`).join('');
      $$('#rail button').forEach(b => b.addEventListener('click', () => this.go(+b.dataset.k)));
      this.go(this.i, true);
    },
    state() {
      const el = $('#autoState'), paused = this.hover || RM;
      el.textContent = paused ? t('journey.paused') : t('journey.playing');
      el.classList.toggle('paused', paused);
    },
    go(k) {
      this.i = k; this.elapsed = 0;
      $$('#rail li').forEach((li, j) => {
        li.classList.toggle('on', j === k); li.classList.toggle('done', j < k);
        li.querySelector('button').setAttribute('aria-selected', j === k);
        $('.fill', li).style.width = j < k ? '100%' : '0';
      });
      const s = t('journey.stages')[k], real = this.real(k);
      const ops = real ? `<ol class="ops anim" style="animation-delay:.08s">${t('journey.ops')[k].map((o, j) =>
        `<li><button type="button" data-b="${j}"><span class="oi" aria-hidden="true">${L.num(j + 1)}</span><span>${o}</span></button></li>`).join('')}</ol>` : '';
      $('#stageCopy').innerHTML = `<div class="anim"><span class="k">${L.num(k + 1)} / ${L.num(6)}</span><h3>${s.name}</h3><p>${s.line}</p></div>${ops}<div class="you-line anim" style="animation-delay:.12s">${s.you}</div>`;
      $$('#stageCopy .ops button').forEach(btn => btn.addEventListener('click', () => { this.elapsed = +btn.dataset.b * this.BEAT; this.beat(+btn.dataset.b); }));
      const sc = $('#screen');
      if (real) {
        if (!this.reel || !sc.contains(this.reel.el)) {
          sc.innerHTML = '<div class="j-reel"></div><div class="j-fact"></div>';
          sc.classList.add('real'); this.reel = new Reel($('.j-reel', sc));
        }
        const f = $('.j-fact', sc); f.innerHTML = this.fact(k); f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop');
        this.b = -1; this.beat(0);
      } else {
        this.reel = null; sc.classList.remove('real');
        sc.innerHTML = this.screen(k);
      }
      this.state();
    },
    // Move the camera to beat b of the current step and tick the narrated list.
    beat(b) {
      const list = this.beats[this.i], [name, key] = list[Math.min(b, list.length - 1)];
      this.b = b;
      if (this.reel) this.reel.show(name, key, t('journey.ops')[this.i][b]);
      $$('#stageCopy .ops li').forEach((li, j) => { li.classList.toggle('now', j === b); li.classList.toggle('done', j < b); });
    },
    fact(k) {
      const u = t('journey.ui'), S = L.S, price = L.money(S.price);
      return [
        `<span class="pill new">● ${u.newOrder}</span><b>#1042</b><span>${esc(S.customer)} · ${price}</span>`,
        `<span>${u.stock}</span><s>${L.num(24)}</s><b>${L.num(23)}</b><span class="pill ok">✓ ${L.num(3)}</span>`,
        `<span class="pill ok">✓ ${u.paid}</span><b>${esc(S.pay)}</b><span>${price}</span>`,
        `<span class="pill info">${u.label}</span><b>${esc(S.courier)}</b><span>✓ ${u.print}</span>`,
        `<span class="pill info">LIVE</span><b>${u.out}</b>`,
        `<span class="pill ok">✓ ${u.delivered}</span><b>💬 ${t('journey.smsTo')}</b>`
      ][k] || '';
    },
    screen(k) {
      const u = t('journey.ui'), S = L.S, price = L.money(S.price);
      const prod = `<div class="prod"><div class="prod-img">${hoodie()}</div><div><b>${t('journey.product')}</b><br><small style="color:var(--ink-3)">${t('journey.variant')}</small></div></div>`;
      switch (k) {
        case 0: return `<div class="scard"><div class="row"><b>${u.newOrder} #1042</b><span class="pill new">● ${u.via} ${esc(S.channel)}</span></div>${prod}
          <div class="row"><span>${u.customer}</span><b>${esc(S.customer)} · ${esc(S.city)}</b></div><div class="row"><span>${u.total}</span><b class="big">${price}</b></div></div>
          <div class="chan-row">${[S.channel, u.website, S.market].map((c, i) => `<span style="animation-delay:${.2 + i * .1}s">${esc(c)}</span>`).join('')}</div>`;
        case 1: return `<div class="scard">${prod}<div class="row"><span>${u.stock} · ${esc(S.warehouse)}</span><div class="stock-num"><s>${L.num(24)}</s><b>${L.num(23)}</b></div></div>
          <div class="row"><span>${u.reserved}</span><span class="pill info">1 · #1042</span></div></div>
          <div class="scard"><span style="font-size:13px;color:var(--ink-3);font-weight:700">${u.syncedTo}</span><div class="chan-row">${[S.channel, u.website, S.market].map((c, i) => `<span class="ok" style="animation-delay:${.15 + i * .15}s">${esc(c)} · ${L.num(23)}</span>`).join('')}</div></div>`;
        case 2: return `<div class="scard"><div class="row"><b>${esc(S.pay)}</b><span class="pill ok">✓ ${u.paid}</span></div><div class="big">${price}</div>
          <div class="row"><span>${u.customer}</span><b>${esc(S.customer)}</b></div></div>
          <div class="scard"><div class="row"><b>${u.invoice} INV-1042</b><span class="pill info">${u.sent}</span></div></div>`;
        case 3: return `<div class="label-card"><span class="stamp">${u.print} ✓</span><b>${u.label} · ${esc(S.courier)}</b>
          <div class="row" style="display:flex;justify-content:space-between"><span style="color:var(--ink-3)">${u.shipTo}</span><b>${esc(S.customer)}, ${esc(S.city)}</b></div>
          <div class="row" style="display:flex;justify-content:space-between"><span style="color:var(--ink-3)">${u.weight}</span><b>${L.num(0.6)} kg</b></div><div class="barcode"></div><small style="color:var(--ink-3)">FS-1042-${esc(S.courier).slice(0, 3).toUpperCase()}</small></div>
          <div class="scard"><div class="row"><b>${u.packing}</b><span class="pill ok">✓</span></div></div>`;
        case 4: return `<div class="scard"><div class="row"><b>${u.tracking} · ${esc(S.courier)}</b><span class="pill info">LIVE</span></div>
          <ul class="track"><li class="done"><i></i>${u.picked}<small>09:12</small></li><li class="done" style="animation-delay:.15s"><i></i>${u.transit}<small>11:40</small></li><li class="now" style="animation-delay:.3s"><i></i>${u.out}<small>14:05</small></li><li style="animation-delay:.45s"><i></i>${u.delivered}</li></ul></div>`;
        default: return `<div class="scard delivered"><span class="tick">✓</span><div><b style="font-size:18px">${u.delivered}</b><br><small style="color:var(--ink-3)">#1042 · ${esc(S.city)}</small></div></div>
          <div class="sms">💬 ${u.sms}</div><div class="scard"><div class="row"><span>${u.review}</span><span class="stars-row">★★★★★</span></div></div>`;
      }
    }
  };

  /* ====================================================================
     5. INTEGRATIONS HUB
     ==================================================================== */
  const EXTRA_COURIERS = 6; // Janani, Sonar, SA Paribahan, Tiger, Shodagor, Sheba (in the app, not on the map)
  const Hub = {
    filter: 'all', sel: null, touched: false, cyc: null, visible: false,
    init() {
      watch($('#hubMap'), v => { this.visible = v; v ? this.autoCycle() : clearInterval(this.cyc); }, 0.3);
    },
    ids() { const g = L.R.integrations; return [...g.sell, ...g.pay, ...g.ship]; },
    statusOf(it) { return it.statusKey ? C.status[it.statusKey] : 'live'; },
    render() {
      $('#hubTabs').innerHTML = ['all', 'sell', 'pay', 'ship'].map(k => `<button type="button" role="tab" data-f="${k}" class="${k === this.filter ? 'on' : ''}">${t('hub.tabs.' + k)}</button>`).join('');
      $$('#hubTabs button').forEach(b => b.addEventListener('click', () => { this.filter = b.dataset.f; this.touched = true; this.render(); }));
      const ids = this.ids(), N = ids.length;
      const pos = this.layout(N);
      const grad = `<defs><linearGradient id="hubGrad" x1="0" x2="1"><stop offset="0" stop-color="#6B70FF"/><stop offset="1" stop-color="#09B0EE"/></linearGradient></defs>`;
      $('#hubLines').innerHTML = grad + ids.map((id, i) => {
        const [x, y] = pos[i], cx = (500 + x) / 2 + (y - 310) * .12, cy = (310 + y) / 2 - (x - 500) * .12;
        const d = `M500 310 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
        const dim = this.filter !== 'all' && C.integrationCatalog[id].kind !== this.filter ? 'dim' : '';
        const soon = this.statusOf(C.integrationCatalog[id]) === 'soon';
        const dot = RM || soon ? '' : `<circle r="3"><animateMotion dur="${(2.4 + (i % 5) * .45).toFixed(2)}s" repeatCount="indefinite" keyPoints="${i % 2 ? '0;1' : '1;0'}" keyTimes="0;1" calcMode="linear"><mpath href="#hp${i}"/></animateMotion></circle>`;
        return `<path id="hp${i}" d="${d}" class="${dim}"/><path d="${d}" class="flow ${id === this.sel ? 'on' : ''}" data-id="${id}"/>${dim ? '' : dot}`;
      }).join('');
      $('#hubNodes').innerHTML = ids.map((id, i) => {
        const it = C.integrationCatalog[id], st = this.statusOf(it);
        const dim = this.filter !== 'all' && it.kind !== this.filter ? 'dim' : '';
        const word = it.logo && it.mark === 'word';
        const face = word ? `<img class="lg-word" src="assets/img/logos/${it.logo}" alt="${esc(it.name)}" loading="lazy">`
          : `${this.tile(it)}${esc(it.short || it.name)}`;
        return `<button type="button" class="node ${word ? 'word' : ''} ${dim} ${id === this.sel ? 'on' : ''}" data-id="${id}" style="left:${pos[i][0] / 10}%;top:${pos[i][1] / 6.2}%" aria-label="${esc(it.name)}">${face}${st !== 'live' ? `<span class="soon">${t('hub.' + st)}</span>` : ''}</button>`;
      }).join('');
      $$('#hubNodes .node').forEach(n => {
        const pick = () => { this.touched = true; clearInterval(this.cyc); this.select(n.dataset.id); };
        n.addEventListener('click', pick);
        n.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) pick(); });
      });
      if (this.sel && !ids.includes(this.sel)) this.sel = null;
      this.detail();
    },
    /* Clockwise around a rectangle: top row, right column, bottom row, left
       column. Rows get the most nodes because that's where the width is. */
    layout(N) {
      const row = Math.min(5, Math.ceil(N * 0.3)), side = N - 2 * row, right = Math.ceil(side / 2), left = side - right;
      const spread = (n, a, b) => n === 1 ? [(a + b) / 2] : Array.from({ length: n }, (_, k) => a + (b - a) * k / (n - 1));
      return [
        ...spread(row, 120, 880).map(x => [x, 62]),
        ...spread(right, 175, 445).map(y => [895, y]),
        ...spread(row, 880, 120).map(x => [x, 558]),
        ...spread(left, 445, 175).map(y => [105, y])
      ];
    },
    tile(it, big) {
      return it.logo ? `<i class="lg-ic ${big ? 'big' : ''}"><img src="assets/img/logos/${it.logo}" alt="" loading="lazy"></i>`
        : `<i style="background:${it.color}">${esc(it.name[0])}</i>`;
    },
    select(id) {
      this.sel = id;
      $$('#hubNodes .node').forEach(n => n.classList.toggle('on', n.dataset.id === id));
      $$('#hubLines path.flow').forEach(p => p.classList.toggle('on', p.dataset.id === id));
      this.detail();
    },
    detail() {
      const box = $('#hubDetail');
      if (!this.sel) {
        const shown = this.ids().length, more = Object.keys(C.integrationCatalog).length - shown + EXTRA_COURIERS;
        box.innerHTML = `<div class="hub-empty"><span class="tap">👆</span><p>${t('hub.pick')}</p><span class="badge muted">${t('hub.more', { n: L.num(more) })}</span></div>`;
        return;
      }
      const it = C.integrationCatalog[this.sel], st = this.statusOf(it);
      const all = ['products', 'orders', 'inventory', 'payments', 'shipping'];
      box.innerHTML = `<div class="hd-top">${it.logo ? `<i class="hd-logo"><img src="assets/img/logos/${it.logo}" alt=""></i>` : `<i style="background:${it.color}">${esc(it.name[0])}</i>`}<div><b>${esc(it.name)}</b><span>${t('hub.kinds.' + it.kind)}</span></div></div>
        <p>${t('hub.detail.' + it.kind, { name: esc(it.name) })}</p>
        <span class="hd-h">${t('hub.whatSyncs', { name: esc(it.name) })}</span>
        <ul class="sync-list">${all.map((k, j) => `<li class="${it.sync.includes(k) ? '' : 'off'}" style="animation-delay:${j * 60}ms">${it.sync.includes(k) ? '✓' : '–'} ${t('hub.sync.' + k)}${it.sync.includes(k) ? `<span class="dir">${it.two ? '⇄' : '→'}</span>` : ''}</li>`).join('')}</ul>
        <div class="badges">${st !== 'live' ? `<span class="badge muted">${t('hub.' + st)}</span>` : ''}<span class="badge">${it.two ? t('hub.twoWay') : t('hub.oneWay')}</span><span class="badge alt">${it.hook ? '⚡ ' + t('hub.webhook') : t('hub.poll')}</span></div>`;
    },
    autoCycle() {
      if (this.touched || RM || this.cyc) return;
      let k = 0;
      this.cyc = setInterval(() => {
        if (this.touched || !this.visible) { clearInterval(this.cyc); this.cyc = null; return; }
        const ids = this.ids().filter(id => this.statusOf(C.integrationCatalog[id]) === 'live');
        this.select(ids[k++ % ids.length]);
      }, 2600);
    }
  };

  /* ====================================================================
     6. AI STORE BUILDER
     ==================================================================== */
  /* The Theme Builder replica lives in builder.js. This module only renders
     the real storefront theme gallery under it. */
  const Themes = {
    render() { this.renderTemplates(); },
    renderTemplates() {
      $('#templates').innerHTML = t('builder.templates').map(x => `<button type="button" class="tpl" data-t="${x.id}">
        <span class="tpl-shot"><img src="assets/img/themes/${x.id}.webp" alt="${esc(x.name)}" loading="lazy" decoding="async"></span>
        <b>${x.name}</b><span>${x.d}</span><em>${t('builder.open')} ↗</em></button>`).join('');
      $$('#templates .tpl').forEach(b => {
        const img = $('img', b), frame = $('.tpl-shot', b);
        const measure = () => {        // how far to scroll on hover, and how long it takes
          const d = Math.max(0, img.getBoundingClientRect().height - frame.clientHeight);
          b.style.setProperty('--scroll', -d + 'px'); b.style.setProperty('--dur', Math.min(9, 1 + d / 260) + 's');
        };
        img.complete ? measure() : img.addEventListener('load', measure);
        addEventListener('resize', measure, { passive: true });
        b.addEventListener('click', () => Lightbox.open(img.src, img.alt));
      });
    }
  };

  /* ====================================================================
     7. MESSAGING INBOX – scripted, visitor-driven, auto-advances when idle
     ==================================================================== */
  const CHN = { messenger: ['#0084FF', 'm'], whatsapp: ['#25D366', 'w'], instagram: ['#E1306C', 'i'], web: ['#09B0EE', '⌘'] };
  const Inbox = {
    th: 0, step: 0, human: false, idle: null, visible: false, run: 0, started: false,
    init() {
      watch($('#inboxApp'), v => { this.visible = v; if (v && !this.started) { this.started = true; this.play(0); } else this.arm(); }, 0.35);
    },
    render() {
      const st = C.status.messagingInbox;
      $('#inboxStatus').textContent = st === 'live' ? '' : t('inbox.status.' + st);
      $('#ibFilter').innerHTML = `<span>${t('inbox.all')}</span>` + Object.keys(CHN).map(k => `<span><span class="ch-dot" style="background:${CHN[k][0]}"></span>${t('inbox.channels.' + k)}</span>`).join('');
      this.renderThreads();
      $('#benefits').innerHTML = t('inbox.benefits').map((b, i) => `<div class="ben"><span class="bi">${['📥', '✦', '🛒', '🙋'][i]}</span><b>${b.t}</b><span>${b.d}</span></div>`).join('');
      $('#ibComposer').textContent = t('inbox.composer');
      if (this.started) this.play(this.th);
    },
    renderThreads() {
      $('#ibThreads').innerHTML = t('inbox.threads').map((x, i) => {
        const [col, ic] = CHN[x.ch];
        const handled = i > 0 ? `<span class="done">✓ ${t('inbox.autoHandled')}</span>` : `<span>${esc(x.preview)}</span>`;
        return `<li class="${i === this.th ? 'on' : ''}"><button type="button" data-th="${i}"><span class="ib-av">${esc(x.who[0])}<span class="chb" style="background:${col}">${ic}</span></span><span class="ib-meta"><b>${esc(x.who)} <small>${x.time}</small></b>${handled}</span>${i === 0 && this.step < 1 ? '<span class="unread"></span>' : ''}</button></li>`;
      }).join('');
      $$('#ibThreads button').forEach(b => b.addEventListener('click', () => this.play(+b.dataset.th)));
    },
    head() {
      const x = t('inbox.threads')[this.th];
      $('#ibHead').innerHTML = `<span class="ib-av">${esc(x.who[0])}<span class="chb" style="background:${CHN[x.ch][0]}">${CHN[x.ch][1]}</span></span><div><b>${esc(x.who)}</b><span>${t('inbox.channels.' + x.ch)}</span></div>
        <button type="button" class="take ${this.human ? 'human' : ''}" id="takeBtn"><span class="lbl">${this.human ? t('inbox.actions.handBack') : t('inbox.actions.takeOver')}</span><span class="sw"></span></button>`;
      $('#takeBtn').addEventListener('click', () => this.toggleHuman());
    },
    add(html) { const m = $('#ibMsgs'); m.insertAdjacentHTML('beforeend', html); m.scrollTop = m.scrollHeight; },
    async typing(ms, side = 'cust') {
      this.add(`<div class="typing ${side}" id="ibTyping"><i></i><i></i><i></i></div>`);
      await wait(ms); const ty = $('#ibTyping'); if (ty) ty.remove();
    },
    actions(list) {
      $('#ibActions').innerHTML = list.map(([k, next]) => `<button type="button" data-act="${k}" class="${next ? 'next' : ''}">${t('inbox.actions.' + k)}</button>`).join('') +
        (list.some(a => a[1]) ? `<span class="hint">${t('inbox.hint')}</span>` : '');
      $$('#ibActions button').forEach(b => b.addEventListener('click', () => this.act(b.dataset.act, true)));
      this.arm();
    },
    arm() { // advance by itself if the visitor just watches
      clearTimeout(this.idle);
      if (!this.visible || RM) return;
      const nx = $('#ibActions .next');
      if (nx) this.idle = setTimeout(() => this.act(nx.dataset.act, false), 6500);
    },
    toggleHuman() {
      this.human = !this.human; this.head();
      this.add(`<div class="sys">${this.human ? t('inbox.youInControl') : '✦ ' + t('inbox.actions.handBack')}</div>`);
    },
    async play(th) {
      const run = ++this.run; clearTimeout(this.idle);
      this.th = th; this.step = 0; this.human = false;
      $('#ibMsgs').innerHTML = ''; $('#ibActions').innerHTML = '';
      this.renderThreads(); this.head();
      const c = t('inbox.convo');
      if (th > 0) { // already handled by AI
        const [q, a] = t('inbox.auto.t' + (th + 1));
        this.add(`<div class="b cust">${esc(q)}</div>`);
        this.add(`<div class="b mer ai"><span class="by">✦ AI</span>${a}</div>`);
        this.add(`<div class="sys ok">✓ ${t('inbox.autoHandled')}</div>`);
        this.actions([['replay', false]]); return;
      }
      await this.typing(900); if (run !== this.run) return;
      this.add(`<div class="b cust">${c.c1}</div>`);
      await wait(700); if (run !== this.run) return;
      this.add(`<div class="suggest" id="suggest"><span class="by">✦ ${c.aiTag}</span><span id="sugText">${c.ai1}</span></div>`);
      this.actions([['send', true], ['edit', false]]);
    },
    async act(k, manual) {
      clearTimeout(this.idle);
      const run = this.run, c = t('inbox.convo');
      const alive = () => run === this.run;
      if (k === 'replay') return this.play(this.th);
      if (k === 'edit') {
        const s = $('#sugText'); if (!s) return;
        s.contentEditable = 'true'; s.focus();
        document.getSelection().selectAllChildren(s); document.getSelection().collapseToEnd();
        return;
      }
      $('#ibActions').innerHTML = '';
      if (k === 'send') {
        const s = $('#sugText'); const txt = s ? s.textContent : '';
        $('#suggest') && $('#suggest').remove();
        this.add(`<div class="b mer ${this.human ? '' : 'ai'}">${this.human ? '' : '<span class="by">✦ AI</span>'}${esc(txt)}</div>`);
        await this.typing(1000); if (!alive()) return;
        this.add(`<div class="b cust">${c.c2}</div>`);
        this.step = 1; this.renderThreads();
        return this.actions([['createOrder', true]]);
      }
      if (k === 'createOrder') {
        this.add(`<div class="ocard"><span class="ic">🧾</span><span>${c.orderCard}<small>${L.money(L.S.price)}</small></span></div>`);
        await wait(500); if (!alive()) return;
        return this.actions([['payLink', true]]);
      }
      if (k === 'payLink') {
        this.add(`<div class="ocard"><span class="ic">💳</span><span>${c.payCard}</span></div>`);
        await wait(1300); if (!alive()) return;
        this.add(`<div class="sys ok">${c.paid}</div>`);
        return this.actions([['tracking', true]]);
      }
      if (k === 'tracking') {
        this.add(`<div class="ocard paid"><span class="ic">🚚</span><span>${c.trackCard}</span></div>`);
        await this.typing(1100); if (!alive()) return;
        this.add(`<div class="b cust">${c.c3}</div>`);
        return this.actions([['replay', false]]);
      }
    }
  };

  /* ====================================================================
     8. PROOF · ROI · PRICING · FAQ · CONTACT
     ==================================================================== */
  const Proof = {
    init() {
      const tr = $('#loveTrack'), step = () => ($('.quote', tr)?.offsetWidth || 300) + 16;
      $('#lNext').addEventListener('click', () => tr.scrollBy({ left: step(), behavior: 'smooth' }));
      $('#lPrev').addEventListener('click', () => tr.scrollBy({ left: -step(), behavior: 'smooth' }));
    },
    render() {
      $('#loveTrack').innerHTML = t('proof.quotes').map(([n, r, q]) => `<figure class="quote"><span class="stars">★★★★★</span><p>“${q}”</p><figcaption class="who"><i>${esc(n.split(' ').map(w => w[0]).slice(0, 2).join(''))}</i><div><b>${n}</b><span>${r}</span></div></figcaption></figure>`).join('');
    }
  };

  const Plans = {
    pick() {
      if (!P.set) return null;
      const n = P.channels.length, shop = P.channels.includes('shop');
      if (P.starter || n <= 1 && !shop) return 'launch';
      if (n >= 4) return 'empire';
      return 'growth';
    },
    forOrders(perDay) { const mo = perDay * 30; return L.R.plans.find(p => !p.custom && p.inv >= mo) || L.R.plans.find(p => p.custom); }
  };

  const ROI = {
    init() { ['rOrders', 'rHours', 'rTools'].forEach(id => $('#' + id).addEventListener('input', () => this.calc())); },
    render() {
      const r = L.R.roi, el = $('#rTools');
      if (el.dataset.region !== L.region) { el.max = r.toolsMax; el.step = r.toolsStep; el.value = r.toolsDefault; el.dataset.region = L.region; }
      this.calc();
    },
    calc() {
      const o = +$('#rOrders').value, h = +$('#rHours').value, tl = +$('#rTools').value;
      $('#oOut').textContent = L.num(o); $('#hOut').textContent = t('roi.hUnit', { n: tidy(h) }); $('#tOut').textContent = L.money(tl);
      const saved = Math.round(h * 26 * .6);
      $('#roiHours').textContent = t('roi.hoursUnit', { n: L.num(saved) });
      $('#roiDays').textContent = t('roi.days', { n: L.num(Math.max(1, Math.round(saved / 8))) });
      $('#roiTools').textContent = L.money(tl);
      const p = Plans.forOrders(o);
      $('#roiPlan').textContent = t('pricing.plans.' + p.id + '.name');
      $('#roiPlanSub').textContent = p.custom ? t('roi.planCustom') : t('roi.plan', { n: L.num(o) });
    }
  };

  const Pricing = {
    months: 12,
    init() { if (L.R.pricesConfirmed === false) console.warn('[FullStro] Global USD prices in config.js are placeholders.'); },
    render() {
      $('#dur').innerHTML = [1, 3, 6, 12].map(m => `<button type="button" data-m="${m}" class="${m === this.months ? 'on' : ''}">${t('pricing.durations.' + m)}${m === 12 ? ` <small>${t('pricing.best')}</small>` : ''}</button>`).join('');
      $$('#dur button').forEach(b => b.addEventListener('click', () => { this.months = +b.dataset.m; this.render(); }));
      const pickId = Plans.pick(), m = this.months, trial = L.R.links.trial;
      $('#plans').innerHTML = L.R.plans.map(p => {
        const d = t('pricing.plans.' + p.id, { team: L.num(p.team || 0), wh: L.num(p.wh || 0), inv: L.num(p.inv || 0) });
        const isPick = p.id === pickId, isPop = !pickId && p.popular;
        const badge = isPick ? `<span class="badge-top">${t('pricing.pick')}</span>` : isPop ? `<span class="badge-top">${t('pricing.popular')}</span>` : '';
        const feats = `<ul>${d.feats.map(f => `<li>${f}</li>`).join('')}</ul>`;
        if (p.custom) return `<div class="plan dark ${isPick ? 'pick' : ''}">${badge}<h3>${d.name}</h3><p class="tag">${d.tag}</p><div class="price"><b>${t('pricing.custom')}</b><span>${t('pricing.customSub')}</span></div>${feats}<a class="btn btn-white" href="${L.R.links.contact}" target="_blank" rel="noopener">${t('pricing.discuss')}</a></div>`;
        const pr = p.price[m], was = p.was[m];
        return `<div class="plan ${isPick ? 'pick' : ''}">${badge}<h3>${d.name}</h3><p class="tag">${d.tag}</p>
          <div class="price"><b>${L.money(Math.round(pr / m * 100) / 100)}</b><span>${t('pricing.perMonth')}</span><s>${m > 1 ? t('pricing.billed', { total: L.money(pr), n: L.num(m) }) + ' · ' : ''}<del>${t('pricing.was', { was: L.money(was) })}</del></s></div>
          <span class="save">${t('pricing.save', { amt: L.money(was - pr) })}</span>${feats}
          <a class="btn ${isPick || isPop ? 'btn-primary' : 'btn-ghost'}" href="${trial}" target="_blank" rel="noopener">${t('pricing.trial')}</a></div>`;
      }).join('');
      $('#priceSub').innerHTML = pickId ? t('pricing.subPick', { plan: t('pricing.plans.' + pickId + '.name') }) : t('pricing.sub');
      $('#regionNote').innerHTML = L.region === 'bd' ? t('pricing.regionBd') : t('pricing.regionGlobal');
      $('#priceFoot').innerHTML = t('pricing.foot').map(f => `<span>${f}</span>`).join('');
    }
  };

  const FAQ = {
    render() {
      $('#faqList').innerHTML = t('faq.items').map(([q], i) => `<div class="qa"><button type="button" aria-expanded="false" data-q="${i}">${q}</button><div class="ans"></div></div>`).join('');
      $$('#faqList .qa button').forEach(b => b.addEventListener('click', () => {
        const qa = b.parentElement, open = qa.classList.toggle('open'), ans = $('.ans', qa);
        b.setAttribute('aria-expanded', open);
        if (open && !ans.dataset.done) {
          ans.dataset.done = 1; ans.innerHTML = '<div class="typing"><i></i><i></i><i></i></div>';
          setTimeout(() => { ans.innerHTML = `<div class="b bot">${t('faq.items')[+b.dataset.q][1]}</div>`; }, RM ? 0 : 600);
        }
      }));
    }
  };

  const Contact = {
    render() {
      const c = L.R.contact;
      $('#contactList').innerHTML = `<a href="${c.whatsapp}" target="_blank" rel="noopener"><span>💬</span>${t('final.whatsapp')}</a>
        <a href="${c.messenger}" target="_blank" rel="noopener"><span>📨</span>${t('final.messenger')}</a>
        <a href="tel:${c.phone}"><span>📞</span>${c.phoneLabel}</a><div><span>📍</span>${esc(c.address)}</div>`;
      const s = C.links.social;
      $('#social').innerHTML = [['facebook', 'f'], ['instagram', 'ig'], ['linkedin', 'in'], ['youtube', '▶'], ['x', '𝕏']]
        .map(([k, g]) => `<a href="${s[k]}" target="_blank" rel="noopener" aria-label="${k}">${g}</a>`).join('');
    }
  };

  /* ====================================================================
     FLOATING STRO – one remark per section, never twice
     ==================================================================== */
  const Tips = {
    shown: new Set(), dismissed: false, heroVis: true, agentVis: false,
    init() {
      const dock = $('#dock');
      watch($('#top'), v => { this.heroVis = v; this.sync(); }, 0.12);
      watch($('#agent'), v => { this.agentVis = v; this.sync(); }, 0.3);
      const tipIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) this.say(e.target.id); }), { threshold: .4 });
      ['story', 'journey', 'hub', 'builder', 'inbox', 'pricing', 'faq'].forEach(id => tipIO.observe($('#' + id)));
      $('#tipX').addEventListener('click', e => { e.stopPropagation(); this.dismissed = true; this.hide(); });
      $('#tip').addEventListener('click', () => this.go());
      $('#dockBtn').addEventListener('click', () => this.go());
      dock.classList.remove('show');
    },
    sync() {
      $('#dock').classList.toggle('show', !this.heroVis && !this.agentVis);
      if (this.heroVis || this.agentVis) this.hide();
      if (!this.heroVis) this.regionHint();
    },
    regionHint() {
      if (['edge', 'timezone', 'browser'].includes(L.regionSource) && !store.get('fs_region_tip')) {
        store.set('fs_region_tip', 1);
        this.show(t('tips.regionAuto', { region: t(L.region === 'bd' ? 'nav.regionBd' : 'nav.regionGlobal'), currency: L.R.currency }));
      }
    },
    say(id) {
      if (this.shown.has(id)) return;
      let key = id;
      if (id === 'pricing') key = Plans.pick() ? 'pricing' : 'pricingNoPick';
      this.shown.add(id); this.show(t('tips.' + key));
    },
    reset(id) { this.shown.delete(id); },
    show(html) {
      if (this.dismissed || this.heroVis || this.agentVis) return;
      $('#tipText').innerHTML = html; $('#tip').classList.add('show'); $('#dockBtn').classList.add('ping');
      clearTimeout(this._h); this._h = setTimeout(() => this.hide(), 6500);
    },
    hide() { $('#tip').classList.remove('show'); },
    go() {
      this.hide(); $('#dockBtn').classList.remove('ping');
      $('#agent').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      setTimeout(() => $('#chatInput').focus({ preventScroll: true }), RM ? 0 : 700);
    }
  };

  /* ====================================================================
     BOOT
     ==================================================================== */
  const modules = [HeroBg, Hero, Goal, Modal, Story, Stro, Journey, Hub, Themes, Inbox, Proof, ROI, Pricing, FAQ, Contact, Strips];
  const renderAll = () => { applyStatic(); modules.forEach(m => m.render && m.render()); };
  modules.forEach(m => m.init && m.init());
  Tips.init();
  renderAll();
  L.syncUrl();
  L.on(renderAll);
  Shots.load().then(m => { if (m) { Hero.render(); Journey.go(Journey.i); Strips.render(); } });
})();

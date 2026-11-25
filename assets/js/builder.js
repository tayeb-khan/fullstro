/* ==========================================================================
   FullStro Theme Builder – homepage replica
   Mirrors the real builder in saas-tenant-app (components/storefront/ThemeBuilder):
   toolbar · Pages/Layouts nav with draggable section list · canvas with a
   floating section toolbar · Content/Appearance inspector · Add-section
   library · image menu + "Choose a file" library · Theme styles colours with
   a colour picker · AI Theme Assistant drawer · device preview · Publish.

   An autopilot plays a scripted session with a visible cursor. It drives the
   exact same functions a visitor uses, and stops the moment the visitor
   touches anything. The builder chrome stays in English, as in the real app;
   the narration follows the page language.
   ========================================================================== */
(function () {
  'use strict';
  const L = window.FS_LOCALE;
  const root = document.getElementById('tbx');
  if (!root || !L) return;
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];
  const t = (p, v) => L.t(p, v);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = 'assets/img/builder/';
  let uid = 0; const nid = () => 's' + (++uid);

  /* ------------------------------------------------------------------ icons */
  const ic = {
    back: '<path d="M15 6l-6 6 6 6"/>', spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
    cloud: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18"/><path d="M12 12v8M9 15l3-3 3 3"/>', chev: '<path d="M6 9l6 6 6-6"/>',
    pages: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>', layouts: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    desktop: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>', tablet: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M11 18h2"/>', mobile: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    bucket: '<path d="M4 13l7-7 7 7-7 7z"/><path d="M11 6L8 3M20 16s2 2.5 2 3.5a2 2 0 0 1-4 0c0-1 2-3.5 2-3.5z"/>', up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', folder: '<path d="M3 6h6l2 2h10v11H3z"/>', check: '<path d="M5 12l5 5 9-10"/>'
  };
  const svg = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ic[n]}</svg>`;

  /* -------------------------------------------------------------- catalogue */
  // Section types: name, icon (glyph + colour, as in sectionIcons.jsx), registry key
  const TYPES = {
    ticker:     ['Scrolling Ticker', '⇆', '#E8590C', 'marquee_ticker'],
    hero:       ['Hero', 'T', '#2F6FED', 'hero_slider'],
    promo:      ['Promo Grid', '▦', '#7C5CFC', 'promo_grid'],
    best:       ['Best Selling', '🔥', '#E8590C', 'best_selling'],
    reviews:    ['Reviews', '☆', '#E8590C', 'reviews'],
    newsletter: ['Newsletter', '📣', '#12B76A', 'newsletter'],
    categories: ['Categories', '▦', '#C026D3', 'categories'],
    brands:     ['Brand Grid', '▦', '#667085', 'brand_grid'],
    bought:     ['Bought Together', '🎁', '#2F6FED', 'bought_together'],
    text:       ['Text', '≡', '#344054', 'rich_text'],
    button:     ['Button', '⌁', '#2F6FED', 'button']
  };
  const LIBRARY = [
    ['BASIC', ['button', 'text']],
    ['COMMERCE', ['best', 'bought', 'brands', 'categories']],
    ['MARKETING', ['ticker', 'hero', 'promo', 'reviews', 'newsletter']]
  ];
  const FILES = [
    ['hoodie-1b1d29', 'black-hoodie.png', '#EFE7DC'], ['hoodie-c9b79c', 'sand-hoodie.png', '#E9EEF3'],
    ['hoodie-2f6f6b', 'pine-hoodie.png', '#EDEAE2'], ['vest-2e3a59', 'puffer-vest.png', '#E6ECF5'],
    ['windbreaker-2f6f6b', 'windbreaker.png', '#ECEFEA'], ['crew-8e939e', 'grey-crewneck.png', '#F1EFEA'],
    ['joggers-5b5f45', 'cargo-joggers.png', '#EEEDE6'], ['beanie-b5452d', 'beanie.png', '#F3ECE6']
  ];
  const PRESETS = ['#1B1D29', '#2E3192', '#C2410C', '#0F766E', '#7C3AED', '#BE185D', '#C8A96A', '#0E7490'];
  const PROD = [
    ['Black Hoodie', '400gsm brushed fleece', 1850, 'hoodie-1b1d29', '#2B2E44'],
    ['Cargo Joggers', 'Relaxed, tapered', 1650, 'joggers-5b5f45', '#4A4D35'],
    ['Puffer Vest', 'Water-resistant', 2450, 'vest-2e3a59', '#243055'],
    ['Grey Crewneck', 'Loopback cotton', 1450, 'crew-8e939e', '#5D6370']
  ];
  const price = bd => L.money(L.region === 'bd' ? bd : Math.round(bd / 38));

  function defaults(type, brand) {
    switch (type) {
      case 'ticker': return { words: [['Free delivery over ' + price(2000), 'solid', false], ["Winter '26 drop is live", 'outline', true], [L.region === 'bd' ? 'Pay with bKash or cash on delivery' : 'Free returns within 30 days', 'solid', false]] };
      case 'hero': return { eyebrow: "WINTER DROP '26", heading: 'Made for cold mornings.', sub: 'Heavyweight basics, built to last.', cta: 'Shop the drop', image: 'hoodie-1b1d29', bg: '#EFE7DC', height: 300, edge: false };
      case 'promo': return { title: 'Shop the essentials', cards: PROD.slice(0, 3).map(p => p[0]) };
      case 'best': return { title: 'Best sellers', cols: 4 };
      case 'reviews': return { title: 'Loved by 1,200+ customers', stars: true };
      case 'newsletter': return { title: 'Get first dibs on new drops', sub: 'One email a month. No spam.', cta: 'Subscribe', bg: '#0F1B3D' };
      case 'categories': return { title: 'Shop by category' };
      case 'brands': return { title: 'As seen in' };
      case 'bought': return { title: 'Frequently bought together' };
      case 'text': return { body: `${brand} makes fewer, better pieces. Heavyweight fabrics, honest prices, made to be worn every day.` };
      case 'button': return { label: 'Shop all products' };
    }
    return {};
  }
  const mk = (type, brand) => ({ id: nid(), type, s: defaults(type, brand), space: [28, 28], hidden: {} });

  /* ------------------------------------------------------------------ state */
  const S = {
    brand: 'Northline', sections: [], sel: null, tab: 'content', device: 'desktop', pane: 'canvas',
    theme: { primary: '#1B1D29', secondary: '#FFFFFF', accent: '#C8A96A', page: '#FFFFFF' },
    status: 'draft', preview: false
  };
  const fullStore = () => ['ticker', 'hero', 'promo', 'reviews', 'newsletter'].map(x => mk(x, S.brand));
  const sec = id => S.sections.find(x => x.id === id);

  /* ------------------------------------------------------------------ shell */
  root.innerHTML = `
  <div class="tbx-win">
    <div class="tbx-bar"><i></i><i></i><i></i><span class="tbx-url">app.fullstro.com/store-front/themes/modern-clean/builder</span></div>
    <div class="tbx-toolbar">
      <div class="tbx-toolbar__lead"><button class="tbx-ib" data-act="noop" aria-label="Back">${svg('back')}</button><b class="tbx-title">Modern Clean</b><span class="tbx-status" id="tbxStatus"></span></div>
      <div class="tbx-toolbar__actions">
        <button class="tbx-btn tbx-ai" data-act="ai">${svg('spark')}<span>Build with AI</span></button>
        <button class="tbx-btn tbx-ghost hide-sm" data-act="history">${svg('history')}<span>History</span></button>
        <button class="tbx-btn tbx-ghost hide-sm" data-act="settings">${svg('gear')}<span>Theme Settings</span>${svg('chev', 'sm')}</button>
        <span class="tbx-rule hide-sm"></span>
        <button class="tbx-btn tbx-out hide-sm" data-act="preview">${svg('eye')}<span>Preview</span></button>
        <button class="tbx-btn tbx-out hide-xs" data-act="save">${svg('save')}<span>Save</span></button>
        <button class="tbx-btn tbx-primary" data-act="publish">${svg('cloud')}<span>Publish</span></button>
      </div>
    </div>
    <div class="tbx-panes" role="tablist"><button data-pane="nav">Sections</button><button data-pane="canvas">Preview</button><button data-pane="inspect">Edit</button></div>
    <div class="tbx-body">
      <aside class="tbx-nav">
        <div class="tbx-seg"><button class="on">${svg('pages')}Pages</button><button data-act="noop">${svg('layouts')}Layouts</button></div>
        <div class="tbx-scope"><span>Home <em id="tbxCount">0</em></span>${svg('chev', 'sm')}</div>
        <button class="tbx-add" data-act="add">${svg('plus')}Add section</button>
        <ul class="tbx-list" id="tbxList"></ul>
      </aside>
      <main class="tbx-main">
        <div class="tbx-canvasbar">
          <span class="tbx-crumb"><b>Home</b><small id="tbxCount2"></small></span>
          <span class="tbx-devices">${['desktop', 'tablet', 'mobile'].map(d => `<button data-device="${d}" aria-label="${d}">${svg(d)}</button>`).join('')}</span>
          <button class="tbx-ib" data-act="styles" aria-label="Theme styles">${svg('bucket')}</button>
        </div>
        <div class="tbx-scroll"><div class="tbx-frame" id="tbxFrame"></div></div>
      </main>
      <aside class="tbx-insp" id="tbxInsp"></aside>
    </div>
    <div class="tbx-layer" id="tbxLayer"></div>
    <div class="tbx-toast" id="tbxToast"></div>
    <div class="tbx-cursor" id="tbxCursor" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 2.5l14 8.2-6.3 1.6-3.2 6.2z"/></svg></div>
  </div>
  <div class="tbx-narr" aria-live="polite"><span class="tbx-narr__dot"></span><span id="tbxNarr"></span><button class="tbx-demo" id="tbxDemo" hidden></button></div>`;

  const frame = $('#tbxFrame'), list = $('#tbxList'), insp = $('#tbxInsp'), layer = $('#tbxLayer');

  /* -------------------------------------------------------------- renderers */
  function storefront(x) {
    const s = x.s, th = S.theme;
    switch (x.type) {
      case 'ticker': {
        const words = s.words.map(([w, st, brand]) => `<span class="sf-word ${st} ${brand ? 'brand' : ''}">${esc(w)}</span>`).join('');
        return `<div class="sf-ticker"><div class="sf-ticker__track">${words}${words}${words}</div></div>`;
      }
      case 'hero': {
        const img = s.image.startsWith('blob:') || s.image.startsWith('http') ? s.image : IMG + s.image + '.svg';
        return `<div class="sf-hero ${s.edge ? 'edge' : ''}" style="--hbg:${s.bg};min-height:${s.height}px">
          <div class="sf-hero__copy"><span class="sf-eyebrow">${esc(s.eyebrow)}</span><h3 data-f="heading">${esc(s.heading)}</h3><p>${esc(s.sub)}</p><span class="sf-btn">${esc(s.cta)}</span></div>
          <div class="sf-hero__art"><span class="sf-hero__circle"></span><img class="sf-hero__img" src="${img}" alt=""><img class="sf-hero__beanie" src="${IMG}beanie-b5452d.svg" alt=""></div></div>`;
      }
      case 'promo': return `<div class="sf-wrap"><h4>${esc(s.title)}</h4><div class="sf-promo">${PROD.slice(0, 3).map((p, i) =>
        `<div class="sf-card" style="--c:${p[4]}"><b>${esc(s.cards[i] || p[0])}</b><small>${p[1]}</small><small>${price(p[2])}</small><span class="sf-pill">Shop now</span></div>`).join('')}</div></div>`;
      case 'best': return `<div class="sf-wrap"><h4>${esc(s.title)}</h4><div class="sf-grid c${s.cols}">${PROD.slice(0, s.cols).map(p =>
        `<div class="sf-prod"><span class="sf-prod__img"><img src="${IMG}${p[3]}.svg" alt=""></span><b>${p[0]}</b><small>${price(p[2])}</small><span class="sf-btn sm">Add to cart</span></div>`).join('')}</div></div>`;
      case 'reviews': return `<div class="sf-wrap"><h4>${esc(s.title)}</h4><div class="sf-reviews">${[
        [L.S.customer3 || 'Tasnim', 'Softest hoodie I own. Wearing it right now.'], [L.S.customer2 || 'Rafi', 'Ordered at night, got it the next afternoon.'], ['Mim', 'Swapped M for L in two days. Easy.']].map(([n, q]) =>
        `<div class="sf-rev">${s.stars ? '<span class="sf-stars">★★★★★</span>' : ''}<p>${esc(q)}</p><span class="sf-who"><i></i>${esc(n)}</span></div>`).join('')}</div></div>`;
      case 'newsletter': return `<div class="sf-news" style="--nbg:${s.bg}"><b>${esc(s.title)}</b><small>${esc(s.sub)}</small><span class="sf-news__form"><span>Enter your email</span><span class="sf-btn inv">${esc(s.cta)}</span></span></div>`;
      case 'categories': return `<div class="sf-wrap"><h4>${esc(s.title)}</h4><div class="sf-cats">${['Hoodies', 'Outerwear', 'Bottoms', 'Accessories'].map((c, i) =>
        `<span class="sf-cat"><span><img src="${IMG}${['hoodie-1b1d29', 'vest-2e3a59', 'joggers-5b5f45', 'beanie-b5452d'][i]}.svg" alt=""></span>${c}</span>`).join('')}</div></div>`;
      case 'brands': return `<div class="sf-wrap"><h4>${esc(s.title)}</h4><div class="sf-brands"><b>VOGUE</b><b>HYPEBEAST</b><b>GQ</b><b>Highsnobiety</b></div></div>`;
      case 'bought': return `<div class="sf-wrap"><h4>${esc(s.title)}</h4><div class="sf-bought">${[PROD[0], PROD[1]].map(p => `<span class="sf-prod__img"><img src="${IMG}${p[3]}.svg" alt=""></span>`).join('<b>+</b>')}<div><small>Total</small><b>${price(PROD[0][2] + PROD[1][2])}</b><span class="sf-btn sm">Add both</span></div></div></div>`;
      case 'text': return `<div class="sf-wrap sf-text"><p>${esc(s.body)}</p></div>`;
      case 'button': return `<div class="sf-wrap sf-center"><span class="sf-btn">${esc(s.label)}</span></div>`;
    }
    return '';
  }

  function renderFrame(flash) {
    const th = S.theme;
    frame.style.cssText = `--p:${th.primary};--sec:${th.secondary};--a:${th.accent};--pg:${th.page}`;
    frame.dataset.device = S.device;
    if (!S.sections.length) {
      frame.innerHTML = `<div class="tbx-empty"><span>${svg('spark')}</span><b>This page is empty</b><small>Build it with AI, or add your first section.</small></div>`;
      return;
    }
    frame.innerHTML = `<div class="sf-nav"><b>${esc(S.brand)}</b><span>Shop</span><span>New in</span><span>About</span><i>🛍</i></div>` +
      S.sections.map((x, i) => `<div class="tbx-sec ${x.id === S.sel ? 'sel' : ''} ${x.id === flash ? 'flash' : ''}" data-id="${x.id}" style="--sa:${x.space[0] / 2}px;--sb:${x.space[1] / 2}px">
        ${x.id === S.sel ? `<div class="tbx-sec__bar"><span class="ord">${i + 1}</span><span class="nm">${TYPES[x.type][0].toUpperCase()}</span>
          <button data-sa="up" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${svg('up')}</button><button data-sa="down" ${i === S.sections.length - 1 ? 'disabled' : ''} aria-label="Move down">${svg('down')}</button>
          <button data-sa="ai" class="ai" aria-label="Rewrite with AI">${svg('spark')}</button><button data-sa="gear" aria-label="Settings">${svg('gear')}</button><button data-sa="del" class="del" aria-label="Delete">${svg('trash')}</button></div>` : ''}
        <div class="tbx-sec__body">${storefront(x)}</div></div>`).join('');
  }

  function renderList() {
    list.innerHTML = S.sections.map(x => `<li class="tbx-item ${x.id === S.sel ? 'sel' : ''}" data-id="${x.id}">
      <span class="tbx-item__handle" aria-label="Drag">${svg('grip')}</span><span class="tbx-item__ic" style="color:${TYPES[x.type][2]}">${TYPES[x.type][1]}</span><span class="tbx-item__lb">${TYPES[x.type][0]}</span></li>`).join('');
    $('#tbxCount').textContent = S.sections.length;
    $('#tbxCount2').textContent = `${S.sections.length} sections`;
  }

  const field = (label, k, v, attrs = '') => `<label class="tbx-f"><span>${label}</span><input data-k="${k}" value="${esc(v)}" ${attrs}></label>`;
  const swatch = (label, k, v, hint = '') => `<div class="tbx-f tbx-f--row"><span>${label}</span><button class="tbx-sw" data-color="${k}"><i style="background:${v}"></i>${v.toUpperCase()}</button>${hint ? `<small>${hint}</small>` : ''}</div>`;
  const toggle = (label, k, on) => `<div class="tbx-f tbx-f--row"><span>${label}</span><button class="tbx-tg ${on ? 'on' : ''}" data-tg="${k}" role="switch" aria-checked="${!!on}"></button></div>`;

  function renderInspector() {
    const x = sec(S.sel);
    const head = `<div class="tbx-insp__head"><div class="tbx-tabs"><button data-tab="content" class="${S.tab === 'content' ? 'on' : ''}">Content</button><button data-tab="appearance" class="${S.tab === 'appearance' ? 'on' : ''}">Appearance</button></div><button class="tbx-btn tbx-ai sq" data-act="ai">${svg('spark')}AI</button></div>`;
    if (!x) { insp.innerHTML = head + `<div class="tbx-insp__body"><p class="tbx-muted">Select a section to edit it.</p></div>`; return; }
    const s = x.s; let body = `<div class="tbx-insp__name"><b>${TYPES[x.type][0]}</b><small>${TYPES[x.type][3]}</small></div>`;
    if (S.tab === 'content') {
      switch (x.type) {
        case 'hero': {
          const img = s.image.startsWith('blob:') || s.image.startsWith('http') ? s.image : IMG + s.image + '.svg';
          body += `<div class="tbx-group"><b>Slides</b><div class="tbx-rep"><div class="tbx-rep__h">Slide 1 ${svg('trash', 'red')}</div>
            <span class="tbx-lbl">Image</span><div class="tbx-img"><span class="tbx-img__thumb" style="background:${s.bg}"><img src="${img}" alt=""><i class="del">${svg('trash')}</i></span>
            <button class="tbx-pick" data-act="imgmenu">${svg('image')}Replace Image${svg('chev', 'sm')}</button><small>Recommended: 1920 × 640</small></div>
            ${field('Eyebrow', 'eyebrow', s.eyebrow)}${field('Heading', 'heading', s.heading)}${field('Subheading', 'sub', s.sub)}${field('Button text', 'cta', s.cta)}</div></div>`;
          break;
        }
        case 'ticker': body += `<div class="tbx-group"><b>Words</b>${s.words.map(([w, st, br], i) => `<div class="tbx-rep"><div class="tbx-rep__h">Word ${i + 1} ${svg('trash', 'red')}</div>
          ${field('Text', 'word' + i, w)}<span class="tbx-lbl">Style</span><div class="tbx-seg2" data-wordstyle="${i}"><button class="${st === 'solid' ? 'on' : ''}" data-v="solid">Solid</button><button class="${st === 'outline' ? 'on' : ''}" data-v="outline">Outline</button></div>
          ${toggle('Brand colour', 'brand' + i, br)}</div>`).join('')}</div>`; break;
        case 'promo': body += field('Title', 'title', s.title) + `<div class="tbx-group"><b>Cards</b>${s.cards.map((c, i) => `<div class="tbx-rep"><div class="tbx-rep__h">Card ${i + 1}</div>${field('Product', 'card' + i, c)}</div>`).join('')}</div>`; break;
        case 'best': body += field('Title', 'title', s.title) + `<span class="tbx-lbl">Products</span><div class="tbx-select">Best sellers · automatic${svg('chev', 'sm')}</div><span class="tbx-lbl">Columns</span><div class="tbx-seg2" data-cols><button class="${s.cols === 3 ? 'on' : ''}" data-v="3">3</button><button class="${s.cols === 4 ? 'on' : ''}" data-v="4">4</button></div>`; break;
        case 'reviews': body += field('Title', 'title', s.title) + toggle('Show stars', 'stars', s.stars); break;
        case 'newsletter': body += field('Title', 'title', s.title) + field('Subtitle', 'sub', s.sub) + field('Button text', 'cta', s.cta); break;
        case 'text': body += `<label class="tbx-f"><span>Text</span><textarea data-k="body" rows="5">${esc(s.body)}</textarea></label>`; break;
        case 'button': body += field('Label', 'label', s.label); break;
        default: body += field('Title', 'title', s.title || '');
      }
    } else {
      const bgKey = x.type === 'hero' ? 'bg' : x.type === 'newsletter' ? 'bg' : null;
      body += `${toggle('Edge to edge', 'edge', !!s.edge)}<small class="tbx-help">On, the banner runs the full width of the page. Off, it sits inside the store's content column.</small>
        <div class="tbx-box"><div class="tbx-devtabs">${['desktop', 'tablet', 'mobile'].map(d => `<button class="${d === 'desktop' ? 'on' : ''}">${svg(d)}</button>`).join('')}</div>
        ${toggle('Show this section', 'show', true)}
        ${x.type === 'hero' ? field('Section height', 'height', s.height, 'type="number" min="200" max="480" step="10"') : ''}
        ${field('Space above', 'sa', x.space[0], 'type="number" min="0" max="96" step="4"')}${field('Space below', 'sb', x.space[1], 'type="number" min="0" max="96" step="4"')}</div>
        ${bgKey ? swatch('Background', 'sec:' + bgKey, s[bgKey]) : ''}${toggle('Theme space above', 'tsa', true)}${toggle('Theme space below', 'tsb', true)}`;
    }
    insp.innerHTML = head + `<div class="tbx-insp__body">${body}</div>`;
  }

  function renderStatus() {
    const st = $('#tbxStatus');
    st.className = 'tbx-status ' + S.status;
    st.innerHTML = `<i></i>${S.status === 'published' ? 'Published' : S.status === 'saved' ? 'Draft saved' : 'Draft not published'}`;
    $$('[data-device]').forEach(b => b.classList.toggle('on', b.dataset.device === S.device));
    $('.tbx-win').classList.toggle('previewing', S.preview);
    $$('[data-pane]').forEach(b => b.classList.toggle('on', b.dataset.pane === S.pane));
    root.dataset.pane = S.pane;
  }
  function render(flash) { renderList(); renderFrame(flash); renderInspector(); renderStatus(); }

  /* ---------------------------------------------------------------- actions */
  function toast(msg) { const el = $('#tbxToast'); el.innerHTML = svg('check') + msg; el.classList.add('show'); clearTimeout(el._h); el._h = setTimeout(() => el.classList.remove('show'), 2400); }
  function closeLayer() { layer.innerHTML = ''; layer.className = 'tbx-layer'; }
  function dirty() { if (S.status !== 'draft') { S.status = 'draft'; renderStatus(); } }
  function select(id, tab) {
    S.sel = id; if (tab) S.tab = tab;
    renderList(); renderFrame(); renderInspector();
    const el = $(`.tbx-sec[data-id="${id}"]`, frame); if (el) scrollCanvasTo(el);
  }
  function scrollCanvasTo(el) {
    const sc = $('.tbx-scroll'), r = el.getBoundingClientRect(), p = sc.getBoundingClientRect();
    if (r.top < p.top + 10 || r.bottom > p.bottom - 10) sc.scrollTo({ top: sc.scrollTop + r.top - p.top - 40, behavior: RM ? 'auto' : 'smooth' });
  }
  function addSection(type, afterId) {
    const x = mk(type, S.brand);
    const i = afterId ? S.sections.findIndex(s => s.id === afterId) + 1 : S.sections.length;
    S.sections.splice(i, 0, x); S.sel = x.id; S.tab = 'content'; dirty(); closeLayer();
    render(x.id); const el = $(`.tbx-sec[data-id="${x.id}"]`, frame); if (el) scrollCanvasTo(el);
    return x;
  }
  function moveSection(id, to) {
    const from = S.sections.findIndex(s => s.id === id); if (from < 0 || to < 0 || to >= S.sections.length || from === to) return;
    const before = rects();
    const [x] = S.sections.splice(from, 1); S.sections.splice(to, 0, x); dirty();
    renderList(); renderFrame(); renderInspector(); flip(before);
  }
  function delSection(id) {
    const el = $(`.tbx-sec[data-id="${id}"]`, frame);
    const go = () => { S.sections = S.sections.filter(s => s.id !== id); S.sel = S.sections[0] ? S.sections[0].id : null; dirty(); render(); };
    if (el && !RM) { el.classList.add('leaving'); setTimeout(go, 280); } else go();
  }
  function rects() { const m = new Map(); $$('.tbx-sec', frame).forEach(e => m.set(e.dataset.id, e.getBoundingClientRect().top)); $$('.tbx-item', list).forEach(e => m.set('l' + e.dataset.id, e.getBoundingClientRect().top)); return m; }
  function flip(before) {
    if (RM) return;
    $$('.tbx-sec', frame).forEach(e => { const a = before.get(e.dataset.id); if (a == null) return; const d = a - e.getBoundingClientRect().top; if (d) e.animate([{ transform: `translateY(${d}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
    $$('.tbx-item', list).forEach(e => { const a = before.get('l' + e.dataset.id); if (a == null) return; const d = a - e.getBoundingClientRect().top; if (d) e.animate([{ transform: `translateY(${d}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
  }
  function setField(k, v) {
    const x = sec(S.sel); if (!x) return;
    if (/^word\d$/.test(k)) x.s.words[+k[4]][0] = v;
    else if (/^card\d$/.test(k)) x.s.cards[+k[4]] = v;
    else if (k === 'sa' || k === 'sb') x.space[k === 'sa' ? 0 : 1] = Math.max(0, Math.min(96, +v || 0));
    else if (k === 'height') x.s.height = Math.max(200, Math.min(480, +v || 300));
    else x.s[k] = v;
    dirty(); patchSection(x);
  }
  function patchSection(x) {
    const el = $(`.tbx-sec[data-id="${x.id}"]`, frame); if (!el) return;
    el.style.setProperty('--sa', x.space[0] / 2 + 'px'); el.style.setProperty('--sb', x.space[1] / 2 + 'px');
    $('.tbx-sec__body', el).innerHTML = storefront(x);
  }
  function setTheme(k, v) { S.theme[k] = v; dirty(); renderFrame(); }
  function setDevice(d) { S.device = d; renderStatus(); frame.dataset.device = d; }
  function publish() {
    const b = $('[data-act="publish"]'); b.classList.add('busy'); b.disabled = true;
    setTimeout(() => {
      b.classList.remove('busy'); b.disabled = false; S.status = 'published'; renderStatus();
      toast(`Published · ${esc(S.brand.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '') || 'yourstore')}.fullstro.store is live`);
    }, RM ? 0 : 1100);
  }

  /* ----------------------------------------------------------------- layers */
  function anchor(el, cls, html, { align = 'left', gap = 6 } = {}) {
    closeLayer();
    const w = $('.tbx-win').getBoundingClientRect(), r = el.getBoundingClientRect();
    layer.className = 'tbx-layer open';
    layer.innerHTML = `<div class="tbx-pop ${cls}">${html}</div>`;
    const pop = layer.firstChild;
    const top = r.bottom - w.top + gap;
    let left = align === 'right' ? r.right - w.left - pop.offsetWidth : r.left - w.left;
    left = Math.max(8, Math.min(left, w.width - pop.offsetWidth - 8));
    pop.style.top = Math.min(top, w.height - pop.offsetHeight - 8) + 'px'; pop.style.left = left + 'px';
    return pop;
  }
  function modal(cls, html) {
    closeLayer(); layer.className = 'tbx-layer open dim';
    layer.innerHTML = `<div class="tbx-modal ${cls}">${html}</div>`; return layer.firstChild;
  }
  function drawer(cls, html) {
    closeLayer(); layer.className = 'tbx-layer open';
    layer.innerHTML = `<div class="tbx-drawer ${cls}">${html}</div>`; return layer.firstChild;
  }

  function openLibrary() {
    const pop = anchor($('.tbx-add'), 'tbx-lib', `<b class="tbx-pop__t">Add a section</b>
      <div class="tbx-search"><input placeholder="Search widgets" aria-label="Search widgets">${svg('search')}</div>
      <div class="tbx-lib__list">${LIBRARY.map(([g, items]) => `<div class="tbx-lib__g" data-g><span>${g}</span>${items.map(k =>
        `<button data-add="${k}"><i style="color:${TYPES[k][2]}">${TYPES[k][1]}</i>${TYPES[k][0]}</button>`).join('')}</div>`).join('')}</div>`, { gap: -8 });
    pop.style.left = ($('.tbx-add').getBoundingClientRect().right - $('.tbx-win').getBoundingClientRect().left + 10) + 'px';
    if (innerWidth < 900) pop.style.left = '12px';
    const inp = $('input', pop);
    inp.addEventListener('input', () => {
      const q = inp.value.toLowerCase();
      $$('[data-add]', pop).forEach(b => { b.hidden = !b.textContent.toLowerCase().includes(q); });
      $$('[data-g]', pop).forEach(g => { g.hidden = !$$('[data-add]', g).some(b => !b.hidden); });
    });
  }
  function openImageMenu(btn) {
    anchor(btn, 'tbx-menu', `<button data-img="library">${svg('image')}<span><b>Choose from Library</b><small>Select from your file manager</small></span></button>
      <button data-img="upload">${svg('upload')}<span><b>Upload New File</b><small>Upload from your device</small></span></button>
      <button data-img="url">${svg('link')}<span><b>Use Image URL</b><small>Paste a link to an image</small></span></button>`, { align: 'right' });
  }
  function openFiles() {
    const x = sec(S.sel);
    const cur = x && x.s.image;
    const m = modal('tbx-files', `<div class="tbx-modal__h"><b>Choose a file</b><button class="tbx-ib" data-close aria-label="Close">${svg('x')}</button></div>
      <div class="tbx-files__in"><aside><span>FOLDERS</span><button class="on">${svg('folder')}Library</button><button>${svg('folder')}Winter '26</button></aside>
      <div class="tbx-files__main"><div class="tbx-files__bar"><div class="tbx-search">${svg('search')}<input placeholder="Search all folders" aria-label="Search files"></div><span class="tbx-select">Images${svg('chev', 'sm')}</span><span class="tbx-select hide-sm">Newest first${svg('chev', 'sm')}</span><button class="tbx-btn tbx-primary" data-img="upload">${svg('upload')}Upload</button></div>
      <div class="tbx-files__grid">${FILES.map(([k, n, bg]) => `<button class="tbx-file ${k === cur ? 'on' : ''}" data-file="${k}"><span style="background:${bg}"><img src="${IMG}${k}.svg" alt=""></span><small>${n}</small></button>`).join('')}</div></div>
      <div class="tbx-files__prev" id="tbxPrev"><span class="tbx-muted">Select a file to preview it</span></div></div>
      <div class="tbx-modal__f"><span class="tbx-muted" id="tbxPick">Select a file</span><span><button class="tbx-btn tbx-out" data-close>Cancel</button><button class="tbx-btn tbx-primary" data-select disabled>Select</button></span></div>`);
    let pick = null;
    $$('[data-file]', m).forEach(b => b.addEventListener('click', () => {
      pick = b.dataset.file; $$('[data-file]', m).forEach(o => o.classList.toggle('on', o === b));
      const f = FILES.find(f => f[0] === pick);
      $('#tbxPrev').innerHTML = `<span class="tbx-prev__img" style="background:${f[2]}"><img src="${IMG}${f[0]}.svg" alt=""></span><b>${f[1]}</b><small>PNG · 1920 × 1080 · 248 KB</small>`;
      $('#tbxPick').textContent = '1 file selected'; $('[data-select]', m).disabled = false;
    }));
    $('[data-select]', m).addEventListener('click', () => { if (!pick) return; const f = FILES.find(f => f[0] === pick); applyImage(pick, f[2]); });
  }
  function applyImage(src, bg) {
    const x = sec(S.sel); if (!x || x.type !== 'hero') return;
    x.s.image = src; if (bg) x.s.bg = bg; dirty(); closeLayer();
    patchSection(x); renderInspector();
    const im = $(`.tbx-sec[data-id="${x.id}"] .sf-hero__img`, frame); if (im && !RM) im.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'ease-out' });
  }
  const fileInput = document.createElement('input');
  fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.hidden = true; root.append(fileInput);
  fileInput.addEventListener('change', () => { const f = fileInput.files[0]; if (f && f.type.startsWith('image/')) applyImage(URL.createObjectURL(f)); fileInput.value = ''; });
  function openUrl(btn) {
    const pop = anchor(btn, 'tbx-menu tbx-urlpop', `<b class="tbx-pop__t">Use Image URL</b><input type="url" placeholder="https://…" aria-label="Image URL"><button class="tbx-btn tbx-primary">Use image</button>`, { align: 'right' });
    const inp = $('input', pop); inp.focus();
    $('button', pop).addEventListener('click', () => { const v = inp.value.trim(); if (/^https:\/\//.test(v)) applyImage(v); else inp.focus(); });
  }

  function openStyles() {
    const th = S.theme;
    const row = (label, k, hint) => `<div class="tbx-crow"><span>${label}</span><button class="tbx-sw" data-color="theme:${k}"><i style="background:${th[k]}"></i>${th[k].toUpperCase()}</button>${hint ? `<small>${hint}</small>` : ''}</div>`;
    modal('tbx-styles', `<div class="tbx-modal__h"><b>Theme styles</b><button class="tbx-ib boxed" data-close aria-label="Close">${svg('x')}</button></div>
      <div class="tbx-acc"><button class="tbx-acc__h">${svg('chev', 'sm rot')}Appearance</button></div>
      <div class="tbx-acc open"><button class="tbx-acc__h">${svg('chev', 'sm')}Colours</button><div class="tbx-acc__b">
        <small class="tbx-cap">Brand</small>${row('Primary', 'primary', 'Buttons, links and highlights.')}${row('Secondary', 'secondary')}${row('Accent', 'accent')}
        <small class="tbx-cap">Surfaces &amp; text</small>${row('Page background', 'page')}</div></div>`);
  }

  /* Colour picker: saturation/value square, hue + alpha sliders, HEX, presets */
  const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgb2hex = (r, g, b) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  function rgb2hsv(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, mx ? d / mx : 0, mx]; }
  function hsv2rgb(h, s, v) { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5) * 255, f(3) * 255, f(1) * 255]; }
  function openPicker(btn, value, onChange) {
    let [h, sv, vv] = rgb2hsv(...hex2rgb(value));
    const host = btn.closest('.tbx-modal') || layer;
    $$('.tbx-cp').forEach(o => o.remove());
    const pop = document.createElement('div'); pop.className = 'tbx-cp';
    pop.innerHTML = `<div class="tbx-cp__sv"><i></i></div><div class="tbx-cp__row"><div class="tbx-cp__sl"><input type="range" min="0" max="360" class="hue" aria-label="Hue"><div class="tbx-cp__alpha"></div></div><span class="tbx-cp__chip"></span></div>
      <div class="tbx-cp__in"><span class="tbx-select">HEX${svg('chev', 'sm')}</span><label># <input class="hex" maxlength="6" aria-label="Hex"></label><span class="pct">100%</span></div>
      <div class="tbx-cp__pre">${PRESETS.map(c => `<button data-pre="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>`;
    host.append(pop);
    const hr = host.getBoundingClientRect(), br = btn.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(br.left - hr.left, hr.width - 250)) + 'px';
    const below = br.bottom - hr.top + 6;
    pop.style.top = (below + 300 > hr.height ? Math.max(8, br.top - hr.top - 300) : below) + 'px';
    const svEl = $('.tbx-cp__sv', pop), knob = $('i', svEl), hue = $('.hue', pop), hexIn = $('.hex', pop), chip = $('.tbx-cp__chip', pop);
    const paint = emit => {
      const c = rgb2hex(...hsv2rgb(h, sv, vv));
      svEl.style.background = `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${h},100%,50%))`;
      knob.style.left = sv * 100 + '%'; knob.style.top = (1 - vv) * 100 + '%';
      hue.value = h; chip.style.background = c; if (document.activeElement !== hexIn) hexIn.value = c.slice(1);
      btn.innerHTML = `<i style="background:${c}"></i>${c}`;
      if (emit) onChange(c);
    };
    const drag = e => { const r = svEl.getBoundingClientRect(); sv = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); vv = 1 - Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)); paint(true); };
    svEl.addEventListener('pointerdown', e => { svEl.setPointerCapture(e.pointerId); drag(e); svEl.onpointermove = drag; });
    svEl.addEventListener('pointerup', () => { svEl.onpointermove = null; });
    hue.addEventListener('input', () => { h = +hue.value; paint(true); });
    hexIn.addEventListener('input', () => { if (/^[0-9a-f]{6}$/i.test(hexIn.value)) { [h, sv, vv] = rgb2hsv(...hex2rgb(hexIn.value)); paint(true); } });
    $$('[data-pre]', pop).forEach(b => b.addEventListener('click', () => { [h, sv, vv] = rgb2hsv(...hex2rgb(b.dataset.pre)); paint(true); }));
    paint(false);
    return pop;
  }

  function openAI() {
    const d = drawer('tbx-ai-drawer', `<div class="tbx-drawer__h"><button class="tbx-ib" data-close aria-label="Close">${svg('x')}</button>${svg('spark', 'violet')}<b>AI Theme Assistant</b></div>
      <div class="tbx-drawer__b"><span class="tbx-lbl">Describe your storefront</span>
      <textarea id="tbxPrompt" rows="4" maxlength="2000" placeholder="e.g. A modern luxury watch store with a large hero image, featured products and premium styling."></textarea>
      <div class="tbx-ai__meta"><small>Mention your products, style and any sections you want.</small><small id="tbxCnt">0 / 2000</small></div>
      <div class="tbx-ai__ex">${['A minimal streetwear brand called Northline. Black hoodies, clean and cozy.', 'Make my current store look more premium.', 'Add a promotional banner like the recommended fashion layout.'].map(x => `<button data-ex>${x}</button>`).join('')}</div>
      <span class="tbx-lbl">What should the AI do?</span><div class="tbx-seg2 three"><button class="on">Decide for me</button><button>Change my theme</button><button>New design</button></div>
      <span class="tbx-lbl">Pages to design</span><div class="tbx-checks">${['Home', 'Shop', 'Product', 'Header', 'Footer', 'Cart'].map((p, i) => `<label><input type="checkbox" ${[0, 3, 4].includes(i) ? 'checked' : ''}>${p}</label>`).join('')}</div>
      ${toggle('Generate images', 'aiimg', true)}
      <div class="tbx-ai__prog" id="tbxProg" hidden></div>
      <button class="tbx-btn tbx-primary wide" data-gen>${svg('spark')}Generate</button></div>`);
    const ta = $('#tbxPrompt', d);
    ta.addEventListener('input', () => { $('#tbxCnt', d).textContent = `${ta.value.length} / 2000`; });
    $$('[data-ex]', d).forEach(b => b.addEventListener('click', () => { ta.value = b.textContent; ta.dispatchEvent(new Event('input')); }));
    $('[data-gen]', d).addEventListener('click', () => aiGenerate(ta.value || ta.placeholder));
    return d;
  }
  function brandFrom(p) {
    const m = p.match(/(?:called|named)\s+["“]?([\p{L}\p{N}&'’-]+)/u) || p.match(/([\p{L}\p{N}&'’-]+)\s+নাম(?:ে|ের|ক)/u) || p.match(/\b([\p{Lu}][\p{L}\p{N}&'’-]{2,})\b/u);
    return (m ? m[1] : 'Northline').slice(0, 18);
  }
  async function aiGenerate(prompt, run) {
    const d = $('.tbx-ai-drawer'); const alive = () => run == null || run === Auto.run;
    S.brand = brandFrom(prompt);
    const lp = prompt.toLowerCase();
    S.theme.primary = /luxury|premium|watch|gold/.test(lp) ? '#1F2937' : /beauty|skin|pink/.test(lp) ? '#BE185D' : /fresh|green|organic|food/.test(lp) ? '#0F766E' : '#1B1D29';
    if (d) {
      const prog = $('#tbxProg', d), gen = $('[data-gen]', d); prog.hidden = false; gen.disabled = true; gen.classList.add('busy');
      const steps = ['Reading your brief', 'Planning the layout', 'Writing headlines and copy', 'Generating product images', 'Applying your brand colours'];
      for (let i = 0; i < steps.length; i++) {
        prog.innerHTML = steps.map((s, j) => `<span class="${j < i ? 'done' : j === i ? 'now' : ''}">${j < i ? svg('check') : '<i></i>'}${s}</span>`).join('');
        await wait(520); if (!alive()) return;
      }
    }
    closeLayer();
    S.sections = []; S.sel = null; render();
    for (const type of ['ticker', 'hero', 'promo', 'reviews', 'newsletter']) {
      const x = mk(type, S.brand); S.sections.push(x); S.sel = S.sections[1] ? S.sections[1].id : x.id;
      renderList(); renderFrame(x.id); await wait(260); if (!alive()) return;
    }
    S.tab = 'content'; S.status = 'draft'; render();
    toast('AI built 5 sections for ' + esc(S.brand));
  }

  /* -------------------------------------------------- drag & drop (pointer) */
  const Drag = {
    on: false,
    begin(id, y) {
      const li = $(`.tbx-item[data-id="${id}"]`, list); if (!li) return false;
      this.on = true; this.id = id; this.li = li; this.items = $$('.tbx-item', list);
      this.h = li.offsetHeight + 6; this.from = this.items.indexOf(li); this.to = this.from;
      this.y0 = y; li.classList.add('dragging'); list.classList.add('sorting');
      select(id); this.li = $(`.tbx-item[data-id="${id}"]`, list); this.items = $$('.tbx-item', list); this.li.classList.add('dragging'); list.classList.add('sorting');
      return true;
    },
    move(y) {
      if (!this.on) return;
      const dy = y - this.y0; this.li.style.transform = `translateY(${dy}px) scale(1.02)`;
      const to = Math.max(0, Math.min(this.items.length - 1, this.from + Math.round(dy / this.h)));
      if (to !== this.to) {
        this.to = to;
        this.items.forEach((el, i) => {
          if (el === this.li) return;
          let shift = 0;
          if (this.from < to && i > this.from && i <= to) shift = -this.h;
          if (this.from > to && i < this.from && i >= to) shift = this.h;
          el.style.transform = shift ? `translateY(${shift}px)` : '';
        });
      }
    },
    end() {
      if (!this.on) return; this.on = false;
      list.classList.remove('sorting');
      this.items.forEach(el => { el.style.transform = ''; el.classList.remove('dragging'); });
      if (this.to !== this.from) moveSection(this.id, this.to);
    }
  };
  list.addEventListener('pointerdown', e => {
    const li = e.target.closest('.tbx-item'); if (!li) return;
    if (!e.target.closest('.tbx-item__handle') && e.pointerType !== 'mouse') return select(li.dataset.id);
    const start = e.clientY; let started = false;
    const mv = ev => {
      if (!started && Math.abs(ev.clientY - start) > 4) { started = Drag.begin(li.dataset.id, start); }
      if (started) { ev.preventDefault(); Drag.move(ev.clientY); }
    };
    const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); if (started) Drag.end(); else select(li.dataset.id); };
    addEventListener('pointermove', mv, { passive: false }); addEventListener('pointerup', up);
  });

  /* ------------------------------------------------------------ event wiring */
  root.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'), t2 = e.target;
    // any click outside an open colour picker (and not on a swatch) dismisses it
    if (!t2.closest('.tbx-cp, [data-color]')) $$('.tbx-cp').forEach(o => o.remove());
    if (t2.closest('[data-close]')) return closeLayer();
    if (layer.classList.contains('dim') && t2 === layer) return closeLayer();
    if (a) {
      const act = a.dataset.act;
      if (act === 'ai') return openAI();
      if (act === 'add') return openLibrary();
      if (act === 'styles') return openStyles();
      if (act === 'imgmenu') return openImageMenu(a);
      if (act === 'publish') return publish();
      if (act === 'save') { S.status = 'saved'; renderStatus(); return toast('Draft saved'); }
      if (act === 'preview') { S.preview = !S.preview; return renderStatus(); }
      if (act === 'history') return anchor(a, 'tbx-menu', `<span class="tbx-cap">Today</span><button><span><b>Draft saved</b><small>2 minutes ago · you</small></span></button><button><span><b>Published</b><small>Yesterday 6:42 PM · you</small></span></button>`);
      if (act === 'settings') return anchor(a, 'tbx-menu', `<span class="tbx-cap">Theme file</span><button><span><b>Export configuration</b><small>Download this theme as a .fullstro file</small></span></button><button><span><b>Import configuration</b><small>Replace your draft from a .fullstro file</small></span></button><span class="tbx-cap">Draft</span><button class="red"><span><b>Discard draft</b><small>Go back to the published version</small></span></button>`, { align: 'right' });
      return;
    }
    const add = t2.closest('[data-add]'); if (add) return addSection(add.dataset.add, S.sel);
    const img = t2.closest('[data-img]');
    if (img) { const k = img.dataset.img; if (k === 'library') return openFiles(); if (k === 'upload') { closeLayer(); return fileInput.click(); } if (k === 'url') return openUrl($('[data-act="imgmenu"]') || img); }
    const dev = t2.closest('.tbx-devices [data-device]'); if (dev) return setDevice(dev.dataset.device);
    const pane = t2.closest('.tbx-panes [data-pane]'); if (pane) { S.pane = pane.dataset.pane; return renderStatus(); }
    const tab = t2.closest('[data-tab]'); if (tab) { S.tab = tab.dataset.tab; return renderInspector(); }
    const sw = t2.closest('[data-color]');
    if (sw) {
      const [scope, k] = sw.dataset.color.split(':');
      const cur = scope === 'theme' ? S.theme[k] : sec(S.sel).s[k];
      return openPicker(sw, cur, c => { if (scope === 'theme') setTheme(k, c); else { sec(S.sel).s[k] = c; dirty(); patchSection(sec(S.sel)); } });
    }
    const tg = t2.closest('[data-tg]');
    if (tg) {
      const on = !tg.classList.contains('on'); tg.classList.toggle('on', on); tg.setAttribute('aria-checked', on);
      const k = tg.dataset.tg, x = sec(S.sel);
      if (x && /^brand\d$/.test(k)) { x.s.words[+k[5]][2] = on; patchSection(x); }
      else if (x && k === 'stars') { x.s.stars = on; patchSection(x); }
      else if (x && k === 'edge') { x.s.edge = on; patchSection(x); }
      return;
    }
    const ws = t2.closest('[data-wordstyle] button'); if (ws) { const i = +ws.parentElement.dataset.wordstyle; sec(S.sel).s.words[i][1] = ws.dataset.v; patchSection(sec(S.sel)); return renderInspector(); }
    const cols = t2.closest('[data-cols] button'); if (cols) { sec(S.sel).s.cols = +cols.dataset.v; patchSection(sec(S.sel)); return renderInspector(); }
    const sa = t2.closest('[data-sa]');
    if (sa) {
      const id = sa.closest('.tbx-sec').dataset.id, i = S.sections.findIndex(s => s.id === id);
      if (sa.dataset.sa === 'up') return moveSection(id, i - 1);
      if (sa.dataset.sa === 'down') return moveSection(id, i + 1);
      if (sa.dataset.sa === 'del') return delSection(id);
      if (sa.dataset.sa === 'gear') { S.tab = 'appearance'; if (innerWidth < 900) S.pane = 'inspect'; renderInspector(); return renderStatus(); }
      if (sa.dataset.sa === 'ai') return rewrite(id);
    }
    const s2 = t2.closest('.tbx-sec'); if (s2 && s2.dataset.id !== S.sel) return select(s2.dataset.id, 'content');
    if (layer.classList.contains('open') && !t2.closest('.tbx-pop,.tbx-modal,.tbx-drawer,.tbx-cp')) closeLayer();
  });
  root.addEventListener('input', e => { const k = e.target.dataset && e.target.dataset.k; if (k) setField(k, e.target.value); });

  const REWRITES = { hero: ['Built for every season.', 'Warm layers, zero compromise.', 'Your new everyday uniform.'], promo: ['This week’s favourites', 'Built to layer'], reviews: ['Real people, real reviews', 'Why 1,200+ customers came back'], newsletter: ['Be first in line', 'Drops, before anyone else'] };
  async function rewrite(id) {
    const x = sec(id); const opts = REWRITES[x.type]; if (!opts) return toast('AI tuned the spacing and contrast');
    const k = x.type === 'hero' ? 'heading' : 'title'; const next = opts[(opts.indexOf(x.s[k]) + 1) % opts.length];
    for (let n = 0; n <= next.length; n += 2) { x.s[k] = next.slice(0, n); patchSection(x); await wait(28); }
    x.s[k] = next; patchSection(x); renderInspector(); dirty();
  }

  /* ------------------------------------------------------------- autopilot */
  const wait = ms => new Promise(r => setTimeout(r, RM ? Math.min(ms, 30) : ms));
  const cursor = $('#tbxCursor');
  const Auto = {
    run: 0, playing: false, visible: false, done: false,
    alive(r) { return r === this.run; },
    stop(byUser) {
      if (!this.playing) return; this.run++; this.playing = false;
      cursor.classList.remove('on'); root.classList.remove('tbx-auto');
      // Interrupted before the AI draft finished? Hand over a complete store, never an empty page.
      if (byUser && S.sections.length < 5) { closeLayer(); S.sections = fullStore(); S.sel = S.sections[1].id; S.tab = 'content'; render(); }
      narr(byUser ? t('builder.yourTurn') : t('builder.finished'), true);
    },
    paneFor(el) { return el.closest('.tbx-nav') ? 'nav' : el.closest('.tbx-insp') ? 'inspect' : el.closest('.tbx-main') ? 'canvas' : null; },
    async to(target, r, opt = {}) {
      if (!this.alive(r)) throw 0;
      const el = typeof target === 'string' ? $(target) : target; if (!el) throw new Error('no target ' + target);
      if (innerWidth < 900) { const p = this.paneFor(el); if (p && S.pane !== p) { S.pane = p; renderStatus(); await wait(250); } }
      const sc = el.closest('.tbx-scroll, .tbx-insp__body, .tbx-list, .tbx-lib__list, .tbx-drawer__b');
      if (sc) { const a = el.getBoundingClientRect(), b = sc.getBoundingClientRect(); if (a.top < b.top || a.bottom > b.bottom) { sc.scrollTo({ top: sc.scrollTop + a.top - b.top - 60, behavior: 'smooth' }); await wait(420); } }
      const w = $('.tbx-win').getBoundingClientRect(), a = el.getBoundingClientRect();
      const x = a.left - w.left + (opt.x != null ? opt.x : a.width * .5), y = a.top - w.top + (opt.y != null ? opt.y : a.height * .55);
      cursor.classList.add('on'); cursor.style.transform = `translate(${x}px,${y}px)`;
      await wait(opt.fast ? 380 : 720); if (!this.alive(r)) throw 0;
      return el;
    },
    async click(target, r, opt) {
      const el = await this.to(target, r, opt);
      cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
      await wait(160); if (!this.alive(r)) throw 0;
      el.click(); await wait(opt && opt.after || 420); if (!this.alive(r)) throw 0;
      return el;
    },
    async press(target, r) {
      const el = await this.to(target, r);
      cursor.classList.remove('click'); void cursor.offsetWidth; cursor.classList.add('click');
      await wait(180); if (!this.alive(r)) throw 0; return el;
    },
    async type(target, text, r, replace = true) {
      const el = await this.click(target, r, { after: 120 });
      el.focus({ preventScroll: true });
      if (replace) { el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); }
      for (let i = 0; i < text.length; i += 1) { el.value += text[i]; el.dispatchEvent(new Event('input', { bubbles: true })); await wait(text.length > 40 ? 16 : 45); if (!this.alive(r)) throw 0; }
      el.blur();
    },
    async drag(id, toIndex, r) {
      const handle = $(`.tbx-item[data-id="${id}"] .tbx-item__handle`, list);
      await this.to(handle, r);
      const y0 = handle.getBoundingClientRect().top + 10;
      cursor.classList.add('grab'); Drag.begin(id, y0);
      const steps = 26, target = y0 + (toIndex - Drag.from) * Drag.h, w = $('.tbx-win').getBoundingClientRect();
      const hx = handle.getBoundingClientRect().left - w.left + 8;
      for (let i = 1; i <= steps; i++) {
        const y = y0 + (target - y0) * (1 - Math.pow(1 - i / steps, 3));
        Drag.move(y); cursor.style.transition = 'none'; cursor.style.transform = `translate(${hx}px,${y - w.top}px)`;
        await wait(28); if (!this.alive(r)) { Drag.end(); throw 0; }
      }
      cursor.style.transition = ''; cursor.classList.remove('grab'); Drag.end(); await wait(700);
    },
    async play() {
      if (RM) return;
      const r = ++this.run; this.playing = true; this.done = false; root.classList.add('tbx-auto');
      const step = i => { if (!this.alive(r)) throw 0; narr(i); };   // never narrate over a visitor who took over
      $('#tbxDemo').hidden = true;
      try {
        S.sections = []; S.sel = null; S.status = 'draft'; S.device = 'desktop'; S.preview = false; S.pane = 'canvas';
        S.theme = { primary: '#1B1D29', secondary: '#FFFFFF', accent: '#C8A96A', page: '#FFFFFF' }; closeLayer(); render();
        cursor.style.transform = 'translate(60%,40%)';
        await wait(700);
        // 1 · AI builds the first draft
        step(0); await this.click('[data-act="ai"]', r, { after: 500 });
        await this.type('#tbxPrompt', t('builder.demoPrompt'), r);
        await this.press('[data-gen]', r);           // animate the click; run generation once, tied to this demo run
        await aiGenerate($('#tbxPrompt').value, r); if (!this.alive(r)) return;
        step(1); await wait(1600);
        // 2 · add a section from the library
        step(2); await this.click('.tbx-add', r, { after: 500 });
        await this.to('.tbx-lib [data-add="best"]', r); await this.click('.tbx-lib [data-add="best"]', r, { after: 900 });
        // 3 · drag Reviews above Best Selling
        step(3);
        const rev = S.sections.find(s => s.type === 'reviews'), best = S.sections.findIndex(s => s.type === 'best');
        await this.drag(rev.id, best, r);
        // 4 · edit the hero heading
        step(4); const hero = S.sections.find(s => s.type === 'hero');
        await this.click(`.tbx-sec[data-id="${hero.id}"] h3`, r, { after: 500 });
        await this.type('[data-k="heading"]', t('builder.demoHeading'), r);
        await wait(500);
        // 5 · pick an image from the library
        step(5); await this.click('[data-act="imgmenu"]', r, { after: 450 });
        await this.click('[data-img="library"]', r, { after: 600 });
        await this.click('[data-file="hoodie-c9b79c"]', r, { after: 500 });
        await this.click('[data-select]', r, { after: 1100 });
        // 6 · brand colour
        step(6); await this.click('[data-act="styles"]', r, { after: 500 });
        await this.click('[data-color="theme:primary"]', r, { after: 500 });
        await this.click('[data-pre="#C2410C"]', r, { after: 900 });
        await this.to('.tbx-cp__chip', r); await wait(500);
        await this.click('.tbx-styles [data-close]', r, { after: 900 });
        // 7 · mobile preview
        step(7); await this.click('[data-device="mobile"]', r, { after: 1800 });
        await this.click('[data-device="desktop"]', r, { after: 600 });
        // 8 · publish
        step(8); await this.click('[data-act="publish"]', r, { after: 2200 });
        this.done = true; this.stop(false); cursor.classList.remove('on');
        $('#tbxDemo').hidden = false; $('#tbxDemo').textContent = '↻ ' + t('builder.replay');
      } catch (e) {
        if (e) { console.warn('[builder demo]', e && e.message || e); this.stop(false); $('#tbxDemo').hidden = false; $('#tbxDemo').textContent = '↻ ' + t('builder.replay'); }
      }
    }
  };
  function narr(i, text) {
    const n = t('builder.narr'), total = n.length;
    $('#tbxNarr').innerHTML = text === true ? i : `<b>${typeof i === 'number' ? `${i + 1}/${total}` : ''}</b> ${typeof i === 'number' ? n[i] : i}`;
    root.classList.toggle('narr-live', text !== true);
  }
  // Any real interaction hands the controls to the visitor
  root.addEventListener('pointerdown', e => { if (e.isTrusted && Auto.playing) { Auto.stop(true); $('#tbxDemo').hidden = false; $('#tbxDemo').textContent = '▶ ' + t('builder.watch'); } }, true);
  root.addEventListener('keydown', e => { if (e.isTrusted && Auto.playing) Auto.stop(true); }, true);
  $('#tbxDemo').addEventListener('click', e => { e.stopPropagation(); Auto.play(); });
  new IntersectionObserver(es => es.forEach(e => {
    Auto.visible = e.isIntersecting;
    if (e.isIntersecting && !Auto.started && !RM) { Auto.started = true; Auto.play(); }
  }), { threshold: .45 }).observe(root);

  /* ------------------------------------------------------------------ boot */
  S.sections = fullStore(); S.sel = S.sections[1].id;
  render();
  narr(t('builder.intro'), true);
  if (RM) { $('#tbxDemo').hidden = true; }
  L.on(() => {
    // prices & narration follow language/region; structure stays as the visitor left it
    renderFrame(); renderInspector();
    if (!Auto.playing) narr(Auto.done ? t('builder.finished') : t('builder.intro'), true);
    const d = $('#tbxDemo'); if (!d.hidden) d.textContent = (Auto.done ? '↻ ' + t('builder.replay') : '▶ ' + t('builder.watch'));
  });
})();

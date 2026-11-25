/* ==========================================================================
   Locale engine: language + region, independent of each other.

   Language resolution (first match wins)
     1. URL  – /bn/… (path routing) or ?lang=bn
     2. Saved choice (localStorage fs_lang)
     3. Browser languages (navigator.languages contains bn → bn)
     4. FS_CONFIG.defaultLanguage

   Region resolution (first match wins)
     1. URL  – ?region=bd | ?region=global
     2. Saved manual choice (localStorage fs_region)
     3. Edge country: cookie `fs_country` or <meta name="fs-country">, set by
        functions/_middleware.js from Cloudflare's CF-IPCountry (or nginx GeoIP)
     4. Browser time zone in a region's `timezones` (Asia/Dhaka → bd)
     5. Browser locale ending in -BD
     6. global
   ========================================================================== */
(function () {
  const C = window.FS_CONFIG;
  const DICT = window.FS_I18N || {};
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const qs = new URLSearchParams(location.search);
  const listeners = [];

  function langFromPath() {
    const parts = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean);
    const seg = parts[parts.length - 1];
    return seg && C.languages[seg] && seg !== C.defaultLanguage ? seg : null;
  }

  function detectLang() {
    const fromUrl = langFromPath() || qs.get('lang');
    if (fromUrl && C.languages[fromUrl]) return { lang: fromUrl, source: 'url' };
    const saved = store.get('fs_lang');
    if (saved && C.languages[saved]) return { lang: saved, source: 'saved' };
    const nav = (navigator.languages || [navigator.language || '']).map(l => (l || '').toLowerCase());
    if (nav.some(l => l.startsWith('bn'))) return { lang: 'bn', source: 'browser' };
    return { lang: C.defaultLanguage, source: 'default' };
  }

  function edgeCountry() {
    const m = document.cookie.match(/(?:^|;\s*)fs_country=([A-Za-z]{2})/);
    if (m) return m[1].toUpperCase();
    const meta = document.querySelector('meta[name="fs-country"]');
    const v = meta && meta.content;
    return v && /^[A-Za-z]{2}$/.test(v) ? v.toUpperCase() : null;
  }

  function detectRegion() {
    const q = qs.get('region');
    if (q && C.regions[q]) return { region: q, source: 'url' };
    const saved = store.get('fs_region');
    if (saved && C.regions[saved]) return { region: saved, source: 'saved' };
    const cc = edgeCountry();
    if (cc) return { region: cc === 'BD' ? 'bd' : 'global', source: 'edge' };
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    for (const [id, r] of Object.entries(C.regions)) if (r.timezones.includes(tz)) return { region: id, source: 'timezone' };
    const nav = (navigator.languages || [navigator.language || '']).join(',').toUpperCase();
    if (/-BD\b/.test(nav)) return { region: 'bd', source: 'browser' };
    return { region: 'global', source: 'default' };
  }

  const L = detectLang();
  const R = detectRegion();

  const Locale = {
    lang: L.lang, langSource: L.source,
    region: R.region, regionSource: R.source,

    get R() { return C.regions[this.region]; },
    get S() { const r = C.regions[this.region]; return Object.assign({}, r.sample, this.lang === 'bn' ? r.sampleBn : null); },

    /* t('hero.title', {x:1}) → string | array | object, with {tokens} filled */
    t(path, vars) {
      const v = get(DICT[this.lang], path) ?? get(DICT.en, path);
      if (v == null) { console.warn('[i18n] missing', path); return path; }
      return fill(v, vars);
    },
    fill(v, vars) { return fill(v, vars); },

    num(n, opts) {
      return new Intl.NumberFormat(C.languages[this.lang].numberLocale, opts).format(n);
    },
    money(n) {
      const r = this.R;
      const digits = r.currency === 'USD' && n % 1 ? 2 : 0;
      const loc = this.lang === 'bn' ? 'bn-BD' : r.moneyLocale;
      return r.symbol + new Intl.NumberFormat(loc, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
    },

    setLang(lang) {
      if (!C.languages[lang] || lang === this.lang) return;
      this.lang = lang; store.set('fs_lang', lang); this.syncUrl(); this.emit('lang');
    },
    setRegion(region) {
      if (!C.regions[region] || region === this.region) return;
      this.region = region; this.regionSource = 'saved'; store.set('fs_region', region); this.emit('region');
    },

    /* Keep the address bar truthful so links are shareable.
       Path URLs (/bn/) only on a real host with the rewrite in place;
       localhost and file:// fall back to ?lang=bn so reloads never 404. */
    usePath() {
      return C.routing === 'path' && /^https?:$/.test(location.protocol) &&
        !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    },
    /* Directory the site lives in, without a trailing language segment */
    basePath() {
      const parts = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean);
      if (parts.length && C.languages[parts[parts.length - 1]]) parts.pop();
      return '/' + parts.join('/') + (parts.length ? '/' : '');
    },
    hrefFor(lang) {
      const u = new URL(location.href);
      u.searchParams.delete('lang'); u.hash = '';
      if (this.usePath()) u.pathname = this.basePath() + (lang === C.defaultLanguage ? '' : lang + '/');
      else if (lang !== C.defaultLanguage) u.searchParams.set('lang', lang);
      return u.href;
    },
    syncUrl() {
      const u = new URL(this.hrefFor(this.lang)); u.hash = location.hash;
      history.replaceState(null, '', u);
    },

    on(fn) { listeners.push(fn); },
    emit(what) { listeners.forEach(fn => fn(what)); }
  };

  /* {token} lookup order: explicit vars → region sample (money-formatted price) */
  function fill(v, vars) {
    if (typeof v === 'string') {
      return v.replace(/\{(\w+)\}/g, (m, k) => {
        if (vars && vars[k] != null) return vars[k];
        if (k === 'price') return Locale.money(Locale.S.price);
        if (k === 'symbol') return Locale.R.symbol;
        if (Locale.S[k] != null) return Locale.S[k];
        return m;
      });
    }
    if (Array.isArray(v)) return v.map(x => fill(x, vars));
    if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = fill(v[k], vars); return o; }
    return v;
  }
  function get(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }

  window.FS_LOCALE = Locale;
})();

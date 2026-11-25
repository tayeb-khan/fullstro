// node shoot.js <region> <route> <outname> [actionsModule]
const puppeteer = require('puppeteer-core');
const { route } = require('./router');
const art = require('./art');
const F = require('./fixtures');
const SP = __dirname;

async function open(region, { scale = 1 } = {}) {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--lang=en-US'], headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: scale });
  await p.emulateTimezone(F.R[region].tz);
  const unhandled = new Set(), errs = [], blocked = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 220)));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });
  await p.setRequestInterception(true);
  p.on('request', req => {
    const u = req.url();
    if (u.startsWith(F.ASSET)) {
      const name = u.slice(F.ASSET.length).replace('.svg', '');
      if (name === 'flag') return req.respond({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="7"/></svg>' });
      if (name === 'banner-hero') return req.respond({ status: 200, contentType: 'image/svg+xml', body: art.banner() });
      if (name.endsWith('-cut')) { const k = name.slice(0, -4); const P = F.PRODUCTS.find(x => x[1] === k); return req.respond({ status: 200, contentType: 'image/svg+xml', body: art.cut(k, P ? P[2] : '#888') }); }
      if (name === 'avatar') return req.respond({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#2C3591"/><text x="32" y="41" font-family="Arial" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">AN</text></svg>' });
      const P = F.PRODUCTS.find(x => x[1] === name);
      return req.respond({ status: 200, contentType: 'image/svg+xml', body: art.svg(name, P ? P[2] : '#888') });
    }
    if (/^https?:\/\/localhost:3417\//.test(u) || u.startsWith('data:') || u.startsWith('blob:')) return req.continue();
    if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr|cdnjs|unpkg|cdn\.ckeditor\.com/.test(u)) return req.continue();
    const isApi = /\/api\/v1\/(auth|product)-service/.test(u);
    if (isApi) {
      const h = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' };
      if (req.method() === 'OPTIONS') return req.respond({ status: 204, headers: h, body: '' });
      const url = new URL(u);
      const res = route(region, req.method(), url.pathname, url.searchParams, unhandled);
      return req.respond({ status: res.status, headers: h, contentType: 'application/json', body: JSON.stringify(res.body) });
    }
    blocked.push(u.slice(0, 100));
    return req.respond({ status: 204, body: '' });   // anything else external (pusher, analytics, real hosts) never leaves
  });
  const perms = F.permissions();
  const set = F.settings(region);
  await p.evaluateOnNewDocument((perms, set) => {
    const L = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    L('tenant_auth', { accessToken: 'demo-token', authUser: { id: 1, name: 'Ayaan Northline', first_name: 'Ayaan', last_name: 'Northline', avatar: 'https://demo-assets.northline.test/avatar.svg', user_type: 'admin', product_tour_completed_at: '2026-01-01', is_first_login: 0, plan: { is_free_plan: false } } });
    L('tenant_auth_user_permissions', perms);
    L('tenant_currency_symbol', set.currency_symbol);
    L('tenant_decimal_separator', set.decimal_separator);
    L('tenant_no_of_decimals', Number(set.no_of_decimals));
    L('tenant_currency_format', 'symbol_amount');
    L('tenant_locale', 'en');
    L('tenant_settings', set);
    localStorage.setItem('mode', 'light');
    { let x = 0.42; Math.random = () => { x = (x * 9301 + 49297) % 233280 / 233280; return x; }; }
  }, perms, set);
  return { b, p, unhandled, errs, blocked };
}
module.exports = { open };

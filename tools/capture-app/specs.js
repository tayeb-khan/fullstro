// One entry per homepage screen. prep(page, region) runs after load; hotspots(page) returns {key: Element-finder source}.
const wait = ms => new Promise(r => setTimeout(r, ms));

async function clickText(p, selector, text, nth = 0) {
  const ok = await p.evaluate((selector, text, nth) => {
    const els = [...document.querySelectorAll(selector)].filter(e => e.textContent.trim().includes(text) && e.offsetParent !== null);
    const el = els[nth]; if (!el) return false;
    el.scrollIntoView({ block: 'center' }); el.click(); return true;
  }, selector, text, nth);
  if (!ok) throw new Error(`clickText: no "${text}" in ${selector}`);
}
async function scrollTo(p, selector, offset = 90) {
  await p.evaluate((selector, offset) => {
    const el = typeof selector === 'string' ? document.querySelector(selector) : null;
    if (!el) throw new Error('scrollTo: missing ' + selector);
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset);
  }, selector, offset);
  await wait(600);
}
// Rect of the union of elements matched by a function body evaluated in page
const rect = fnSrc => `(() => { const els = (${fnSrc})().filter(Boolean); if (!els.length) return null;
  const rs = els.map(e => e.getBoundingClientRect()); const x = Math.min(...rs.map(r => r.left)), y = Math.min(...rs.map(r => r.top));
  return [Math.round(x), Math.round(y), Math.round(Math.max(...rs.map(r => r.right)) - x), Math.round(Math.max(...rs.map(r => r.bottom)) - y)]; })()`;
const byText = (sel, text) => `() => [...document.querySelectorAll('${sel}')].filter(e => e.textContent.trim().includes(${JSON.stringify(text)}) && e.offsetParent !== null).slice(0, 1)`;

const courierBd = {
  route: '/app/pathao-shipping/10042', h: 1400, unshipped: true,
  prep: async p => {
    await p.evaluate(() => history.replaceState({ usr: { options: { recipient_city: 1, recipient_zone: 52, recipient_area: 901, store_id: 7712, delivery_type: 48, item_weight: 0.6, item_quantity: 1 } }, key: 'demo', idx: 0 }, '', location.href));
    await p.reload({ waitUntil: 'networkidle2' }); await wait(3500);
  },
  hotspots: {
    courier: rect(`() => { const h = [...document.querySelectorAll('span, h5, h6, b, strong, div')].find(e => e.children.length === 0 && /Book with Pathao/.test(e.textContent)); return [h && (h.closest('[class*=head]') || h.parentElement)]; }`),
    book: rect(`() => [...document.querySelectorAll('button')].filter(b => /Book|Create order|Confirm/i.test(b.textContent) && !/Back/.test(b.textContent)).slice(-1)`)
  }
};

module.exports = {
  'theme-builder': {
    route: '/app/store-front/themes/modern-clean/builder', h: 900,
    prep: async p => { await clickText(p, '.tb-section-item', 'Hero'); await wait(900); await p.mouse.move(5, 500); await wait(300); },
    hotspots: {
      sections: rect(`() => { const a = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Scrolling Ticker'); const b = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Newsletter'); return [a && a.closest('.tb-section-item'), b && b.closest('.tb-section-item')]; }`),
      preview: rect(`() => { const c = document.querySelector('.tb-canvas'); const secs = [...document.querySelectorAll('.tb-canvas-section__body')]; return secs.length ? secs : [c]; }`)
    }
  },
  courier: courierBd,
  dashboard: {
    route: '/app/dashboard', h: 1460,
    hotspots: {
      stats: rect(`() => [...document.querySelectorAll('.ic-summary-card, .ic-widget-item')].slice(0, 12)`),
      chart: rect(`() => [document.querySelector('.ic-sales-report-chart')]`),
      products: rect(`() => { const h = [...document.querySelectorAll('h6, h5, h4, .ant-card-head-title, span')].find(e => e.textContent.trim() === 'Top Sale Products'); return [h && (h.closest('.ant-card') || h.closest('[class*=widget]') || h.parentElement.parentElement)]; }`)
    }
  },
  orders: {
    route: '/app/invoices', h: 900,
    hotspots: {
      row1042: rect(`() => { const cell = document.querySelector('.ic-ol-channel'); let row = cell; while (row && row.parentElement && !(row.getBoundingClientRect().width > 900)) row = row.parentElement; return [row]; }`),
      channel: rect(`() => [...document.querySelectorAll('.ic-ol-channel')].slice(0, 1).map(e => e.closest('[role=cell], [role=gridcell]') || e)`),
      status: rect(`() => { const cell = document.querySelector('.ic-ol-channel'); let row = cell; while (row && row.parentElement && !(row.getBoundingClientRect().width > 900)) row = row.parentElement; const t = row && [...row.querySelectorAll('*')].find(e => e.children.length === 0 && /^shipped$/i.test(e.textContent.trim())); return [t]; }`)
    }
  },
  inventory: {
    route: '/app/stock-inventory', h: 900,
    hotspots: {
      hoodie: rect(`() => [...document.querySelectorAll('tbody tr')].filter(tr => /Black Hoodie/.test(tr.textContent))`),
      stock: rect(`() => { const th = [...document.querySelectorAll('thead th')].findIndex(t => /Stock/.test(t.textContent)); return [...document.querySelectorAll('tbody tr')].filter(tr => /Black Hoodie/.test(tr.textContent)).map(tr => tr.children[th]); }`)
    }
  },
  invoice: {
    route: '/app/invoices/10042/show', h: 900,
    hotspots: {
      status: rect(`() => [...document.querySelectorAll('.ant-tag')].filter(e => /^(paid|shipped)$/i.test(e.textContent.trim()) && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().top > 60 && e.getBoundingClientRect().top < 400)`),
      total: rect(`() => { const grow = (e, minW) => { while (e && e.parentElement && e.getBoundingClientRect().width < minW) e = e.parentElement; return e; }; const l = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Total Paid'); return [grow(l, 160)]; }`),
      method: rect(`() => { const grow = (e, minW) => { while (e && e.parentElement && e.getBoundingClientRect().width < minW) e = e.parentElement; return e; }; const l = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^BKASH$|^STRIPE$/.test(e.textContent.trim())); const lab = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^Payment\\s*Type$/.test(e.textContent.trim())); return [lab, l]; }`)
    }
  },
  // Order page header: Thermal Print + Print (packing slip / label) and the ship-to address
  label: {
    route: '/app/invoices/10042/show', h: 1200,
    hotspots: {
      print: rect(`() => [...document.querySelectorAll('button')].filter(b => /^(Thermal Print|Print)$/i.test(b.textContent.trim()) && b.getBoundingClientRect().width > 0)`),
      shipTo: rect(`() => { const own = e => [...e.childNodes].some(n => n.nodeType === 3 && /^\\s*Shipped To\\s*$/i.test(n.textContent)); const h = [...document.querySelectorAll('*')].find(own); let card = h; while (card && card.parentElement && card.getBoundingClientRect().height < 150) card = card.parentElement; return [card]; }`),
      labelBtn: rect(`() => [...document.querySelectorAll('button')].filter(b => /Print Shipping Label|^Shipping Label$/i.test(b.textContent.trim()) && b.getBoundingClientRect().width > 0)`)
    }
  },
  // Same order after the courier's "delivered" webhook
  delivered: {
    route: '/app/invoices/10042/show', h: 900, delivered: true,
    prep: async p => { await scrollTo(p, '.ic-courier-timeline', 260); },
    hotspots: {
      timeline: rect(`() => [document.querySelector('.ic-courier-timeline')]`),
      latest: rect(`() => { const t = document.querySelector('.ic-courier-timeline'); if (!t) return []; const hit = [...t.querySelectorAll('*')].filter(e => e.children.length === 0 && /Delivered to|Delivered –/.test(e.textContent)); const el = hit[0]; let row = el; while (row && row.parentElement && row.parentElement !== t && row.getBoundingClientRect().height < 40) row = row.parentElement; return [row]; }`)
    }
  },
  tracking: {
    route: '/app/invoices/10042/show', h: 900,
    prep: async p => { await scrollTo(p, '.ic-courier-timeline', 260); },
    hotspots: { status: rect(`() => [document.querySelector('.ic-courier-timeline')]`) }
  },
  addons: {
    route: '/app/addons-integration', h: 900,
    hotspots: { grid: rect(`() => [document.querySelector('.ic-ecom-addons-item-wrap .row')]`) }
  },
  'product-ai': {
    route: '/app/products/501/edit', h: 900,
    prep: async p => {
      await clickText(p, 'button', 'Generate with AI', 1);   // full description
      await wait(900);
      await clickText(p, '.ant-modal button', 'Next'); await wait(500);
      await clickText(p, '.ant-modal button', 'Generate'); await wait(1600);
    },
    hotspots: {
      aiButton: rect(`() => [...document.querySelectorAll('.ant-modal button')].filter(b => /Insert/.test(b.textContent))`),
      description: rect(`() => [document.querySelector('.ant-modal .ic-ai-generate__result, .ant-modal [class*=preview], .ant-modal [class*=result]')]`)
    }
  }
};
module.exports.helpers = { clickText, scrollTo, wait, rect };

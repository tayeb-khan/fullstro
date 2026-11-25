// Northline home page for the real Theme Builder, built on the registry's own defaults.
const D = require('./section-defaults.json');
const F = require('./fixtures');
const def = id => JSON.parse(JSON.stringify(D[id].defaults || {}));
const sec = (id, type, settings, label) => ({ id, type, label: label || D[type].label || type, settings: Object.assign(def(type), settings) });

function theme() {
  return { id: 14, name: 'Modern Clean', slug: 'modern-clean', theme_key: 'template14', kind: 'builder', version: '2.4.0', image: '/app/images/StoreFrontTemplate/template-1.png',
    thumbnail: '/app/images/StoreFrontTemplate/template-1.png', is_active_theme: true, is_tenant_theme: false, is_set_up: true, is_default: false, status: 1, description: 'Bright, airy, product-first.' };
}

function state(r) {
  const S = F.R[r];
  const A = F.ASSET;
  const money = r === 'bd' ? '৳2,000' : '$75';
  const home = [
    sec('s_ticker', 'marquee_ticker', { items: [
      { id: 't1', text: `Free delivery over ${money}`, weight: 'bold', accent: false },
      { id: 't2', text: "Winter '26 drop is live", weight: 'bold', accent: true },
      { id: 't3', text: r === 'bd' ? 'Pay with bKash or cash on delivery' : 'Free returns within 30 days', weight: 'bold', accent: false }] }),
    sec('s_hero', 'hero_slider', { height: '380px', slides: [{ id: 'slide_1', backgroundUrl: A + 'banner-hero.svg', mobileBackgroundUrl: '', imageAlt: 'Made for cold mornings', link: '/products' }] }, 'Hero Slider'),
    sec('s_promo', 'promo_grid', { title: 'Shop the essentials', cards: [
      { ...def('promo_grid').cards[0], id: 'c1', size: 'large', eyebrow: 'Best seller', title: 'Black Hoodie', subtitle: '400gsm brushed fleece', priceText: F.R[r].cur + F.price(r, 1850), buttonText: 'Shop now', productImageUrl: A + 'hoodie-cut.svg', colorFrom: '#1B1D29', colorTo: '#3A3F5C' },
      { ...def('promo_grid').cards[0], id: 'c2', size: 'small', eyebrow: 'New', title: 'Cargo Joggers', subtitle: 'Relaxed, tapered', priceText: F.R[r].cur + F.price(r, 1650), buttonText: 'Shop now', productImageUrl: A + 'joggers-cut.svg', colorFrom: '#5B5F45', colorTo: '#2F3224' },
      { ...def('promo_grid').cards[0], id: 'c3', size: 'small', eyebrow: 'Layer up', title: 'Puffer Vest', subtitle: 'Water-resistant', priceText: F.R[r].cur + F.price(r, 2450), buttonText: 'Shop now', productImageUrl: A + 'vest-cut.svg', colorFrom: '#2E3A59', colorTo: '#151B2C' }] }),
    sec('s_reviews', 'reviews', { title: 'Loved by 1,200+ customers', testimonials: (r === 'bd' ? [['Tasnim A.', 'Softest hoodie I own. Wearing it right now.'], ['Rafi H.', 'Ordered at night, got it next afternoon in Mirpur.'], ['Mim R.', 'Swapped M for L in two days. Easy.']] : [['Sofia M.', 'Softest hoodie I own. Wearing it right now.'], ['Liam B.', 'Arrived in two days. The fit is perfect.'], ['Ava P.', 'Exchanged a size with zero hassle.']]).map(([name, content], i) => ({ id: 'r' + i, name, rating: 5, content, avatarUrl: '', date: '2026-11-2' + i, productName: 'Black Hoodie', productSlug: 'black-hoodie' })) }),
    sec('s_news', 'newsletter', { title: 'Get first dibs on new drops', subtitle: 'One email a month. No spam.' })
  ];
  const templates = Object.fromEntries(D._templates.map(k => [k, k === 'home' ? home : []]));
  const regions = {
    header: [sec('h_bar', 'header_bar', { brandName: 'Northline', tagline: 'Streetwear basics' }), sec('h_nav', 'header_nav', {})],
    mega_menu: [],
    footer: [sec('f_cols', 'footer_columns', { brandName: 'Northline', aboutText: 'Fewer, better pieces. Designed in ' + (r === 'bd' ? 'Dhaka' : 'Austin') + '.' }), sec('f_bottom', 'footer_bottom', { copyright: '© 2026 Northline' })]
  };
  const doc = { version: 7, updated_at: '2026-11-24 12:10:00', templates, regions, region_designs: {}, global: { colors: { primary: '#1B1D29', accent: '#C8A96A' }, typography: { heading: 'Inter', body: 'Inter' } } };
  return {
    theme: { ...theme(), supports: null, schema_version: 1, region_designs: [] },
    draft: doc, published: { ...doc, version: 6, published_at: '2026-11-23 18:00:00' }, has_unpublished_changes: true,
    revisions: [{ version: 6, published_at: '2026-11-23 18:00:00', published_by: 'Ayaan' }, { version: 5, published_at: '2026-11-20 10:12:00', published_by: 'Ayaan' }],
    is_active_theme: true, limits: { max_upload_kb: 4096 }
  };
}
module.exports = { theme, state };

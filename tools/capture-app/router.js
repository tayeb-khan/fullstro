// Routes intercepted API requests to fixtures. Returns {status, body}.
const F = require('./fixtures');
const TH = require('./theme');
const { ok, page } = F;
const state = { unshipped: false, delivered: false };

function route(r, method, p, q, unhandled) {
  const S = F.R[r];
  const invoices = Array.from({ length: 10 }, (_, k) => F.invoice(r, k));
  if (state.unshipped) { invoices[0].shipping_details = null; invoices[0].delivery_status = 'processing'; }
  if (state.delivered && invoices[0].shipping_details) {   // #1042 after the courier's final webhook
    const d = invoices[0].shipping_details;
    invoices[0].delivery_status = 'delivered'; d.shipping_status = 'delivered'; d.last_synced_at = '2026-11-24 16:32:00';
    d.tracking_history = [...d.tracking_history, { type: 'delivery_status', status: 'delivered',
      message: r === 'bd' ? 'Delivered to Nusrat Jahan – Dhanmondi, Dhaka' : 'Delivered – left at front door, Austin TX', updated_at: '2026-11-24 04:32 PM' }];
  }
  const LOGO = n => '/app/images/addons-logo/' + n;
  const products = F.PRODUCTS.map((_, i) => F.product(r, i));
  const wh = S.wh.map((n, i) => ({ id: i + 1, name: n, address_1: i ? '' : (r === 'bd' ? 'Tejgaon I/A' : '500 Logistics Way'), city: S.city, state: S.state, country: S.country, phone: S.phone, status: 1, is_default: i === 0 }));
  const user = {
    id: 1, first_name: 'Ayaan', last_name: 'Northline', name: 'Ayaan Northline', email: 'hello@northline.store', phone: S.phone, avatar: F.ASSET + 'avatar.svg', user_type: 'admin', status: 1,
    is_first_login: 0, is_pass_set: 1, product_tour_completed_at: '2026-01-01 00:00:00', current_warehouse: 1, last_plan_type_id: r === 'bd' ? 2 : 1,
    country: { code: S.countryCode, name: S.country }, tenant: { id: 'northline', name: 'Northline' },
    plan: { id: 2, name: 'Growth', is_free_plan: false, is_first_plan: false, expired_at: '2027-11-24' },
    permissions: F.permissions().map((name, i) => ({ id: i + 2, name, parent_id: 1 })), roles: [{ id: 1, name: 'Admin' }]
  };
  const strip = s => s.replace(/^\/api\/v1\/(auth|product)-service/, '');
  const path = strip(p);

  const table = [
    // ---- shell
    [/^\/auth\/auth-user$/, () => ok(user)],
    [/^\/get-tenant-admin$/, () => ok({ id: 1, country: S.country, reseller: null, tenantAdmin: true, name: 'Northline' })],
    [/^\/user-plan-trial$/, () => ok({ left: 0, trial_enabled: false, is_expired: false })],
    [/^\/force-plan$/, () => ok(null)],
    [/^\/user\/current-plan$/, () => ok({ id: 2, plan: { id: 2, name: 'Growth' }, name: 'Growth', is_free_plan: false, expired_at: '2027-11-24', features: [] })],
    [/^\/user-onboarding$/, () => ok({ currentStep: null, stepsLeft: 0, step_current_stage: null, progress: { profile: 100, warehouse: 100, general: 100, formatting: 100, invoice_settings: 100,
      steps: Object.fromEntries(['warehouse', 'product', 'purchase', 'store', 'shipping_platform', 'payment_method'].map(k => [k, { completed: true, is_skipped: false, percentage: 100 }])) } })],
    [/^\/get-tenant-tutorial-settings$/, () => ok({ dashboard: true, product: true, invoice: true, all: true })],
    [/^\/get-settings$/, () => ok(F.settings(r))],
    [/^\/languages\/all$/, () => ok([{ id: 1, name: 'English', locale: 'en', is_default: 1, status: 1, flag: F.ASSET + 'flag.svg' }])],
    [/^\/languages\/[a-z]+\/translations$/, () => ok([])],
    [/^\/get-latest-notification$/, () => ok([])],
    [/^\/warehouse\/all$/, () => ok(wh)],
    [/^\/storage-uses/, () => ok({ total: 2048, used: 312, percentage: 15 })],
    [/^\/get-all-connected-addons$/, () => ok(F.CONNECTED(r))],
    // ---- dashboard
    [/^\/dashboard$/, () => ok({ total_invoices: 811, total_sales: Math.round(1342000 * (r === 'bd' ? 1 : S.mult)), total_purchases: Math.round(402000 * (r === 'bd' ? 1 : S.mult)), running_job: null })],
    [/^\/dashboard\/sale-report$/, () => ok(F.salesReport(r))],
    [/^\/dashboard\/expense-report$/, () => ok({ total: 31000, expenses: [{ name: 'Packaging', value: 9000 }, { name: 'Ads', value: 14000 }, { name: 'Delivery', value: 8000 }] })],
    [/^\/dashboard\/latest-invoices$/, () => ok(invoices.slice(0, 6))],
    [/^\/dashboard\/top-sale-product$/, () => ok([0, 3, 1, 2, 7].map((i, k) => ({ id: products[i].id, name: products[i].name, variant_name: ['L / Black', 'M / White', 'L / Grey', '32 / Olive', 'M / Teal'][k], image: products[i].thumb, total: Math.round([284, 198, 151, 122, 96][k] * products[i].price) })))],
    [/^\/dashboard\/latest-products$/, () => ok(products.slice(0, 6))],
    [/^\/dashboard\/low-stock-products$/, () => ok([products[4], products[6]])],
    [/^\/dashboard\/order-status-report$/, () => ok({ order_statuses: [['Pending', 9], ['Processing', 14], ['Shipped', 22], ['Delivered', 64], ['Cancelled', 3], ['Returned', 2]].map(([name, value]) => ({ name, value })) })],
    [/^\/dashboard\/purchasing-status$/, () => ok({ purchasing_statuses: [] })],
    [/^\/dashboard\/store-overview$/, () => ok(F.storeOverview(r))],
    [/^\/dashboard\/pending-shipments$/, () => ok(invoices.filter(i => i.delivery_status === 'processing'))],
    [/^\/dashboard\/sales-payment-due$/, () => ok(invoices.filter(i => i.payment_status !== 'paid'))],
    [/^\/dashboard\/store-summary$/, () => ok(F.storeSummary(r))],
    [/^\/dashboard\/activity-log$/, () => { const logs = F.activity(r); return { status: 200, body: Object.assign(ok(logs), logs) }; }, true],

    [/^\/invoices\/(\d+)\/show$/, m => ok(invoices.find(i => String(i.id) === m[1]) || invoices[0])],
    [/^\/get-all-users$/, () => ok([{ id: 1, first_name: 'Ayaan', last_name: 'Northline', name: 'Ayaan Northline' }, { id: 2, first_name: r === 'bd' ? 'Sabbir' : 'Grace', last_name: r === 'bd' ? 'Hossain' : 'Miller', name: '' }])],
    [/^\/accounts\/all$/, () => ok([{ id: 1, name: r === 'bd' ? 'bKash Merchant' : 'Stripe Balance' }, { id: 2, name: 'Cash' }])],
    [/^\/accounts\/payment-defaults$/, () => ok({})],
    [/^\/shipping\/pathao\/get-stores$/, () => ok({ response: { data: { data: [{ store_id: 7712, store_name: 'Northline – Dhaka Main', store_address: 'Tejgaon I/A, Dhaka', is_active: 1, is_default_store: true, city_id: 1, zone_id: 52 }] } } })],
    [/^\/shipping\/pathao\/get-cities$/, () => ok({ cities: [{ city_id: 1, city_name: 'Dhaka' }, { city_id: 2, city_name: 'Chattogram' }, { city_id: 3, city_name: 'Sylhet' }] })],
    [/^\/shipping\/pathao\/get-zones\/\d+$/, () => ok({ zones: [{ zone_id: 52, zone_name: 'Dhanmondi' }, { zone_id: 53, zone_name: 'Gulshan' }, { zone_id: 54, zone_name: 'Mirpur' }] })],
    [/^\/shipping\/pathao\/get-areas\/\d+$/, () => ok({ areas: [{ area_id: 901, area_name: 'Road 7, Dhanmondi', home_delivery_available: true, pickup_available: true }] })],
    [/^\/shipping\/pathao\/get-order-price$/, () => ok({ response: { price: 60, discount: 0, promo_discount: 0, plan_id: 1, cod_enabled: 1, cod_percentage: 0.01, additional_charge: 0, final_price: 60 } })],
    [/^\/variant-list$/, () => page(products.flatMap(pr => pr.product_variants.flatMap(v => v.stocks.map(st => ({ id: v.id * 10 + st.warehouse_id, price: v.price, stock: st.stock,
        warehouse: { id: st.warehouse_id, name: st.warehouse.name, translations: [{ name: st.warehouse.name }] },
        product_variant: { id: v.id, name: v.name, sku: v.sku, product: { id: pr.id, thumb_url: pr.thumb, translations: [{ name: pr.name }], brand: { name: 'Northline' }, category: pr.category } } })))).slice(0, 12), 12)],
    [/^\/product-management\/categories\/all$/, () => ok(['Hoodies', 'Sweatshirts', 'Bottoms', 'T-Shirts', 'Outerwear', 'Accessories'].map((name, i) => ({ id: 10 + i, name, label: name, value: 10 + i })))],
    [/^\/product-management\/brands\/all$/, () => ok([{ id: 1, name: 'Northline', label: 'Northline', value: 1 }])],
    [/^\/product-management\/manufacturers\/all$/, () => ok([{ id: 1, name: 'Northline Studio', label: 'Northline Studio', value: 1 }])],
    [/^\/product-management\/(weight-units|measurement-units)\/all$/, m => ok(m[1] === 'weight-units' ? [{ id: 1, name: 'kg', label: 'kg', value: 1 }] : [{ id: 1, name: 'pcs', label: 'pcs', value: 1 }])],
    [/^\/product-management\/attributes\/all$/, () => ok([{ id: 1, name: 'Size', attribute_items: ['S', 'M', 'L', 'XL'].map((n, i) => ({ id: i + 1, name: n })) }, { id: 2, name: 'Color', attribute_items: [{ id: 9, name: 'Black' }] }])],
    [/^\/product-management\/ai\/models$/, () => ok([{ id: 1, name: 'FullStro Writer', provider_name: 'FullStro AI', type: 'text', credits: 1, credit_cost: 1, supports_vision: true, is_free_tier: false, is_own: false },
        { id: 2, name: 'FullStro Studio', provider_name: 'FullStro AI', type: 'image', credits: 4, credit_cost: 4, supports_vision: true, is_free_tier: false, is_own: false }])],
    [/^\/product-management\/ai\/generate-description$/, () => ok({ content: F.aiDescription(r), credits_consumed: 1, wallet: { balance: 249 } })],
    [/^\/ai\/models$/, () => ok([{ id: 1, name: 'FullStro Writer', provider_name: 'FullStro AI', type: 'text' }])],
    [/^\/product-management\/products\/(\d+)\/stocks$/, m => { const pr = products.find(x => String(x.id) === m[1]) || products[0]; return ok(pr.product_variants.flatMap(v => v.stocks.map(st => ({ ...st, product_variant_id: v.id, variant_name: v.name, sku: v.sku })))); }],
    [/^\/product-management\/products\/(low-stock|out-of-stocks)$/, m => page(m[1] === 'low-stock' ? [products[4], products[6]] : [])],
    [/^\/active-addons$/, () => ok(F.ADDONS(r).map(([name, title, type], i) => ({ id: i + 1, name, title, display_name: title, type: type === 'payment' ? 'payment_method' : type, logo: LOGO(F.LOGOS[name] || name + '.png'), is_free: i % 5 === 3, is_upcoming: false,
        short_description: F.ADDON_DESC[type].replace('{n}', title), price: r === 'bd' ? 500 : 9, is_connected: F.CONNECTED(r).includes(name) })))],
    [/^\/addons-purchase$/, () => ok(F.CONNECTED(r).map((name, i) => ({ id: i + 1, name, is_connected: true, expired_at: '2027-11-24' })))],
    [/^\/addon-count$/, () => ok({ count: 3, free_count: 3, limit: 10 })],
    [/^\/addon-expired$/, () => ok([])],
    [/^\/bd-url-courier\/connected$/, () => ok([])],
    [/^\/get-connected-addons-new-format$/, () => ok(F.CONNECTED(r).filter(n => ['shopify', 'daraz', 'woocommerce', 'amazon', 'ebay'].includes(n)).map(n => ({ parent: n, child: [{ id: 1, name: 'Northline ' + n, store_name: 'Northline' }] })))],
    [/^\/themes$/, () => ok([TH.theme(), { ...TH.theme(), id: 15, name: 'Dark Pro', slug: 'dark-pro', is_active_theme: false, image: '/app/images/StoreFrontTemplate/template-2.png', thumbnail: '/app/images/StoreFrontTemplate/template-2.png' },
      { ...TH.theme(), id: 16, name: 'Classic', slug: 'classic', is_active_theme: false, image: '/app/images/StoreFrontTemplate/template-3.png', thumbnail: '/app/images/StoreFrontTemplate/template-3.png' }])],
    [/^\/themes\/get-by-slug\/[a-z-]+$/, () => ok(TH.theme())],
    [/^\/themes\/14\/builder$/, () => ok(TH.state(r))],
    [/^\/themes\/ai-store\/builds$/, () => ok([])],
    [/^\/themes\/ai-store\/options$/, () => ok({ bases: [{ id: 14, name: 'Modern Clean', image: '/app/images/StoreFrontTemplate/template-1.png' }], min_output_tokens: 0, design_options: 3 })],
    [/^\/ai\/wallet$/, () => ok({ balance: 249, free_total: 50 })],
    // ---- invoices
    [/^\/invoices\/(\d+)$/, m => ok(invoices.find(i => String(i.id) === m[1] || i.invoice_number === m[1]) || invoices[0])],
    [/^\/invoices$/, () => {
      if (q.get('per_page') === '1') {
        const T = { all: [3214, 811, 726], pending: [61, 9, 12], processing: [88, 14, 11], delivered: [2930, 742, 668], returned: [41, 4, 6] }[q.get('deliveryStatus') || 'all'] || [0, 0, 0];
        const today = new Date().toISOString().slice(0, 10);
        const n = !q.get('startDate') ? T[0] : (q.get('endDate') === today ? T[1] : T[2]);
        return page(invoices.slice(0, 1), 1, n);
      }
      return page(invoices, 10, 811);
    }],
    // ---- products
    [/^\/product-management\/products\/(\d+)$/, m => ok(products.find(x => String(x.id) === m[1]) || products[0])],
    [/^\/product-management\/products$/, () => page(products)],
  ];
  for (const [re, fn, raw] of table) { const m = path.match(re); if (m) return raw ? fn(m) : { status: 200, body: fn(m) }; }
  unhandled && unhandled.add(method + ' ' + path);
  return { status: 200, body: ok([]) };
}
module.exports = { route, state };

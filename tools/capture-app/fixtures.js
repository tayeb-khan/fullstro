// Demo fixtures for the FullStro tenant app. Every API call is answered here; nothing reaches a backend.
const fs = require('fs');
const path = require('path');
const ASSET = 'https://demo-assets.northline.test/';   // intercepted, served from art.js

const R = {
  bd: { cur: '৳', curName: 'BDT', price: 1850, customer: ['Nusrat', 'Jahan'], city: 'Dhaka', area: 'Dhanmondi', state: 'Dhaka', country: 'Bangladesh', countryCode: 'BD',
        phone: '+8801712345678', pay: 'bKash', payKey: 'bkash', courier: 'Pathao', courierKey: 'pathao', channel: 'Facebook', market: 'daraz', marketName: 'Daraz',
        wh: ['Dhaka Main', 'Chattogram Hub'], tz: 'Asia/Dhaka', mult: 1,
        names: [['Rafi', 'Ahmed'], ['Tasnim', 'Akter'], ['Sakib', 'Hasan'], ['Mim', 'Rahman'], ['Arif', 'Hossain'], ['Farzana', 'Islam'], ['Imran', 'Kabir'], ['Sadia', 'Noor'], ['Fahim', 'Chowdhury']],
        cities: ['Mirpur, Dhaka', 'Agrabad, Chattogram', 'Zindabazar, Sylhet', 'Uttara, Dhaka', 'Khulna', 'Rajshahi', 'Gazipur', 'Bashundhara, Dhaka', 'Cumilla'] },
  global: { cur: '$', curName: 'USD', price: 49, customer: ['Emma', 'Carter'], city: 'Austin', area: '1200 Barton Springs Rd', state: 'TX', country: 'United States', countryCode: 'US',
        phone: '+15125550142', pay: 'Stripe', payKey: 'stripe', courier: 'FedEx', courierKey: 'fedex', channel: 'Instagram', market: 'amazon', marketName: 'Amazon',
        wh: ['Main Warehouse', 'East Coast Hub'], tz: 'America/Chicago', mult: 49 / 1850,
        names: [['Liam', 'Brooks'], ['Sofia', 'Martinez'], ['Noah', 'Kim'], ['Olivia', 'Turner'], ['Lucas', 'Bennett'], ['Ava', 'Patel'], ['Ethan', 'Wright'], ['Mia', 'Johnson'], ['James', 'Lee']],
        cities: ['Brooklyn, NY', 'Seattle, WA', 'Denver, CO', 'Chicago, IL', 'Portland, OR', 'San Diego, CA', 'Boston, MA', 'Miami, FL', 'Phoenix, AZ'] }
};

const PRODUCTS = [
  // name, kind, color, bd price, stock [wh1, wh2], category
  ['Black Hoodie', 'hoodie', '#1B1D29', 1850, [24, 11], 'Hoodies'],
  ['Grey Crewneck', 'crew', '#8E939E', 1450, [31, 14], 'Sweatshirts'],
  ['Cargo Joggers', 'joggers', '#5B5F45', 1650, [18, 9], 'Bottoms'],
  ['Oversized Tee White', 'tee', '#F7F7F4', 690, [64, 40], 'T-Shirts'],
  ['Puffer Vest', 'vest', '#2E3A59', 2450, [6, 3], 'Outerwear'],
  ['Beanie', 'beanie', '#B5452D', 450, [52, 27], 'Accessories'],
  ['Canvas Tote', 'tote', '#D9CBB0', 550, [4, 2], 'Accessories'],
  ['Windbreaker', 'windbreaker', '#2F6F6B', 2250, [15, 7], 'Outerwear']
];

function money(r, bd) { return r === 'bd' ? bd : Math.round(bd * R.global.mult) + (bd > 1000 ? 0.0 : 0); }
function price(r, bd) { if (r === 'bd') return bd; const map = { 1850: 49, 1450: 39, 1650: 45, 690: 19, 2450: 65, 450: 15, 550: 18, 2250: 59 }; return map[bd] ?? Math.round(bd / 38); }

const ok = (data, message = 'ok') => ({ success: true, message, data });
const page = (rows, per = 10, total = rows.length) => ok({ data: rows, links: { first: null, last: null, prev: null, next: null },
  meta: { current_page: 1, from: rows.length ? 1 : 0, last_page: Math.max(1, Math.ceil(total / per)), per_page: per, to: rows.length, total, path: '', links: [] } });

function permissions() {
  const list = fs.readFileSync(path.join(__dirname, 'allperms.txt'), 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
  return list;
}

function product(r, i) {
  const [name, kind, color, bd, stock, cat] = PRODUCTS[i];
  const S = R[r], p = price(r, bd);
  const id = 501 + i;
  const sizes = ['S', 'M', 'L', 'XL'];
  const variants = (i < 4 ? sizes : ['One Size']).map((sz, k) => ({
    id: id * 10 + k, product_id: id, name: i < 4 ? `${sz} / Black`.replace('Black', name.split(' ')[0]) : 'Default',
    sku: `NL-${String(id).slice(1)}-${sz}`, barcode: `8901${id}${k}`, price: p, purchase_price: Math.round(p * 0.48), sale_price: p,
    current_stock: Math.max(0, Math.round((stock[0] + stock[1]) / (i < 4 ? 4 : 1)) - k), image: `${ASSET}${kind}.svg`,
    stocks: S.wh.map((w, wi) => ({ warehouse_id: wi + 1, warehouse: { id: wi + 1, name: w }, stock: Math.max(0, Math.round(stock[wi] / (i < 4 ? 4 : 1)) - k + (k === 2 ? 1 : 0)), price: p }))
  }));
  return {
    id, name, slug: name.toLowerCase().replace(/ /g, '-'), sku: `NL-${String(id).slice(1)}`, barcode: `8901${id}`, status: 'active', is_approved: 1,
    desc: '', short_desc: '', thumb: `${ASSET}${kind}.svg`, image: `${ASSET}${kind}.svg`, image_url: `${ASSET}${kind}.svg`, thumb_path: `${ASSET}${kind}.svg`,
    gallery_images: [], current_stock: stock[0] + stock[1], stock_alert: 1, stock_alert_quantity: 8, product_type: 'standard', has_variant: i < 4 ? 1 : 0,
    price: p, sale_price: p, purchase_price: Math.round(p * 0.48), min_price: p, max_price: p,
    category: { id: 10 + i, name: cat }, brand: { id: 1, name: 'Northline' }, manufacturer: { id: 1, name: 'Northline Studio' },
    channels: [], product_variants: variants, variants, created_at: '2026-11-1' + (i % 9) + ' 10:2' + i + ':00', updated_at: '2026-11-23 09:00:00',
    weight: 0.6, minimum_order_quantity: 1, is_storefront_product: 1, tags: [], ebay_data: [], attribute_ids: i < 4 ? [1] : [], attribute_with_items: [], translations: [{ name }], thumb_url: `${ASSET}${kind}.svg`
  };
}

function customer(r, k) {
  const S = R[r];
  const [f, l] = k === 0 ? S.customer : S.names[(k - 1) % S.names.length];
  const city = k === 0 ? (r === 'bd' ? 'Dhanmondi, Dhaka' : 'Austin, TX') : S.cities[(k - 1) % S.cities.length];
  return { id: 300 + k, first_name: f, last_name: l, email: `${f.toLowerCase()}.${l.toLowerCase()}@example.com`, phone: S.phone.slice(0, -3) + String(100 + k * 7).slice(-3),
    address: city, customer_info: { city, country: S.country }, avatar: '' };
}

const SOURCES = r => r === 'bd' ? ['storefront', 'daraz', 'shopify', 'storefront', 'woocommerce', 'daraz', 'storefront', 'daraz', 'shopify', 'storefront']
                                : ['storefront', 'amazon', 'shopify', 'storefront', 'ebay', 'amazon', 'storefront', 'woocommerce', 'shopify', 'amazon'];

function invoice(r, k) {
  const S = R[r];
  const prodIdx = k === 0 ? 0 : [3, 1, 2, 5, 7, 0, 4, 6, 3, 1][k % 10];
  const p = product(r, prodIdx);
  const qty = k === 0 ? 1 : (k % 3 === 0 ? 2 : 1);
  const unit = p.price;
  const shipping = r === 'bd' ? 60 : 0;
  const total = unit * qty + shipping;
  const c = customer(r, k);
  const statuses = k === 0 ? ['paid', 'shipped'] : [['paid', 'processing'], ['unpaid', 'pending'], ['paid', 'delivered'], ['paid', 'shipped'], ['partial', 'processing'], ['paid', 'delivered'], ['unpaid', 'pending'], ['paid', 'delivered']][k % 8];
  const num = 1042 - k;
  const hour = 11 - Math.floor(k / 2), min = (47 - k * 9 + 600) % 60;
  const variant = p.product_variants[Math.min(2, p.product_variants.length - 1)];
  const src = k === 0 ? (r === 'bd' ? 'storefront' : 'storefront') : SOURCES(r)[k % 10];
  const payMethod = k === 0 ? S.payKey : (statuses[0] === 'unpaid' ? 'cash_on_delivery' : (r === 'bd' ? ['bkash', 'nagad', 'cash_on_delivery', 'sslcommerz'][k % 4] : ['stripe', 'paypal', 'stripe', 'card'][k % 4]));
  const addr = { first_name: c.first_name, last_name: c.last_name, name: `${c.first_name} ${c.last_name}`, email: c.email, phone: c.phone,
    address: k === 0 ? (r === 'bd' ? 'House 12, Road 7, Dhanmondi' : '1200 Barton Springs Rd') : c.address, address_1: k === 0 ? (r === 'bd' ? 'House 12, Road 7, Dhanmondi' : '1200 Barton Springs Rd') : c.address,
    city: k === 0 ? S.city : c.address.split(', ')[1] || c.address, state: S.state, zip: r === 'bd' ? '1209' : '78704', country: S.country };
  return {
    id: 9000 + num, invoice_number: String(num), channel_order_number: src === 'system' || src === 'storefront' ? null : (src === 'amazon' ? `114-${7300000 + num}-${1000 + k}` : `${src.toUpperCase().slice(0, 2)}${880000 + num}`),
    reference_type: src, date: `2026-11-24 ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`, invoice_date: '2026-11-24', due_date: '2026-11-24',
    customer_details: addr, billing_info: addr, shipping_info: addr,
    global_tax_status: 0, product_tax_status: 0, product_vat_status: 0, tax_amount: '0.00', vat_amount: '0.00', tax_type: null, is_refundable: 1,
    discount_amount: '0.00', discount: '0.00', discount_type: 'fixed', total: total.toFixed(2), shipping_fee: shipping.toFixed(2),
    total_paid: (statuses[0] === 'paid' ? total : statuses[0] === 'partial' ? Math.round(total / 2) : 0).toFixed(2),
    due: (statuses[0] === 'paid' ? 0 : statuses[0] === 'partial' ? total - Math.round(total / 2) : total).toFixed(2), last_paid: total.toFixed(2),
    payment_method: payMethod, payment_status: statuses[0], delivery_status: statuses[1], customer_id: c.id, edit_block_reason: null, is_editable: true, is_exchangeable: true,
    note: k === 0 ? 'Gift wrap please 🎁' : null, admin_note: null, is_draft: 0,
    shipping_details: k === 0 || statuses[1] === 'shipped' || statuses[1] === 'delivered' ? {
      tracking_number: r === 'bd' ? `DH${241124}${num}` : `7712 4410 ${num}`, consignment_id: r === 'bd' ? `DH${241124}${num}` : null, shipping_label: r === 'global' && k === 0 ? 'labels/fedex-1042.pdf' : null,  // a booked FedEx order has its label shipping_label_url: '',
      shipping_channel_type: S.courierKey, shipping_channel_name: S.courier, bd_courier_url: null, shipping_status: statuses[1] === 'delivered' ? 'delivered' : 'in_transit',
      tracking_code: r === 'bd' ? `DH${241124}${num}` : `7712 4410 ${num}`, last_synced_at: '2026-11-24 14:05:00', is_return: 0, service_type: r === 'bd' ? 'Regular' : 'FedEx Ground',
      shipping_carrier: S.courier, shipping_label_details: null,
      tracking_history: [
        { type: 'tracking_update', status: 'processing', message: r === 'bd' ? 'Parcel picked up from Northline – Dhaka Main' : 'Picked up at Main Warehouse, Austin TX', updated_at: '2026-11-24 09:12 AM' },
        { type: 'tracking_update', status: 'shipped', message: r === 'bd' ? 'Received at Pathao hub, Tejgaon' : 'Arrived at FedEx hub, Austin TX', updated_at: '2026-11-24 11:40 AM' },
        { type: 'delivery_status', status: 'shipped', message: r === 'bd' ? 'Out for delivery – rider Kamal, 01XXXXXXX41' : 'On FedEx vehicle for delivery', updated_at: '2026-11-24 02:05 PM' }
      ]
    } : null,
    invoice_user: { id: 1, first_name: 'Northline', last_name: 'Admin' },
    warehouse: { id: 1, name: S.wh[0], address: '', country: S.country, city: S.city, state: S.state, phone: S.phone },
    customer: c,
    invoice_items: [{ id: 70000 + num, product_id: p.id, product_variant_id: variant.id, stock_id: variant.id, sku: variant.sku, quantity: qty, returned_quantity: 0,
      price: unit.toFixed(2), tax_type: null, tax: '0.00', vat: '0.00', discount: '0.00', discount_type: 'fixed', total_discount: '0.00', sub_total: (unit * qty).toFixed(2), is_refundable: 1,
      product: { id: p.id, name: p.name, image: p.thumb, minimum_order_quantity: 1, maximum_order_quantity: 10 },
      product_variant: { id: variant.id, name: k === 0 ? 'L / Black' : variant.name, image: p.thumb } }],
    invoice_payments: statuses[0] === 'unpaid' ? [] : [{ id: 80000 + num, crypt_id: 'x' + num, invoice_id: 9000 + num, amount: (statuses[0] === 'partial' ? Math.round(total / 2) : total).toFixed(2),
      payment_method: k === 0 ? S.pay : payMethod, payment_info: { payment_method: payMethod, transaction_id: r === 'bd' ? `BKX9${num}TQ` : `pi_3Q${num}Lx` },
      date: '2026-11-24 11:49 am', status: 'paid', notes: k === 0 ? (r === 'bd' ? 'TrxID BKX9' + num + 'TQ' : 'Charge pi_3Q' + num + 'Lx') : null, additional_fee: '0.00', account_id: 1, created_at: '2026-11-24 11:49:00' }],
    pos_counter: null, unpaid_online_invoice_payment: null, reference_data: null, reference_id: null, sale_returns_sum: 0,
    shipping_document: null, is_ready_shipping_document: 0, waybill_generated: false, waybill_path: null, video_path: null, video_url: null
  };
}

function salesReport(r) {
  const m = r === 'bd' ? 1 : R.global.mult;
  const days = Array.from({ length: 24 }, (_, d) => `2026-11-${String(d + 1).padStart(2, '0')}`);
  const wave = d => 0.78 + 0.22 * Math.sin(d * 0.9) + ((d * 37) % 11) / 40;
  const sale = days.map((_, d) => Math.round((32000 + d * 1500) * wave(d) * m));
  const orders = sale.map(v => Math.round(v / (1650 * m)));
  return { data_type: days, data: sale, total: sale.reduce((a, b) => a + b, 0), net_revenue: 0, net_revenue_data: sale.map(v => Math.round(v * 0.38)),
    orders: orders.reduce((a, b) => a + b, 0), order_data: orders, refunded: 5, refunded_data: days.map((_, d) => (d % 6 === 2 ? 1 : 0)) };
}

function storeSummary(r) {
  const m = r === 'bd' ? 1 : R.global.mult;
  const v = n => Math.round(n * m);
  return { number_of_invoices: 41, widgets: [
    { key: 'pending_invoices', value: 9, text: 'Pending Orders', type: 'number' },
    { key: 'completed_invoices', value: 32, text: 'Completed Orders', type: 'number' },
    { key: 'total_sales', value: v(68450), text: 'Total Sales', type: 'currency' },
    { key: 'total_purchase', value: v(21300), text: 'Total Purchase', type: 'currency' },
    { key: 'sale_due', value: v(7400), text: 'Sale Due', type: 'currency' },
    { key: 'purchase_due', value: v(3200), text: 'Purchase Due', type: 'currency' },
    { key: 'sale_return', value: v(1450), text: 'Sale Return', type: 'currency' },
    { key: 'purchase_return', value: 0, text: 'Purchase Return', type: 'currency' },
    { key: 'low_stocks_products', value: 2, text: 'Low Stocks', type: 'number' },
    { key: 'total_profit_loss', value: v(29870), text: 'Total Profit/Loss', type: 'currency' }
  ] };
}

function storeOverview(r) {
  const m = r === 'bd' ? 1 : R.global.mult;
  const v = n => Math.round(n * m);
  const rows = [['today', 'Today', '24 Nov 2026', 68450, 41, 37, 1450, 0, 104200, true], ['yesterday', 'Yesterday', '23 Nov 2026', 59300, 36, 33, 0, 2300, 0, false],
    ['this_week', 'This Week', '23 Nov - 29 Nov 2026', 127750, 77, 70, 1450, 2300, 0, false], ['last_week', 'Last Week', '16 Nov - 22 Nov 2026', 402300, 241, 219, 3700, 9800, 0, false],
    ['this_month', 'This Month (Forecast)', 'Nov 2026', 1342000, 811, 742, 8900, 31000, 1678000, true], ['month_to_date', 'Month to Date', '1 Nov - 24 Nov 2026', 1342000, 811, 742, 8900, 31000, 0, false],
    ['last_month', 'Last Month', 'Oct 2026', 1196000, 726, 668, 11200, 29400, 0, false]];
  return rows.map(([key, t, d, sale, units, ordersN, refunds, expense, est, has]) => ({ key, period_text: t, period_date: d, sale: v(sale), units, total_orders: ordersN, refunds: v(refunds), expense: v(expense), estimate: v(est), has_estimate: has,
    purchase: { order: 3, total: v(sale * 0.3), requested: 120, received_units: 96, returned_units: 0 } }));
}

function settings(r) {
  const S = R[r];
  const dash = {
    available_dashboard_sections: [
      ['store_overview', 'Store Overview'], ['widget_section', 'Widget Section'], ['sale_report', 'Sale Report'], ['expense_report', 'Expense Report'], ['order_status_report', 'Order Status Report'],
      ['latest_invoice', 'Latest Invoice'], ['top_sale_product', 'Top Sale Products'], ['latest_product', 'Latest Products'], ['low_stock_product', 'Low Stock Products'],
      ['purchasing_overview', 'Purchasing Overview'], ['pending_shipments', 'Pending Shipments'], ['sales_payment_due', 'Sales Payment Due']
    ].map(([key, item]) => ({ key, item, permission: 'Show ' + item.replace('Top Sale Products', 'Top Sale Product').replace('Latest Products', 'Latest Product'), collapsed: false })),
    available_dashboard_widgets: [], available_dashboard_store_overviews: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'month_to_date', 'last_month'].map(k => ({ key: k, item: k, permission: 'Show ' + k })),
  };
  const order = ['widget_section', 'sale_report', 'top_sale_product', 'order_status_report', 'latest_invoice', 'latest_product'];
  dash.current_dashboard_sections = order.map(k => ({ ...dash.available_dashboard_sections.find(s => s.key === k), collapsed: false, sectionCol: k === 'widget_section' ? 'style_1' : 'style_2' }));
  dash.current_dashboard_widgets = [];
  dash.current_dashboard_store_overviews = dash.available_dashboard_store_overviews.slice(0, 4);
  return {
    title: 'Northline · FullStro', favicon_url: '', short_logo_url: '/fullstro_logo.svg', full_logo_url: '/fullstro_logo.svg',
    default_language: 'en', default_warehouse: 1, timezone: S.tz, currency_symbol: S.cur, invoice_number_prefix: '#', sku_prefix: 'NL-', currency_format: 'symbol_amount',
    decimal_separator: r === 'bd' ? 'en-IN' : 'en-US', no_of_decimals: '0', purchase_prefix: 'PO-', barcode_type: 'CODE128',
    ...dash, is_widget_available: true, is_store_overview_available: false,
    is_stripe_activated: r === 'global', is_paypal_activated: r === 'global', whiteLabel: [], bd_courier_is_active: r === 'bd',
    tenant_video_popup: null, invoice_show_billing_info: true, invoice_show_shipping_info: true, invoice_show_info: true, invoice_logo_visible: true, show_product_image: true
  };
}

const ADDONS = r => {
  const list = r === 'bd'
    ? [['shopify', 'Shopify', 'ecom'], ['woocommerce', 'WooCommerce', 'ecom'], ['daraz', 'Daraz', 'ecom'], ['amazon', 'Amazon', 'ecom'], ['ebay', 'eBay', 'ecom'], ['lazada', 'Lazada', 'ecom'], ['shopee', 'Shopee', 'ecom'],
       ['bkash', 'bKash', 'payment'], ['nagad', 'Nagad', 'payment'], ['aamarpay', 'aamarPay', 'payment'], ['stripe', 'Stripe', 'payment'],
       ['pathao', 'Pathao', 'shipping'], ['steadfast', 'Steadfast', 'shipping'], ['ecourier', 'eCourier', 'shipping'], ['sundarban', 'Sundarban', 'shipping'], ['google_sheet', 'Google Sheets', 'tools']]
    : [['shopify', 'Shopify', 'ecom'], ['woocommerce', 'WooCommerce', 'ecom'], ['amazon', 'Amazon', 'ecom'], ['ebay', 'eBay', 'ecom'], ['shopee', 'Shopee', 'ecom'], ['lazada', 'Lazada', 'ecom'], ['walmart', 'Walmart', 'ecom'],
       ['stripe', 'Stripe', 'payment'], ['paypal', 'PayPal', 'payment'],
       ['fedex', 'FedEx', 'shipping'], ['usps', 'USPS', 'shipping'], ['ups', 'UPS', 'shipping'], ['shippo', 'Shippo', 'shipping'], ['google_sheet', 'Google Sheets', 'tools']];
  return list;
};
const CONNECTED = r => r === 'bd' ? ['shopify', 'daraz', 'woocommerce', 'bkash', 'pathao', 'steadfast'] : ['shopify', 'amazon', 'ebay', 'stripe', 'fedex', 'shippo'];

function activity(r) {
  const S = R[r];
  const mk = (subject, time, ago) => ({ id: Math.random() * 1e6 | 0, subject, url: '', method: 'POST', ip: '', action: 'create', user: { first_name: 'Ayaan', last_name: 'Northline' }, created_date: '2026-11-24', created_time: time, created_ago: ago });
  const today = [mk('Order #1042 shipped with ' + S.courier, '02:05 PM', '12 minutes ago'), mk('Payment received for #1042 via ' + S.pay, '11:49 AM', '2 hours ago'),
    mk('New order #1042 from ' + S.channel, '11:47 AM', '2 hours ago'), mk('Stock synced to ' + S.marketName + ' (8 products)', '11:30 AM', '3 hours ago'), mk('Purchase PO-0318 received', '09:12 AM', '5 hours ago')];
  return { all: today, today, yesterday: today.slice(2), last_7_days: today, last_30_days: today };
}

const LOGOS = { shopify: 'shopify.png', woocommerce: 'wocommerce-logo.png', daraz: 'daraz.png', amazon: 'amazon-logo.png', ebay: 'ebay-logo.png', lazada: 'lazada-logo.png', shopee: 'shopee.png', walmart: 'walmart.png',
  bkash: 'bkash.png', nagad: 'nagad.png', aamarpay: 'aamarpay_logo.png', stripe: 'stripe-logo.png', paypal: 'paypal-logo.png', razorpay: 'paddle.png',
  pathao: 'pathao.png', steadfast: 'steadfast.png', ecourier: 'ecourier.png', sundarban: 'bd_sundarban_courier_main.png', fedex: 'fedex_logo.png', usps: 'united-states-postal-service-logo.png', ups: 'ups-logo.png', shippo: 'shippo.png',
  google_sheet: '../google_sheet-logo.png' };
const ADDON_DESC = { ecom: 'Sync products, stock and orders with {n} automatically.', payment: 'Accept {n} payments and match them to orders.', shipping: 'Book {n} parcels and track delivery from each order.', tools: 'Two-way sync your catalogue with {n}.' };
function aiDescription(r) {
  return '<p>Meet your new everyday layer. The <strong>Northline Black Hoodie</strong> is cut from 400gsm brushed cotton fleece for a soft, structured drape that keeps its shape wash after wash.</p>' +
    '<ul><li>Relaxed fit with dropped shoulders</li><li>Double-lined hood with flat drawcords</li><li>Ribbed cuffs and hem, kangaroo pocket</li></ul>' +
    '<p>Layer it over a tee on cold mornings or wear it solo on weekends. Available in S–XL.</p>';
}

module.exports = { LOGOS, ADDON_DESC, aiDescription, activity, R, PRODUCTS, ASSET, ok, page, permissions, product, customer, invoice, salesReport, storeSummary, storeOverview, settings, ADDONS, CONNECTED, price };

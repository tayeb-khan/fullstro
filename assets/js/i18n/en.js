/* English copy. {tokens} are filled per region (see FS_CONFIG.regions[*].sample).
   HTML inside strings is trusted markup authored here, never visitor input. */
window.FS_I18N = window.FS_I18N || {};
window.FS_I18N.en = {
  meta: {
    title: 'FullStro: Run every channel from one AI-powered dashboard',
    description: 'Sync inventory, orders, payments, shipping and customer chats across every channel you sell on. Build your store with AI. Start your free trial.'
  },

  common: {
    and: 'and', or: 'or', skip: 'Skip to content',
    you: 'you', yourStore: 'your store', close: 'Close',
    illustrative: 'Illustrative example'
  },

  nav: {
    product: 'How it works', agent: 'Ask Stro', integrations: 'Integrations', ai: 'AI Builder',
    inbox: 'Inbox', pricing: 'Pricing', templates: 'Templates',
    login: 'Log in', trial: 'Start free trial', menu: 'Menu',
    language: 'Language', region: 'Pricing region',
    regionBd: 'Bangladesh', regionGlobal: 'Global',
    regionHint: 'Changes currency, prices and local partners. Language stays the same.'
  },

  hero: {
    ai: 'AI-Powered',
    eyebrow: 'For sellers on more than one channel',
    title: 'Sell everywhere.<br>Run it all <span class="grad-text">from one place.</span>',
    sub: 'You sell on {channel}, your website and {market}, and you check a different app for each one. FullStro keeps your stock, orders, payments and deliveries in sync, and its AI handles the busywork for you.',
    ctaTrial: 'Start Your Free Trial',
    trust: {
      rating: '<b>{rating}</b> rating from merchants',
      merchants: '<b>{n}+</b> merchants',
      ai: 'AI-powered',
      trial: '14-day free trial',
      refund: '30-day refund'
    },
    dash: {
      url: 'app.fullstro.com/dashboard',
      title: 'Your store, live',
      live: 'Live',
      sales: 'Today\'s sales', orders: 'Orders', synced: 'Channels synced',
      steps: ['Inventory synced', 'Order received', 'Payment confirmed', 'Shipped'],
      events: [
        'Black Hoodie · 24 left, the same on all channels',
        '#1042 from {channel} · {customer}',
        '{price} via {pay} · invoice sent',
        '{courier} booked · tracking sent to {customer}'
      ],
      toast: ['Stock updated on 3 channels', 'New order #1042', 'Payment received', 'Out for delivery'],
      ai: 'Stro AI: “Black Hoodie is selling fast. You\'ll run out in 6 days. Reorder now?”'
    }
  },

  goal: {
    eyebrow: 'Why FullStro exists',
    title: 'One goal: <span class="grad-text">you run the business, not the tabs.</span>',
    sub: 'Ask Stro what FullStro is for. Every answer comes back to the same promise.',
    name: 'Stro',
    status: 'FullStro AI · online',
    replay: 'Replay the conversation',
    done: '✦ That\'s the whole goal: sell everywhere, run it all from one place.',
    pillars: [
      'Every channel in one place',
      'Stock and orders always in sync',
      'Payments and delivery on autopilot',
      'AI that does the busywork'
    ],
    // Plays on its own when the card scrolls into view. pillar = which goal line lights up.
    intro: [
      { me: 'I sell on {channel}, {market} and my own website. Most of my day is switching tabs. 😩' },
      { bot: 'That\'s exactly why FullStro exists. Our goal is simple: you sell everywhere, and run it all from <b>one place</b>.', pillar: 0 },
      { me: 'One place for everything? Even stock?' },
      { bot: 'Even stock. Change a price or a quantity once and {channel}, {market} and your website all update. No more overselling.', pillar: 1 }
    ],
    ask: 'Ask Stro about',
    topics: [
      {
        q: 'What happens when an order comes in?',
        a: [
          'It lands in one list with every other order, whatever channel it came from.',
          '{customer} pays with {pay}, I book {courier} and send the tracking link. You just pack the box. 📦'
        ],
        pillar: 2
      },
      {
        q: 'Where does the AI come in?',
        a: [
          'I watch your store around the clock. I warn you before a best-seller runs out, write product descriptions and answer the usual customer questions.',
          'You stay in charge: I suggest, you approve. ✦'
        ],
        pillar: 3
      },
      {
        q: 'Is it too much for a small team?',
        a: [
          'Not at all. Most merchants start with one channel and add the rest when they\'re ready. No developer, no setup fees.',
          'The point is to give you hours back, not another tool to learn.'
        ],
        pillar: 0
      },
      {
        q: 'So what\'s the goal, in one line?',
        a: [
          'Less admin, more selling. 🚀 Every channel, every order and every delivery in one place, with AI doing the busywork.'
        ],
        all: true
      }
    ],
    cta: 'Start your free trial →',
    typing: 'Stro is typing…'
  },

  story: {
    eyebrow: 'Sound familiar?',
    title: 'Running your store shouldn\'t mean <span class="grad-text">checking five dashboards.</span>',
    sub: 'Here\'s your morning before FullStro, and with it. Drag the handle and compare.',
    before: 'Before FullStro',
    after: 'With FullStro',
    beforeApps: [
      { app: '{channel} inbox', line: '23 unread. Someone wants to know if size L is in stock.', badge: '23' },
      { app: 'Stock spreadsheet', line: 'Last updated yesterday. Or the day before?', badge: '!' },
      { app: '{market} seller center', line: 'You oversold the Black Hoodie. Again.', badge: '3' },
      { app: '{courier} portal', line: 'Copy-paste 14 addresses, one at a time.', badge: '14' },
      { app: 'Payments app', line: 'Which of these payments goes with which order?', badge: '?' }
    ],
    afterTitle: 'Good morning. Here\'s everything.',
    afterItems: [
      '14 new orders from every channel, in one list',
      'Stock matches everywhere, updated in real time',
      'All payments matched to their orders automatically',
      'Labels printed, couriers booked, tracking sent',
      'AI already answered 19 of 23 messages'
    ],
    metrics: [
      { label: 'Apps open', before: 7, after: 1 },
      { label: 'Hours a day on admin', before: 3.5, after: 0.5 },
      { label: 'Oversold orders a month', before: 12, after: 0 }
    ],
    handle: 'Drag to compare',
    cta: 'See how it works →'
  },

  agent: {
    eyebrow: 'Meet Stro, your AI guide',
    title: 'Tell Stro what you sell. <span class="grad-text">Watch FullStro set itself up.</span>',
    sub: 'Pick an option or type your own. The modules on the right rearrange around your business.',
    name: 'Stro',
    status: 'AI guide · online',
    hello: 'Hi! I\'m Stro. 👋 Tell me what you sell and I\'ll show you how FullStro runs your entire business.',
    placeholder: 'e.g. “I sell skincare on Instagram and my website”',
    send: 'Send',
    options: {
      bd: [
        { label: 'I sell clothing on Facebook + my website', text: 'I sell clothing on Facebook and my website' },
        { label: 'I have a Shopify store + Daraz', text: 'I have a Shopify store and sell on Daraz' },
        { label: 'I run a physical shop + sell online', text: 'I run a physical shop and also sell online on Facebook' },
        { label: 'I\'m just getting started', text: 'I\'m just getting started' }
      ],
      global: [
        { label: 'I sell apparel on Instagram + my website', text: 'I sell apparel on Instagram and my website' },
        { label: 'I have a Shopify store + Amazon', text: 'I have a Shopify store and sell on Amazon and eBay' },
        { label: 'I run a retail shop + sell online', text: 'I run a physical retail shop and also sell online' },
        { label: 'I\'m just getting started', text: 'I\'m just getting started' }
      ]
    },
    thinking: 'Got it. Setting up your workspace…',
    heard: 'So you sell {what} on <b>{channels}</b>. Here\'s how FullStro runs it:',
    heardNoChannel: 'You\'re starting fresh. Great timing. Here\'s how FullStro gets you selling:',
    heardStarter: 'Starting fresh? Great timing. Here\'s how FullStro gets you selling from day one:',
    products: 'your products',
    categories: { apparel: 'apparel', beauty: 'beauty products', electronics: 'electronics', food: 'food', handmade: 'handmade goods', home: 'homeware' },
    channelNames: {
      facebook: 'Facebook', instagram: 'Instagram', whatsapp: 'WhatsApp', tiktok: 'TikTok', website: 'your website',
      shopify: 'Shopify', woocommerce: 'WooCommerce', amazon: 'Amazon', ebay: 'eBay', daraz: 'Daraz',
      shopee: 'Shopee', lazada: 'Lazada', shop: 'your shop'
    },
    done: 'The highlighted modules are already working for you. Want to follow one order all the way to a doorstep?',
    follow: 'Follow an order →',
    again: 'Try another business',
    yourSetup: 'Your setup',
    forYou: 'For you',
    hub: 'FullStro',
    modules: {
      orders:    { name: 'Orders',           desc: 'Every order from every channel, in one list.' },
      inventory: { name: 'Inventory',        desc: 'One stock count, synced everywhere in real time.' },
      payments:  { name: 'Payments',         desc: 'Collect online or cash on delivery. Every payment matched to its order.' },
      shipping:  { name: 'Shipping',         desc: 'Book couriers, print labels and send tracking in one click.' },
      builder:   { name: 'AI Store Builder', desc: 'A branded online store, written and designed by AI.' },
      messaging: { name: 'Messaging',        desc: 'Messenger, WhatsApp and Instagram chats in one inbox.' }
    },
    lines: {
      orders: 'Orders from {channels} land in one list. No more tab-switching.',
      ordersStarter: 'Your first order shows up here, with the invoice made for you.',
      inventory: 'Sell one hoodie on {first} and the stock drops everywhere else in seconds.',
      inventoryShop: 'Your counter (POS) and your online stock share one count.',
      inventoryStarter: 'Add products once. Stock tracking starts on its own.',
      payments: 'Get paid with {pay}, cards or cash on delivery. All reconciled for you.',
      shipping: 'Book {courier} from the order screen. Tracking goes to your customer automatically.',
      shippingShop: 'Walk-in sale? Done. Online order? Book {courier} in one click.',
      builder: 'No website yet? Describe your brand and AI builds the store for you.',
      builderHas: 'Keep {store}. Use the builder for campaigns and landing pages.',
      messaging: '{social} messages land in one inbox, and AI answers the easy ones.',
      messagingNone: 'Add chat to your store and AI answers the easy questions.'
    }
  },

  journey: {
    eyebrow: 'One order, start to finish',
    title: 'Follow <span class="grad-text">Order #1042</span> from click to doorstep.',
    sub: 'These are real FullStro screens, step by step. Hover to pause, or tap any step.',
    product: 'Black Hoodie', variant: 'Size L · Black',
    paused: 'Paused', playing: 'Auto-playing',
    stages: [
      { name: 'Order received',          line: 'From {channel}, your website or {market}, every order lands in one list.', you: 'You never have to switch tabs again.' },
      { name: 'Inventory checked',       line: 'FullStro reserves the item and updates the stock count on every channel.', you: 'You\'ll never sell something you don\'t have.' },
      { name: 'Payment confirmed',       line: '{pay}, a card or cash on delivery: the payment is matched and the invoice is sent.', you: 'You stop matching payments to orders by hand.' },
      { name: 'Packed & labeled',        line: 'A packing slip and a {courier} label, printed together.', you: 'You don\'t copy-paste a single address.' },
      { name: 'Shipped, tracking live',  line: 'The courier is booked and tracking updates come in by webhook.', you: 'Your customer stops asking “where\'s my order?”' },
      { name: 'Delivered & notified',    line: '{customer} gets a delivery message and a review request.', you: 'You get a five-star review without lifting a finger.' }
    ],
    // What the real FullStro screens show during each step (one camera move each)
    ops: [
      ['#1042 lands in All Orders, next to every other order', 'The sales channel is tagged on the row', 'Its status is tracked from the first minute'],
      ['Black Hoodie: every variant, one stock list', 'Stock drops from 24 to 23 and syncs to every channel'],
      ['{pay} payment matched, transaction ID attached', 'Total paid equals the order value, nothing due', 'Marked PAID automatically'],
      ['Packing slip: Print or Thermal Print, one click', 'Ship-to address filled in from the order', 'Book {courier} straight from the order', 'Shipping label ready to print'],
      ['{courier} updates arrive on the order by themselves', 'Your order list shows SHIPPED, no clicks needed'],
      ['{courier}\'s final update marks it DELIVERED', 'The full history stays on the order, pickup to doorstep']
    ],
    smsTo: 'SMS to {customer}',
    ui: {
      newOrder: 'New order', via: 'via', customer: 'Customer', total: 'Total',
      stock: 'Stock', reserved: 'Reserved', available: 'Available', syncedTo: 'Synced to',
      paid: 'Paid', invoice: 'Invoice', sent: 'Sent to customer',
      packing: 'Packing slip', label: 'Shipping label', weight: 'Weight', print: 'Printed',
      tracking: 'Tracking', picked: 'Picked up', transit: 'In transit', out: 'Out for delivery', delivered: 'Delivered',
      sms: 'Hi {customer}, your Black Hoodie was delivered. Love it? Leave a review ⭐',
      review: 'Review request scheduled',
      shipTo: 'Ship to', website: 'Website'
    }
  },

  hub: {
    eyebrow: 'Integrations',
    title: 'Connect once. <span class="grad-text">Everything stays in sync.</span>',
    sub: 'Plug in your sales channels, payment gateways and couriers. Stock, orders and delivery status update both ways in real time. You\'ll never update a stock count or an order status by hand again.',
    tabs: { all: 'All', sell: 'Sales channels', pay: 'Payments', ship: 'Couriers' },
    kinds: { sell: 'Sales channel', pay: 'Payment gateway', ship: 'Courier' },
    sync: { products: 'Products', orders: 'Orders', inventory: 'Inventory', payments: 'Payments', shipping: 'Shipping status' },
    pick: 'Tap any channel to see what syncs.',
    whatSyncs: 'What syncs with {name}',
    twoWay: 'Real-time two-way sync',
    oneWay: 'Real-time sync',
    webhook: 'Webhook-automated updates',
    poll: 'Scheduled sync',
    soon: 'Coming soon',
    beta: 'Beta',
    detail: {
      sell: 'Change a price or a stock count in FullStro and {name} updates. Orders from {name} come straight into your one list.',
      pay: 'Every {name} payment is matched to its order and invoice the moment it clears.',
      ship: 'Book {name} from the order screen. Pickup, transit and delivery updates come back by themselves.'
    },
    more: '+ {n} more in the app',
    cta: 'Explore Integrations'
  },

  builder: {
    label: 'FullStro AI',
    title: 'Build your own online store <span class="grad-text">with AI</span>',
    sub: 'This is the real FullStro Theme Builder. Watch AI build a store from one sentence, then take the controls: drag sections, pick colours, swap images.',
    steps: [
      { t: 'Describe your brand',  d: 'A sentence is enough.' },
      { t: 'Store generated',      d: 'Layout, colours and pages, done.' },
      { t: 'AI product images',    d: 'Clean studio shots from one photo.' },
      { t: 'AI descriptions',      d: 'Copy that sells, in your tone.' },
      { t: 'Drag & drop',          d: 'Move any block. No code.' }
    ],
    inputLabel: 'Describe your brand',
    prompt: 'A minimal streetwear brand called Northline. Black hoodies, clean and cozy.',
    generate: 'Generate my store',
    generating: 'Generating…',
    brand: 'Northline',
    preview: {
      nav: ['Shop', 'New in', 'About'],
      heroTitle: 'Made for cold mornings.',
      heroSub: 'Heavyweight basics, designed to last.',
      heroCta: 'Shop the drop',
      product: 'Black Hoodie',
      addToCart: 'Add to cart',
      storyTitle: 'Why {brand}',
      storyText: 'Fewer, better pieces. Ethically made, built for every day.',
      reviewsTitle: 'Loved by 1,200+ customers',
      review: '“Softest hoodie I own. Wearing it right now.”',
      imgGen: 'Generating image…',
      imgDone: 'AI image',
      descLabel: 'AI description',
      desc: 'Meet your new everyday layer. The {brand} Black Hoodie is cut from 400gsm brushed cotton fleece, with a relaxed fit, a double-lined hood and ribbed cuffs that keep their shape wash after wash.',
      tone: ['Friendly', 'Premium', 'Playful']
    },
    blocks: { hero: 'Hero banner', products: 'Product grid', story: 'Brand story', reviews: 'Reviews' },
    dragHint: 'Drag blocks to reorder, or use the arrows.',
    up: 'Move up', down: 'Move down',
    intro: 'Scroll here and the builder plays a one-minute session. Click anything to take over.',
    narr: [
      'Describe your brand in one sentence. AI drafts the whole page.',
      'Sections, copy, images and colours: generated.',
      'Need more? Add any section from the library.',
      'Drag a section to reorder it. The page follows.',
      'Click any text on the page and type. It updates live.',
      'Swap an image from your file library.',
      'Change your brand colour. The whole store follows.',
      'Check how it looks on a phone.',
      'Publish. Your store is live.'
    ],
    yourTurn: 'Your turn: drag sections, click text, pick colours, swap images. Nothing here is saved.',
    finished: 'That\'s a store, built and published. Now try it yourself: everything here is clickable.',
    watch: 'Watch the demo',
    replay: 'Replay the demo',
    demoPrompt: 'A minimal streetwear brand called Northline. Black hoodies, clean and cozy.',
    demoHeading: 'Built for every season.',
    templatesTitle: 'Or start from a real FullStro theme',
    templatesSub: 'Live storefronts built on FullStro. Hover to scroll, tap to open.',
    templates: [
      { id: 'fashion', name: 'Default', d: 'Fashion & apparel' },
      { id: 'beauty',  name: 'Skinova', d: 'Beauty & skincare' },
      { id: 'tech',    name: 'TechStore', d: 'Electronics & gadgets' }
    ],
    open: 'Open full preview',
    preview_: 'Preview',
    ctaTry: 'Try AI Store Builder',
    ctaThemes: 'Explore Themes'
  },

  /* Real screenshots of the FullStro dashboard (demo data) */
  reel: {
    badge: 'Real FullStro dashboard',
    demo: 'Demo data',
    hero: { products: 'Top products, synced on every channel', stats: 'Today\'s numbers, live', chart: 'Sales, trending up' },
    builderTitle: 'And this is the real thing.',
    builderSub: 'The same AI tools, inside your FullStro dashboard.',
    hubTitle: 'Your Add-ons page, in the real app',
    caps: {
      'product-ai': { aiButton: 'One click: AI writes it', description: 'Keep it, or tweak it' },
      'theme-builder': { sections: 'Every section, drag to reorder', preview: 'See every change live' },
      addons: { grid: 'Connect a channel in a few clicks' }
    }
  },

  inbox: {
    eyebrow: 'Messaging inbox',
    title: 'Never miss a customer again. <span class="grad-text">One inbox. AI that actually helps.</span>',
    sub: 'Messenger, WhatsApp, Instagram and your website chat, all in one place. AI answers the easy questions. You step in whenever you want.',
    status: { beta: 'Beta', soon: 'Coming soon', live: '' },
    channels: { messenger: 'Messenger', whatsapp: 'WhatsApp', instagram: 'Instagram', web: 'Website chat' },
    all: 'All chats',
    threads: [
      { who: '{customer}', ch: 'messenger', preview: 'Is the black hoodie available in L?', time: 'now' },
      { who: '{customer2}', ch: 'whatsapp', preview: 'Where is my order #1038?', time: '2m' },
      { who: '{customer3}', ch: 'instagram', preview: 'Do you do exchanges?', time: '9m' },
      { who: 'Website visitor', ch: 'web', preview: 'How long is delivery?', time: '14m' }
    ],
    convo: {
      c1: 'Hi! Is the black hoodie available in L? Can you deliver to {city}?',
      aiTag: 'AI suggested reply',
      ai1: 'Hi {customer}! Yes, the Black Hoodie in L is in stock (24 left). Delivery to {city} takes 1–2 days with {courier}. Shall I place the order for you?',
      c2: 'Yes please! 🙌',
      orderCard: 'Order #1043 · Black Hoodie (L)',
      payCard: 'Payment link · {price}',
      paid: 'Paid via {pay} ✓',
      trackCard: 'Shipped with {courier} · tracking live',
      c3: 'Wow, that was fast. Thank you! ❤️'
    },
    actions: {
      send: 'Send AI reply', edit: 'Edit', createOrder: 'Create order', payLink: 'Send payment link',
      tracking: 'Send tracking', takeOver: 'Take over', handBack: 'Hand back to AI', replay: 'Replay'
    },
    auto: {
      // the other threads: AI already handled these
      t2: ['Where is my order #1038?', 'Your order #1038 is with {courier} and will arrive tomorrow. Track it here: fsl.ink/1038 📦'],
      t3: ['Do you do exchanges?', 'Yes! You can exchange any item within 7 days. Just reply with your order number and the size you\'d like. 🔁'],
      t4: ['How long is delivery?', 'Delivery takes 1–2 days in the city and 3–5 days elsewhere. You\'ll get tracking as soon as it ships. 🚚']
    },
    autoHandled: 'Auto-handled by AI',
    youInControl: 'You\'re in control. AI is paused for this chat.',
    typing: 'typing…',
    hint: 'Tap the glowing button to continue',
    composer: 'Type a reply…',
    benefits: [
      { t: 'Reply from one place', d: 'Every channel, one inbox, one login.' },
      { t: 'AI answers FAQs instantly', d: 'Stock, delivery, returns: handled, even at 2 a.m.' },
      { t: 'Sell right inside the chat', d: 'Create the order, collect payment and send tracking without leaving the chat.' },
      { t: 'Take over in one click', d: 'AI steps aside the moment you jump in.' }
    ],
    cta: 'Start Your Free Trial',
    ctaSub: 'Connect your first channel in under 5 minutes.'
  },

  proof: {
    eyebrow: 'Merchants talk',
    title: 'Sellers like you, <span class="grad-text">back in control.</span>',
    quotes: [
      ['Ali Hasan', 'E-commerce business owner', 'I manage orders, stock, POS, the payment gateway and couriers together now. Everything is finally in one place.'],
      ['Sabrina Tanvir', 'Handmade product brand', 'I built my website myself, I update products whenever I want, and I track every order from one dashboard.'],
      ['Md. Kamrul Islam', 'Retail business owner', 'Live inventory sync and low-stock alerts save me time and stop costly mistakes.'],
      ['Nahida Parvin', 'Entrepreneur', 'I used to need three different software tools. Now all my work happens on one platform.'],
      ['Rahman Traders', 'Wholesale business', 'Our order processing time was cut in half, and we respond to customers much faster.']
    ],
    prev: 'Previous', next: 'Next'
  },

  roi: {
    eyebrow: 'Your time back',
    title: 'What would FullStro <span class="grad-text">give you back?</span>',
    sub: 'Move the sliders. You\'ll see a rough estimate for your business.',
    orders: 'Orders per day', hours: 'Hours a day on manual work', tools: 'Monthly spend on separate tools',
    toolsHint: 'Spreadsheets, a website builder, an SMS service, invoice software, a courier dashboard…',
    youGet: 'Each month, you\'d get back about',
    hoursUnit: '{n} hours',
    hUnit: '{n} h',
    days: 'That\'s about {n} working days for selling instead of typing.',
    dropTools: 'in separate tools you could drop',
    plan: 'fits about {n} orders a day',
    planCustom: 'a custom plan for your volume',
    cta: 'See plans for your volume →',
    fine: 'Rough estimate. It assumes FullStro automates about 60% of manual order, stock and invoice work over 26 working days. Your results will vary.'
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Pick a plan. <span class="grad-text">Start free.</span>',
    sub: 'Every plan comes with a 14-day free trial. Pay for longer and you save more.',
    subPick: 'Based on what you told Stro, <b>{plan}</b> fits you best. Every plan comes with a 14-day free trial.',
    durations: { 1: '1 month', 3: '3 months', 6: '6 months', 12: '12 months' },
    best: 'best value',
    perMonth: '/ month',
    billed: '{total} billed every {n} months',
    was: 'was {was}',
    save: 'Save {amt}',
    popular: 'Most popular',
    pick: '★ Stro\'s pick for you',
    trial: 'Start 14-day trial',
    custom: 'Custom', customSub: 'built around you', discuss: 'Let\'s talk →',
    plans: {
      launch: { name: 'Launch', tag: 'Kickstart big possibilities for your small business.',
        feats: ['{team} team members', '{wh} warehouses / locations', '{inv} invoices / month', 'Unlimited products', 'Storefront + white label', 'API for 1 domain · 3 add-ons', '1 POS counter per warehouse', '3-year order & report history'] },
      growth: { name: 'Growth', tag: 'Boost your profits with this powerful package.',
        feats: ['{team} team members', '{wh} warehouses / locations', '{inv} invoices / month', 'Unlimited products', 'Storefront + white label', '5 add-on integrations', '5-year order & report history'] },
      empire: { name: 'Empire', tag: 'Running a big business? Everything you need to scale smart.',
        feats: ['{team} team members', '{wh} warehouses / locations', '{inv} invoices / month', 'Unlimited products', 'Storefront + white label', 'API for 3 domains · 10 add-ons', 'Unlimited order & report history'] },
      enterprise: { name: 'Enterprise', tag: 'Custom features and workflows for large operations.',
        feats: ['Custom features & workflows', 'Multi-store, multi-team, multi-domain', 'Dedicated account manager', 'Priority support', 'Advanced API, access control & logs'] }
    },
    includes: 'Every plan includes unlimited customers, products and storage · bulk CSV/Excel import and export · SMS gateway and SMTP · low-stock alerts · webhooks · 24/7 live chat support',
    foot: ['🎁 14-day free trial', '↩️ 30-day no-questions-asked refund', '🔒 SSL-secured payment'],
    regionBd: 'Showing <b>Bangladesh</b> pricing in BDT. It\'s for businesses located in Bangladesh. <button type="button" data-region="global">Not in Bangladesh? See global pricing</button>',
    regionGlobal: 'Showing <b>global</b> pricing in USD. <button type="button" data-region="bd">In Bangladesh? See BDT pricing</button>'
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Your questions, <span class="grad-text">answered</span>',
    sub: 'Tap a question and Stro answers it. Can\'t find yours? <a href="#agent">Ask Stro directly</a>.',
    items: [
      ['What is FullStro?', 'An all-in-one commerce platform. It runs your inventory, orders, payments, shipping, customer chats and your own online store, across every channel you sell on.'],
      ['Which channels can I connect?', 'Shopify, WooCommerce, Amazon, eBay, Daraz, Shopee and Lazada today, plus payment gateways and couriers. Your stock and orders stay in sync both ways.'],
      ['Do I need a developer?', 'No. Connecting channels, building your store with AI and customising it are all point-and-click.'],
      ['How does the AI Store Builder work?', 'Describe your brand in a sentence. AI creates the layout, writes product descriptions and generates product images. Then you drag blocks around to make it yours.'],
      ['Does it support multiple stores or warehouses?', 'Yes. Each store gets its own stock, staff access, reports and sales, all from one login.'],
      ['Can my team use it?', 'Yes. Give each person a role and permissions, so they only see what they need.'],
      ['Can it handle returns and exchanges?', 'Yes. Returns are tracked with the reason, the type (refund or exchange) and the status.'],
      ['Is my data secure?', 'Yes. Triple-layer API protection, encrypted connections (SSL), protection against SQL injection and DDoS, daily backups and activity logs.']
    ]
  },

  final: {
    title: 'Your store, running itself. <span>Starting today.</span>',
    sub: 'Start your free trial and connect your first channel in minutes. Or talk to a real person on our team. We\'re happy to help.',
    trial: 'Start Your Free Trial', contact: 'Talk to us',
    whatsapp: 'WhatsApp us', messenger: 'Messenger'
  },

  footer: {
    blurb: 'FullStro is the all-in-one commerce platform for multi-channel sellers: inventory, orders, payments, shipping, chat and an AI store builder, in one place.',
    company: 'Company', resources: 'Resources', legal: 'Legal',
    links: {
      home: 'Home', pricing: 'Pricing', contact: 'Contact', docs: 'Documentation',
      roadmap: 'Roadmap', features: 'All features', integrations: 'Integrations', templates: 'Templates',
      terms: 'Terms & Conditions', privacy: 'Privacy Policy', cancellation: 'Cancellation Policy', refund: 'Refund Policy'
    },
    rights: 'FullStro © {year} · A product of IT Clan BD',
    trade: 'Trade licence: TRAD/DNCC/023928/2022'
  },

  /* The floating Stro bubble speaks once per section as you scroll */
  tips: {
    story: 'Drag the handle. Feel the difference. 😮‍💨',
    agent: 'Tell me what you sell and I\'ll set things up for you.',
    journey: 'Hover over the order to pause it anytime.',
    hub: 'Tap a channel to see exactly what syncs.',
    builder: 'Watch the builder, or click anything to take over.',
    inbox: 'Tap the glowing button. You\'re the merchant now.',
    pricing: 'I\'ve marked the plan I\'d pick for you.',
    pricingNoPick: 'Not sure which plan fits? Tell me what you sell first.',
    faq: 'Can\'t find your question? Ask me directly.',
    regionAuto: 'I\'m showing you <b>{region}</b> prices in {currency}. Not right? Change it in the menu.'
  }
};

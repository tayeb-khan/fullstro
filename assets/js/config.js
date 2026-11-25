/* ==========================================================================
   FullStro homepage: business configuration
   --------------------------------------------------------------------------
   One design for everyone. Two things change per visitor:
     • LANGUAGE (en / bn)     – chosen by the visitor, any region can use any language
     • REGION   (bd / global) – detected automatically, visitor can override
   The region decides currency, plan prices, local partners, sample data and
   contact details. All visible copy lives in assets/js/i18n/<lang>.js.
   ========================================================================== */
window.FS_CONFIG = {

  /* 'query' → ?lang=bn   (works on any static host, no setup)
     'path'  → /bn/       (needs the rewrite in _redirects / functions/_middleware.js) */
  routing: 'path',

  languages: {
    en: { label: 'English', short: 'EN', htmlLang: 'en', numberLocale: 'en-US' },
    bn: { label: 'বাংলা',    short: 'বাং', htmlLang: 'bn', numberLocale: 'bn-BD' }
  },
  defaultLanguage: 'en',

  // Hero background loop (rendered by tools/hero-video; no text in it, so it suits every language).
  // Swap these paths for real footage any time; set enabled:false to turn the background off.
  heroVideo: {
    enabled: true,
    hd: { webm: 'assets/video/hero-shipping.webm', mp4: 'assets/video/hero-shipping.mp4', poster: 'assets/img/hero/shipping-poster.webp' },
    sd: { webm: 'assets/video/hero-shipping-720.webm', mp4: 'assets/video/hero-shipping-720.mp4', poster: 'assets/img/hero/shipping-poster-720.webp' }
  },

  /* Shared links (region-independent) */
  links: {
    login: 'https://fullstro.com/app/login',
    roadmap: 'https://trello.com/b/JF0aj6HF/fullstrocom-roadmap',
    social: {
      facebook: 'https://www.facebook.com/FullStroBD/',
      instagram: 'https://www.instagram.com/fullstro.bd/',
      linkedin: 'https://www.linkedin.com/company/fullstrobd/',
      youtube: 'https://www.youtube.com/@fullstrobd',
      x: 'https://twitter.com/Full_stro'
    }
  },

  /* Shown in the hero trust row. Leave null to hide a badge rather than
     publish a number nobody has checked. */
  trust: { rating: 4.9, merchants: null },

  /* Product status flags so the page never over-promises. Flip when shipped. */
  status: {
    messagingInbox: 'beta',   // 'live' | 'beta' | 'soon' – no inbox service found in the repos yet
    facebookShop: 'soon',     // Facebook & Instagram Shops catalogue sync
    tiktokShop: 'soon'
  },

  regions: {
    /* ---------------------------------------------------------------- BD */
    bd: {
      code: 'BD', flag: '🇧🇩',
      currency: 'BDT', symbol: '৳', moneyLocale: 'en-IN',
      // Bangladesh pricing is restricted to businesses located in Bangladesh.
      restricted: true,
      timezones: ['Asia/Dhaka'],
      // Sample data used in every live demo on the page
      sample: {
        channel: 'Facebook', market: 'Daraz', pay: 'bKash', courier: 'Pathao',
        city: 'Dhanmondi, Dhaka', customer: 'Nusrat', customer2: 'Rafi', customer3: 'Tasnim',
        price: 1850, warehouse: 'Dhaka Main', phonePrefix: '+880'
      },
      // Same sample, written the way a Bangla reader expects it
      sampleBn: {
        channel: 'ফেসবুক', market: 'দারাজ', pay: 'বিকাশ', courier: 'পাঠাও',
        city: 'ধানমন্ডি, ঢাকা', customer: 'নুসরাত', customer2: 'রাফি', customer3: 'তাসনিম', warehouse: 'ঢাকা মেইন'
      },
      links: {
        trial: 'https://fullstro.com/bd-en/pricing',
        contact: 'https://fullstro.com/bd-en/contact/',
        templates: 'https://fullstro.com/bd-en/templates/',
        features: 'https://fullstro.com/bd-en/features',
        integrations: 'https://fullstro.com/bd-en/integrations',
        docs: 'https://fullstro.com/bd-en/documentation',
        terms: 'https://fullstro.com/bd-en/terms-conditions',
        privacy: 'https://fullstro.com/bd-en/privacy-policy',
        cancellation: 'https://fullstro.com/bd-en/cancellation-policy',
        refund: 'https://fullstro.com/bd-en/refund-policy'
      },
      contact: {
        whatsapp: 'https://wa.me/8801339623585',
        messenger: 'https://m.me/634227079754405',
        phone: '+8801339623585', phoneLabel: '+880 1339-623585',
        address: '274 Shah Kabir Mazar Road, Chalabon, Dakshin Khan, Dhaka-1230'
      },
      /* NOTE: the live fullstro.com/bd-en shows ৳1,350 (unnamed tier), Launch ৳2,225,
         Growth ৳4,450, Empire (no price). The mapping below is the one used on the
         previous homepage draft. Confirm with the pricing owner before launch. */
      plans: [
        { id: 'launch', price: {1:1350,3:3750,6:7200,12:13800}, was: {1:1500,3:4200,6:8100,12:15600}, team: 3,  wh: 2, inv: 500 },
        { id: 'growth', price: {1:2225,3:6150,6:12000,12:23400}, was: {1:2500,3:6900,6:13500,12:26400}, team: 10, wh: 3, inv: 3000, popular: true },
        { id: 'empire', price: {1:4450,3:12000,6:22950,12:42600}, was: {1:5000,3:13500,6:25800,12:48000}, team: 15, wh: 5, inv: 6000 },
        { id: 'enterprise', custom: true }
      ],
      roi: { toolsMax: 20000, toolsStep: 500, toolsDefault: 3000 },
      integrations: {
        sell: ['shopify','woocommerce','daraz','amazon','ebay','facebook','tiktok','sheets'],
        pay:  ['bkash','nagad','sslcommerz','aamarpay','stripe'],
        ship: ['pathao','steadfast','ecourier','sundarban','karatoa']
      }
    },

    /* ------------------------------------------------------------ GLOBAL */
    global: {
      code: 'GLOBAL', flag: '🌐',
      currency: 'USD', symbol: '$', moneyLocale: 'en-US',
      restricted: false,
      timezones: [],
      sample: {
        channel: 'Instagram', market: 'Amazon', pay: 'Stripe', courier: 'FedEx',
        city: 'Austin, TX', customer: 'Emma', customer2: 'Liam', customer3: 'Sofia',
        price: 49, warehouse: 'Main Warehouse', phonePrefix: '+1'
      },
      links: {
        trial: 'https://fullstro.com/app/register',      // TODO: confirm global sign-up URL
        contact: 'https://fullstro.com/contact',
        templates: 'https://fullstro.com/templates/',     // TODO: confirm
        features: 'https://fullstro.com/features',        // TODO: confirm
        integrations: 'https://fullstro.com/integrations',// TODO: confirm
        docs: 'https://fullstro.com/documentation',
        terms: 'https://fullstro.com/terms-conditions',
        privacy: 'https://fullstro.com/privacy-policy',
        cancellation: 'https://fullstro.com/cancellation-policy',
        refund: 'https://fullstro.com/refund-policy'
      },
      contact: {
        whatsapp: 'https://wa.me/8801339623585',
        messenger: 'https://m.me/634227079754405',
        phone: '+8801339623585', phoneLabel: '+880 1339-623585',
        address: '274 Shah Kabir Mazar Road, Chalabon, Dakshin Khan, Dhaka-1230, Bangladesh'
      },
      /* TODO: PLACEHOLDER USD PRICES. The live site does not publish USD prices
         that could be checked. Replace with the real Global plan-type prices from
         the auth service (PlanTypeSeeder: 'Global' / '$') before launch. */
      pricesConfirmed: false,
      plans: [
        { id: 'launch', price: {1:19,3:54,6:102,12:192}, was: {1:22,3:63,6:120,12:228}, team: 3,  wh: 2, inv: 500 },
        { id: 'growth', price: {1:39,3:111,6:210,12:396}, was: {1:45,3:129,6:246,12:468}, team: 10, wh: 3, inv: 3000, popular: true },
        { id: 'empire', price: {1:79,3:225,6:426,12:804}, was: {1:90,3:258,6:492,12:936}, team: 15, wh: 5, inv: 6000 },
        { id: 'enterprise', custom: true }
      ],
      roi: { toolsMax: 600, toolsStep: 10, toolsDefault: 120 },
      integrations: {
        sell: ['shopify','woocommerce','amazon','ebay','shopee','lazada','facebook','tiktok','sheets'],
        pay:  ['stripe','paypal','razorpay'],
        ship: ['fedex','usps','shippo']
      }
    }
  },

  /* Logos: assets/img/logos (from the tenant app's add-on set). mark 'word' = wordmark
     shown alone, 'icon' = icon + name. No logo → letter tile.
     Every integration the page can show. `soon` reads from status flags.
     sync: what flows through it. two: two-way sync. hook: webhook-driven. */
  integrationCatalog: {
    shopify:     { name: 'Shopify',      kind: 'sell', color: '#5E8E3E', sync: ['products','orders','inventory'], two: true, hook: true, logo: 'shopify.png', mark: 'word' },
    woocommerce: { name: 'WooCommerce',  kind: 'sell', color: '#7F54B3', sync: ['products','orders','inventory'], two: true, hook: true, logo: 'woocommerce.png', mark: 'icon' },
    amazon:      { name: 'Amazon',       kind: 'sell', color: '#FF9900', sync: ['products','orders','inventory'], two: true, hook: false, logo: 'amazon.png', mark: 'word' },
    ebay:        { name: 'eBay',         kind: 'sell', color: '#E53238', sync: ['products','orders','inventory'], two: true, hook: false, logo: 'ebay.png', mark: 'word' },
    daraz:       { name: 'Daraz',        kind: 'sell', color: '#F85606', sync: ['products','orders','inventory'], two: true, hook: true, logo: 'daraz.png', mark: 'word' },
    shopee:      { name: 'Shopee',       kind: 'sell', color: '#EE4D2D', sync: ['products','orders','inventory'], two: true, hook: true, logo: 'shopee.png', mark: 'word' },
    lazada:      { name: 'Lazada',       kind: 'sell', color: '#0F146D', sync: ['products','orders','inventory'], two: true, hook: true, logo: 'lazada.png', mark: 'icon' },
    facebook:    { name: 'Facebook & Instagram', short: 'FB & IG', kind: 'sell', color: '#1877F2', sync: ['products','inventory'], two: false, hook: false, statusKey: 'facebookShop', logo: 'facebook.svg', mark: 'icon' },
    tiktok:      { name: 'TikTok Shop',  kind: 'sell', color: '#111111', sync: ['products','orders','inventory'], two: true, hook: true, statusKey: 'tiktokShop', logo: 'tiktok.svg', mark: 'icon' },
    sheets:      { name: 'Google Sheets',kind: 'sell', color: '#0F9D58', sync: ['products','inventory'], two: true, hook: false, logo: 'sheets.png', mark: 'icon' },
    bkash:       { name: 'bKash',        kind: 'pay',  color: '#E2136E', sync: ['payments','orders'], two: false, hook: true, logo: 'bkash.png', mark: 'word' },
    nagad:       { name: 'Nagad',        kind: 'pay',  color: '#F26522', sync: ['payments','orders'], two: false, hook: true, logo: 'nagad.png', mark: 'word' },
    sslcommerz:  { name: 'SSLCommerz',   kind: 'pay',  color: '#2E6EB5', sync: ['payments','orders'], two: false, hook: true },
    aamarpay:    { name: 'aamarPay',     kind: 'pay',  color: '#0E9F6E', sync: ['payments','orders'], two: false, hook: true, logo: 'aamarpay.png', mark: 'word' },
    stripe:      { name: 'Stripe',       kind: 'pay',  color: '#635BFF', sync: ['payments','orders'], two: false, hook: true, logo: 'stripe.png', mark: 'word' },
    paypal:      { name: 'PayPal',       kind: 'pay',  color: '#003087', sync: ['payments','orders'], two: false, hook: true, logo: 'paypal.png', mark: 'word' },
    razorpay:    { name: 'Razorpay',     kind: 'pay',  color: '#0C2451', sync: ['payments','orders'], two: false, hook: true },
    pathao:      { name: 'Pathao',       kind: 'ship', color: '#E6202B', sync: ['shipping','orders'], two: true, hook: true, logo: 'pathao.png', mark: 'word' },
    steadfast:   { name: 'Steadfast',    kind: 'ship', color: '#14B886', sync: ['shipping','orders'], two: true, hook: true, logo: 'steadfast.png', mark: 'word' },
    ecourier:    { name: 'eCourier',     kind: 'ship', color: '#F59E0B', sync: ['shipping','orders'], two: true, hook: true, logo: 'ecourier.png', mark: 'word' },
    sundarban:   { name: 'Sundarban',    kind: 'ship', color: '#1C75BC', sync: ['shipping','orders'], two: true, hook: false, logo: 'sundarban.png', mark: 'icon' },
    karatoa:{ name: 'Karatoa',      kind: 'ship', color: '#7C3AED', sync: ['shipping','orders'], two: true, hook: false, logo: 'karatoa.png', mark: 'word' },
    fedex:       { name: 'FedEx',        kind: 'ship', color: '#4D148C', sync: ['shipping','orders'], two: true, hook: false, logo: 'fedex.png', mark: 'word' },
    usps:        { name: 'USPS',         kind: 'ship', color: '#004B87', sync: ['shipping','orders'], two: true, hook: false, logo: 'usps.png', mark: 'word' },
    shippo:      { name: 'Shippo',       kind: 'ship', color: '#1B1B1B', sync: ['shipping','orders'], two: true, hook: true, logo: 'shippo.png', mark: 'word' }
  },

  /* Stro free-text understanding (language-independent keyword lists).
     Each keyword must start a word ("art" won't match "started"); a trailing
     space means it must also end one ("pos " won't match "post"). */
  stroKeywords: {
    channels: {
      facebook:  ['facebook','fb','f-commerce','fcommerce','ফেসবুক','পেজ'],
      instagram: ['instagram','insta','ig ','ইনস্টা'],
      whatsapp:  ['whatsapp','wa ','হোয়াটসঅ্যাপ'],
      tiktok:    ['tiktok','tik tok','টিকটক'],
      website:   ['website','web site','own site','my site','online store','ওয়েবসাইট','সাইট'],
      shopify:   ['shopify','শপিফাই'],
      woocommerce:['woocommerce','woo','wordpress','উকমার্স'],
      amazon:    ['amazon','অ্যামাজন'],
      ebay:      ['ebay','ইবে'],
      daraz:     ['daraz','দারাজ'],
      shopee:    ['shopee'],
      lazada:    ['lazada'],
      shop:      ['physical','retail','showroom','outlet','pos ','offline','my shop ','a shop ','own shop ','shop and','shop +','brick','দোকান','শোরুম','আউটলেট']
    },
    categories: {
      apparel:     ['apparel','cloth','fashion','hoodie','shirt','dress','saree','wear','পোশাক','জামা','শাড়ি','ফ্যাশন'],
      beauty:      ['beauty','skin','cosmetic','makeup','serum','প্রসাধনী','স্কিন','বিউটি'],
      electronics: ['electronic','gadget','phone','mobile','headphone','ইলেকট্রনিক','গ্যাজেট','মোবাইল'],
      food:        ['food','grocery','snack','coffee','tea ','honey','খাবার','মুদি','মধু'],
      handmade:    ['handmade','craft','jewel','art','হাতে','কারুশিল্প','গয়না'],
      home:        ['home','decor','furniture','kitchen','ঘর','আসবাব']
    }
  }
};

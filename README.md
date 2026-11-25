# FullStro homepage (redesign)

One page, one design, for every visitor. Two things adapt:

| | Who decides | What changes |
|---|---|---|
| **Language** (`en`, `bn`) | the visitor (switcher in the nav), remembered | all copy, digits, fonts |
| **Region** (`bd`, `global`) | automatic, visitor can override | currency, plan prices, local payment/courier partners, demo sample data, contact + legal links |

They are independent: a merchant in Dhaka can read English and see ৳ prices; a Bangla speaker abroad can read Bangla and see $ prices.

## Run it

```bash
python3 tools/dev-server.py          # http://localhost:8080   (Bangla: /bn/)
```

Useful URLs: `/?region=bd`, `/?region=global`, `/?country=US` (fakes the edge geo cookie), `/?lang=bn`.

## Files

```
index.html                 markup only; text comes from data-i18n keys
assets/css/main.css        all styles (brand tokens at the top)
assets/css/real.css        screenshot player (Reel), logo chips, theme gallery, lightbox
assets/css/builder.css     Theme Builder replica (values measured from the real builder)
assets/js/builder.js       Theme Builder replica: drag & drop, section library, inspector,
                           colour picker, image library/upload, AI assistant, device preview,
                           publish, plus the autopilot demo (stops on the visitor's first click)
assets/img/builder/        storefront product art used inside the builder (from tools/capture-app/art.js)
assets/img/app/            real tenant-dashboard screenshots per region + manifest.json (hotspots)
assets/img/logos/          partner logos from the tenant app's add-on set
assets/img/themes/         real storefront theme previews (Default, Skinova, TechStore)
tools/capture-app/         regenerates assets/img/app from the real tenant app (see its README)
tools/hero-video/          hero background loop: scene.html (canvas, no text) → render.js → WebM/MP4 + poster
assets/video/              hero-shipping{,-720}.{webm,mp4}; posters in assets/img/hero/
assets/js/config.js        business config: regions, prices, partners, links, status flags
assets/js/i18n/en.js       all English copy
assets/js/i18n/bn.js       all Bangla copy (same keys as en.js)
assets/js/locale.js        language + region detection, t(), money/number formatting
assets/js/app.js           every interactive section
functions/_middleware.js   Cloudflare Pages edge logic (geo cookie, /bn/, legacy redirects)
tools/dev-server.py        local server with the same routing
```

## Section order

1. Hero (over a muted 12-second shipping-floor background loop): AI-Powered pill, live dashboard cycling *Inventory synced → Order received → Payment confirmed → Shipped*, trust badges, then "Why FullStro exists": a merchant ↔ Stro conversation (auto-plays once, topic chips, each answer lights up part of the goal)
2. Problem → solution: drag-to-compare "Before FullStro / With FullStro", live metrics
3. Stro AI agent: quick options or free text; modules re-rank (FLIP animation) and explain themselves for that business
4. Order #1042 (Black Hoodie): six-stage journey on real FullStro panel screens. Each step is a short walkthrough (2–4 camera moves, 2.9 s each) narrated by `journey.ops`, with a clickable operations list; pauses on hover or focus. Falls back to drawn mock-ups when the screenshots are missing
5. Integrations hub: channels around FullStro with animated sync lines; click one to see what syncs
6. AI Store Builder: type a brand → store, AI image, AI description, drag-and-drop blocks, 3 themes
7. Messaging inbox: interactive Messenger/WhatsApp/Instagram/web chat with AI replies, order, payment and tracking in chat
8. Social proof, savings estimate, pricing (region-aware, marks Stro's recommended plan), FAQ answered by Stro, contact, footer

A floating Stro bubble comments once per section as you scroll, and tells first-time visitors which region it picked.

## How region detection works

`assets/js/locale.js` checks these in order:

1. `?region=` in the URL
2. the visitor's own earlier choice (localStorage)
3. **edge geo-IP**: cookie `fs_country` set by `functions/_middleware.js` from Cloudflare's `CF-IPCountry` (BD → `bd`, else `global`)
4. browser time zone `Asia/Dhaka`
5. browser locale ending in `-BD`
6. `global`

BD pricing carries a notice that it's for businesses located in Bangladesh, with a one-click switch.

## Hosting

**Cloudflare Pages** (recommended): deploy this folder as-is. `functions/_middleware.js`:
- 301s the old `/bd-bn` → `/bn/` and `/bd-en` → `/`, but leaves the old sub-pages that still exist (`/bd-en/pricing`, `/templates`, legal pages…) alone
- serves `/bn/` from the same `index.html`
- sets `fs_country`
- sends first-time `Accept-Language: bn` visitors to `/bn/`

**nginx** equivalent:

```nginx
location = /bd-bn { return 301 /bn/; }
location = /bd-en { return 301 /; }
location ~ ^/bn/?$ { try_files /index.html =404; }
# needs ngx_http_geoip2 (or similar) providing $geoip2_country_code
add_header Set-Cookie "fs_country=$geoip2_country_code; Path=/; Max-Age=86400; SameSite=Lax" always;
```

Without any edge setup the page still works: it falls back to time zone and browser locale, and uses `?lang=bn` URLs.

## Before launch: TODO

- [ ] **Global USD prices are placeholders** (`config.js → regions.global.plans`, `pricesConfirmed: false`). Use the real `Global` plan-type prices from the auth service. The page logs a console warning until then.
- [ ] **BD plan mapping**: the live site shows ৳1,350 (unnamed tier), Launch ৳2,225, Growth ৳4,450, Empire (no price). This page uses the older mapping Launch ৳1,350 / Growth ৳2,225 / Empire ৳4,450. Confirm which is right.
- [ ] Global sign-up, templates, features and integrations URLs (marked `TODO` in `config.js`).
- [ ] Messaging inbox is labelled **Beta** (`status.messagingInbox`); no inbox service was found in the repos. Set it to `'live'` or `'soon'` to match reality.
- [ ] Facebook & Instagram Shops and TikTok Shop show as **Coming soon** (`status.facebookShop`, `status.tiktokShop`).
- [ ] `trust.merchants` is `null` (hidden). Add a verified number to show "N+ merchants".
- [ ] Story metrics (7 apps → 1, etc.) are labelled "Illustrative example"; replace them with measured numbers if you have any.
- [ ] Optional: prerender `/` and `/bn/` to static HTML for SEO (the copy is currently rendered client-side; Google renders JS, other crawlers may not).

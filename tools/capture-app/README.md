# Real dashboard screenshots

The homepage's "video" sections (hero, Order #1042 journey, AI builder strip, add-ons strip, video thumbnail) play over **real screenshots of the tenant app** (`saas-tenant-app`), rendered with demo data. Every API call is answered from `fixtures.js`, so no request reaches a backend and no customer data ends up in an image.

## Regenerate

```bash
# 1. run the tenant app (any checkout of saas-tenant-app)
cd ../../../saas-tenant-app && npx vite --port 3417 --strictPort

# 2. capture + export (needs Google Chrome at /usr/bin/google-chrome and Python Pillow)
cd fullstro-redesign/tools/capture-app
npm install
npm run capture          # or: node capture.js <bd|global> <name...> && python3 export.py
```

Output: `assets/img/app/<name>.<bd|global>.webp` + `manifest.json` (capture size and hotspot boxes the homepage camera zooms to).

Capture just a few screens with `node capture.js <bd|global> <name...>` then `python3 export.py`: the manifest is merged, so other screens keep their entries.

Order #1042 journey screens: `orders`, `inventory`, `invoice`, `label` (Print / Thermal Print, Shipped To, shipping-label button), `courier`, `tracking`, `delivered` (same order after the courier's final "delivered" webhook).

## Files

| file | what |
|---|---|
| `fixtures.js` | demo data: Northline, Black Hoodie, order #1042, per region (BD: ৳, Nusrat, bKash, Pathao · global: $, Emma, Stripe, FedEx) |
| `router.js` | maps every API path the app calls to a fixture |
| `theme.js`, `section-defaults.json` | Theme Builder layout for the storefront capture |
| `specs.js`, `spec_fedex.js` | per screen: route, actions to reach the state, hotspot selectors |
| `shoot.js`, `capture.js` | headless Chrome capture |
| `export.py` | PNG → WebP (≤250 KB) + manifest |
| `allperms.txt` | permission list so the sidebar renders fully |

When the dashboard UI changes and a capture breaks, fix the selector in `specs.js` or the response shape in `router.js`/`fixtures.js`.

Known app quirks visible in or worked around by the captures:
- the FedEx form shows "required" errors under filled fields (antd Input + react-hook-form `register`); the capture hides `.ic-fdx-error`
- number widgets render as "9.00"
- the order source shows "storefront": the app has no Facebook order source

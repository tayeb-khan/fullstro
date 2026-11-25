"""Convert captures to WebP (1600px wide, <=250 KB) into fullstro-redesign/assets/img/app/ and write manifest.json."""
import glob, json, os
from PIL import Image

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots', 'final')
DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets', 'img', 'app')
os.makedirs(DST, exist_ok=True)
NAMES = ['dashboard', 'orders', 'inventory', 'invoice', 'label', 'courier', 'tracking', 'delivered', 'product-ai', 'theme-builder', 'addons']

for f in sorted(glob.glob(os.path.join(SRC, '*.png'))):
    base = os.path.basename(f)[:-4]
    if base.split('.')[0] not in NAMES:
        continue
    im = Image.open(f).convert('RGB')
    w, h = im.size
    im = im.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
    out = os.path.join(DST, base + '.webp')
    q = 82
    while True:
        im.save(out, 'WEBP', quality=q, method=6)
        if os.path.getsize(out) <= 250 * 1024 or q <= 60:
            break
        q -= 4
    print(f'{base}.webp {im.size} {os.path.getsize(out) // 1024} KB q{q}')

# Merge into the existing manifest so re-capturing a few screens keeps every other entry.
MANIFEST = os.path.join(DST, 'manifest.json')
manifest = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
for n in NAMES:
    regs = {}
    for r in ['bd', 'global']:
        p = os.path.join(SRC, f'{n}.{r}.json')
        if os.path.exists(p):
            regs[r] = json.load(open(p))
    if not regs:
        continue
    first = next(iter(regs.values()))
    entry = {'w': first['w'], 'h': first['h'], 'hotspots': regs.get('bd', first)['hotspots']}
    if len(regs) == 2 and regs['bd']['hotspots'] != regs['global']['hotspots']:
        entry['hotspotsByRegion'] = {r: v['hotspots'] for r, v in regs.items()}
    manifest[n] = entry
manifest = {n: manifest[n] for n in NAMES if n in manifest}  # stable order
json.dump(manifest, open(MANIFEST, 'w'), indent=1)
print(json.dumps(manifest))

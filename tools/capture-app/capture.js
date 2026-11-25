// node capture.js <region> <name> [<name>...]  → shots/final/<name>.<region>.png + rects json
const fs = require('fs');
const { open } = require('./shoot');
const { state } = require('./router');
const specs = require('./specs');
const OUT = __dirname + '/shots/final'; fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const [,, region, ...names] = process.argv;

(async () => {
  const { b, p, unhandled, errs } = await open(region, { scale: 2 });
  for (const name of names) {
    const s = (region === 'global' && name === 'courier') ? require('./spec_fedex') : specs[name];
    if (!s) { console.log('no spec', name); continue; }
    state.unshipped = !!s.unshipped;
    state.delivered = !!s.delivered;
    unhandled.clear(); errs.length = 0;
    await p.setViewport({ width: 1440, height: s.h || 900, deviceScaleFactor: 2 });
    if (s.before) await s.before(p, region);
    await p.goto('http://localhost:3417' + s.route, { waitUntil: 'networkidle2', timeout: 90000 });
    await new Promise(r => setTimeout(r, 3500));
    try { if (s.prep) await s.prep(p, region); } catch (e) { console.log('PREP FAIL', name, e.message); }
    await p.evaluate(() => { document.querySelectorAll('.Toastify, .ant-message, .ant-notification, [class*=toast]').forEach(e => e.remove()); document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
    await new Promise(r => setTimeout(r, 700));
    const hs = {};
    const H = s.h || 900;
    for (const [k, src] of Object.entries(s.hotspots || {})) {
      let r = await p.evaluate(src).catch(e => 'ERR ' + e.message);
      if (Array.isArray(r)) {   // clamp to the captured frame
        const x0 = Math.max(0, r[0]), y0 = Math.max(0, r[1]), x1 = Math.min(1440, r[0] + r[2]), y1 = Math.min(H, r[1] + r[3]);
        r = x1 > x0 && y1 > y0 ? [x0, y0, x1 - x0, y1 - y0] : null;
      }
      hs[k] = r;
    }
    await p.screenshot({ path: `${OUT}/${name}.${region}.png` });
    fs.writeFileSync(`${OUT}/${name}.${region}.json`, JSON.stringify({ w: 1440, h: s.h || 900, hotspots: hs }));
    console.log('##', name, region, JSON.stringify(hs));
    const e = errs.filter(e => !/Warning|Pusher|Date format|validateDOM|JSHandle/.test(e));
    if (e.length) console.log('  ERRS', e.slice(0, 3).join(' | '));
    if (unhandled.size) console.log('  UNHANDLED', [...unhandled].filter(x => !/store-front-settings|get-stripe/.test(x)).join(' | '));
  }
  await b.close();
})();

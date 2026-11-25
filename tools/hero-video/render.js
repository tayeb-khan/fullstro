// Renders scene.html frame by frame and encodes the hero background video.
//   npm install && node render.js
// Env: CHROME (default /usr/bin/google-chrome), FFMPEG (default: ffmpeg on PATH).
// Output: ../../assets/video/hero-shipping{,-720}.{webm,mp4} and ../../assets/img/hero/shipping-poster{,-720}.webp
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const puppeteer = require('puppeteer-core');

const FPS = 30, LOOP = 12, FRAMES = FPS * LOOP, POSTER_T = 10.4;
const ROOT = path.resolve(__dirname, '../..');
const VID = path.join(ROOT, 'assets/video'), IMG = path.join(ROOT, 'assets/img/hero');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const ff = args => execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

(async () => {
  fs.mkdirSync(VID, { recursive: true }); fs.mkdirSync(IMG, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hero-frames-'));
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'], headless: 'new' });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  await p.goto('file://' + path.join(__dirname, 'scene.html') + '?render', { waitUntil: 'load' });
  const canvas = await p.$('canvas');
  for (let f = 0; f < FRAMES; f++) {
    await p.evaluate(t => draw(t), f / FPS);
    await canvas.screenshot({ path: path.join(tmp, String(f).padStart(4, '0') + '.png') });
    if (f % 60 === 0) process.stdout.write(`frame ${f}/${FRAMES}\n`);
  }
  // posters straight from the canvas (no text in the scene, so one poster serves every language)
  for (const [w, name] of [[1920, 'shipping-poster.webp'], [1280, 'shipping-poster-720.webp']]) {
    const data = await p.evaluate((t, w) => {
      draw(t); const c = document.createElement('canvas'); c.width = w; c.height = w * 9 / 16;
      c.getContext('2d').drawImage(document.getElementById('c'), 0, 0, c.width, c.height);
      return c.toDataURL('image/webp', .82).split(',')[1];
    }, POSTER_T, w);
    fs.writeFileSync(path.join(IMG, name), Buffer.from(data, 'base64'));
  }
  await b.close();

  const input = ['-framerate', String(FPS), '-i', path.join(tmp, '%04d.png')];
  for (const [h, suffix, crfVp9, crf264] of [[1080, '', 36, 25], [720, '-720', 36, 26]]) {
    const scale = ['-vf', `scale=-2:${h}:flags=lanczos`];
    console.log(`encoding ${h}p webm`);
    ff([...input, ...scale, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crfVp9), '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2',
      '-g', String(FRAMES), '-pix_fmt', 'yuv420p', '-an', path.join(VID, `hero-shipping${suffix}.webm`)]);
    console.log(`encoding ${h}p mp4`);
    ff([...input, ...scale, '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', String(crf264), '-profile:v', 'high',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(VID, `hero-shipping${suffix}.mp4`)]);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  for (const f of fs.readdirSync(VID)) console.log(f, (fs.statSync(path.join(VID, f)).size / 1024).toFixed(0) + ' KB');
  for (const f of fs.readdirSync(IMG)) console.log(f, (fs.statSync(path.join(IMG, f)).size / 1024).toFixed(0) + ' KB');
})().catch(e => { console.error(e); process.exit(1); });

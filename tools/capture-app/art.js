// Flat product illustrations served as images for the demo store (no real photos).
const SHAPES = {
  hoodie: (c, l) => `<path d="M70 52c14-16 86-16 100 0l40 22 26 66-30 14-14-30v118H48V124l-14 30-30-14 26-66z" fill="${c}"/><path d="M84 50c6 30 66 30 72 0" fill="none" stroke="${l}" stroke-width="7" stroke-linecap="round"/><path d="M106 74v30M134 74v30" stroke="${l}" stroke-width="4" stroke-linecap="round"/><rect x="88" y="170" width="64" height="34" rx="12" fill="none" stroke="${l}" stroke-width="3"/><path d="M48 226h144" stroke="${l}" stroke-width="5"/>`,
  crew: (c, l) => `<path d="M76 52c14-8 74-8 88 0l46 24 24 62-30 12-16-34v122H52V116l-16 34-30-12 24-62z" fill="${c}"/><path d="M96 52c8 16 40 16 48 0" fill="none" stroke="${l}" stroke-width="6"/><path d="M52 226h136" stroke="${l}" stroke-width="5"/>`,
  tee: (c, l) => `<path d="M80 50c12-6 68-6 80 0l52 26-20 40-26-12v134H74V104l-26 12-20-40z" fill="${c}"/><path d="M98 50c8 14 36 14 44 0" fill="none" stroke="${l}" stroke-width="5"/>`,
  joggers: (c, l) => `<path d="M72 36h96l10 190-36 4-22-130-22 130-36-4z" fill="${c}"/><path d="M72 50h96" stroke="${l}" stroke-width="8"/><rect x="146" y="100" width="22" height="34" rx="4" fill="none" stroke="${l}" stroke-width="3"/><path d="M76 214h30M134 214h30" stroke="${l}" stroke-width="5"/>`,
  vest: (c, l) => `<path d="M80 40l40 30 40-30 30 20 10 170H40L50 60z" fill="${c}"/><path d="M120 70v160" stroke="${l}" stroke-width="4"/><path d="M48 100h144M46 140h148M44 180h152" stroke="${l}" stroke-width="3" opacity=".7"/>`,
  beanie: (c, l) => `<path d="M50 170c0-70 30-110 70-110s70 40 70 110z" fill="${c}"/><rect x="42" y="160" width="156" height="44" rx="12" fill="${c}"/><path d="M50 172h140M50 190h140" stroke="${l}" stroke-width="3"/><circle cx="120" cy="52" r="16" fill="${c}"/>`,
  tote: (c, l) => `<path d="M90 90c0-40 60-40 60 0" fill="none" stroke="${c}" stroke-width="10"/><path d="M50 90h140l-10 150H60z" fill="${c}"/><text x="120" y="176" font-family="Arial" font-weight="700" font-size="20" fill="${l}" text-anchor="middle">NORTHLINE</text>`,
  windbreaker: (c, l) => `<path d="M72 50c14-14 82-14 96 0l42 24 24 66-30 12-14-32v120H50V120l-14 32-30-12 24-66z" fill="${c}"/><path d="M120 50v180" stroke="${l}" stroke-width="4"/><path d="M50 130h140" stroke="#fff" stroke-width="10" opacity=".35"/>`
};
function svg(kind, color, bg = '#F1F2F6') {
  const l = /^#(?:[0-3])/.test(color) ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.18)';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 260" width="480" height="520"><rect width="240" height="260" fill="${bg}"/>${SHAPES[kind](color, l)}</svg>`;
}
module.exports = { svg };
// Transparent product cut-out, and a lifestyle-style hero banner for the storefront builder.
module.exports.cut = (kind, color) => {
  const l = /^#(?:[0-3])/.test(color) ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.18)';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 260" width="480" height="520">${SHAPES[kind](color, l)}</svg>`;
};
module.exports.banner = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 400" width="1600" height="400">
  <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#EDE8E0"/><stop offset="1" stop-color="#D3CABD"/></linearGradient></defs>
  <rect width="1600" height="400" fill="url(#g)"/>
  <circle cx="1230" cy="200" r="230" fill="#DCD3C6"/>
  <g transform="translate(1085 22) scale(1.35)">${SHAPES.hoodie('#1B1D29', 'rgba(255,255,255,.3)')}</g>
  <g transform="translate(930 190) scale(.7) rotate(-8)">${SHAPES.beanie('#B5452D', 'rgba(0,0,0,.18)')}</g>
  <text x="110" y="118" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="5" fill="#8A6E4B">WINTER DROP '26</text>
  <text x="104" y="200" font-family="Inter, Arial, sans-serif" font-size="74" font-weight="800" fill="#1B1D29" letter-spacing="-2">Made for cold mornings.</text>
  <rect x="110" y="246" width="250" height="66" rx="33" fill="#1B1D29"/>
  <text x="235" y="289" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="700" fill="#fff" text-anchor="middle">Shop the drop</text>
</svg>`;

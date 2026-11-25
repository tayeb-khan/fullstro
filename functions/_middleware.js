/* Cloudflare Pages middleware: makes region + language automatic at the edge.
   (Other hosts: see README → "Hosting elsewhere" for the nginx equivalent.)

   1. Legacy URLs: /bd-bn/* → /bn/   and   /bd-en/* → /   (301; the old site's
      sub-pages that still live on the WordPress site are listed in LEGACY_KEEP)
   2. /bn/ and /bn/* serve the same index.html; the page reads the language from the path
   3. Sets cookie fs_country from Cloudflare's geo-IP so the page picks the
      right region (BD → BDT pricing, local couriers; everyone else → global)
   4. First visit to / from a Bangla-preferring browser → suggest /bn/ (302),
      only when the visitor has never chosen a language (no fs_lang_set cookie)
*/
const LEGACY_KEEP = /^\/bd-(en|bn)\/(templates|features|integrations|documentation|contact|terms-conditions|privacy-policy|cancellation-policy|refund-policy|pricing)(\/|$)/;

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1 · legacy homepages
  if (!LEGACY_KEEP.test(path)) {
    if (/^\/bd-bn(\/|$)/.test(path)) return Response.redirect(url.origin + '/bn/' + url.search, 301);
    if (/^\/bd-en(\/|$)/.test(path)) return Response.redirect(url.origin + '/' + url.search, 301);
  }

  const country = (request.cf && request.cf.country) || request.headers.get('CF-IPCountry') || '';
  const cookies = request.headers.get('Cookie') || '';

  // 4 · language suggestion on first visit only
  if (path === '/' && !/fs_lang_set=1/.test(cookies) && !url.searchParams.has('lang')) {
    const al = (request.headers.get('Accept-Language') || '').toLowerCase();
    if (/^bn\b/.test(al)) {
      const r = Response.redirect(url.origin + '/bn/' + url.search, 302);
      const res = new Response(r.body, r);
      res.headers.append('Set-Cookie', 'fs_lang_set=1; Path=/; Max-Age=31536000; SameSite=Lax');
      return res;
    }
  }

  // 2 · /bn/ → index.html (assets resolve via the page's <base> tag)
  let res;
  if (/^\/bn(\/|\/index\.html)?$/.test(path)) {
    res = await env.ASSETS.fetch(new Request(url.origin + '/index.html', request));
  } else {
    res = await next();
  }

  // 3 · region hint for the page (not HttpOnly: the page reads it)
  const isHtml = (res.headers.get('Content-Type') || '').includes('text/html');
  if (isHtml && /^[A-Z]{2}$/.test(country)) {
    res = new Response(res.body, res);
    res.headers.append('Set-Cookie', `fs_country=${country}; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
    if (!/fs_lang_set=1/.test(cookies)) res.headers.append('Set-Cookie', 'fs_lang_set=1; Path=/; Max-Age=31536000; SameSite=Lax');
    res.headers.set('Vary', 'Accept-Language, Cookie');
  }
  return res;
}

#!/usr/bin/env python3
"""Local preview with the same routing as production.

    python3 tools/dev-server.py            # http://localhost:8080
    python3 tools/dev-server.py 9000

  /            English
  /bn/         Bangla (same index.html)
  ?region=bd   force Bangladesh pricing   (?region=global for USD)
  ?country=US  pretend the edge saw this country (sets the fs_country cookie)
"""
import http.server, os, sys, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        path = u.path
        for legacy, target in (('/bd-bn', '/bn/'), ('/bd-en', '/')):
            if path == legacy or path.startswith(legacy + '/'):
                self.send_response(301); self.send_header('Location', target); self.end_headers(); return
        if path in ('/bn', '/bn/', '/bn/index.html'):
            self.path = '/index.html' + (('?' + u.query) if u.query else '')
        self._country = (urllib.parse.parse_qs(u.query).get('country') or [None])[0]
        super().do_GET()

    def end_headers(self):
        c = getattr(self, '_country', None)
        if c and len(c) == 2 and c.isalpha():
            self.send_header('Set-Cookie', f'fs_country={c.upper()}; Path=/; SameSite=Lax')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    print(f'FullStro preview on http://localhost:{PORT}  (Bangla: /bn/)')
    http.server.ThreadingHTTPServer(('', PORT), Handler).serve_forever()

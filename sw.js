/* Service Worker: hält die App offline verfügbar. Bei Änderungen VERSION erhöhen. */
const VERSION = 'intervall-v2';
const FONT_CACHE = 'intervall-fonts';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './lib/zip-no-worker-inflate.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith('intervall-') && k !== VERSION && k !== FONT_CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(r => { clearTimeout(t); resolve(r); }, e => { clearTimeout(t); reject(e); });
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') {
      // Seite: erst Netz (für Updates), bei Funkloch aus dem Speicher
      event.respondWith(
        withTimeout(fetch(req), 4000)
          .then(res => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then(c => c.put('./index.html', copy));
            }
            return res;
          })
          .catch(() => caches.match('./index.html', { ignoreSearch: true }))
      );
      return;
    }
    // Dateien der App: aus dem Speicher, sonst Netz
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(async cache => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        } catch (e) {
          return hit || Response.error();
        }
      })
    );
  }
});

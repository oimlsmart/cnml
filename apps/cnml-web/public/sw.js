// CNML service worker (TODO.cnml/32).
//
// Scope: /cnml/. Registered from the verify page (and only the verify
// page — the rest of the site does not need offline support and a
// wider scope would cache the docs unnecessarily).
//
// Strategy: stale-while-revalidate for same-origin GETs. The cache
// is populated on first fetch and refreshed in the background. The
// next visit serves the cached version immediately. This makes the
// verify page usable offline after one online visit.
//
// Precache: on install, the SW caches the verify page's HTML shell
// and the trust-anchor bundle. The hashed JS/CSS chunks are picked
// up on first navigation through the SW (stale-while-revalidate).
//
// The cache version increments when the SW logic changes. The
// activate handler deletes old caches.

const CACHE = 'cnml-verify-v1';
const BASE = '/cnml/';
const PRECACHE_URLS = [
  BASE,
  `${BASE}verify/`,
  `${BASE}trust-anchors.json`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // addAll is atomic: any failure rolls back. We tolerate 404s
      // by adding each URL individually.
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res.ok) await cache.put(url, res);
          } catch {
            // Network failure during install is non-fatal. The
            // stale-while-revalidate handler will retry on fetch.
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Only handle same-origin requests. Cross-origin (Google Fonts,
  // OIML API, etc.) goes straight to the network.
  if (url.origin !== self.location.origin) return;

  event.respondWith(staleWhileRevalidate(request));
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok && response.type === 'basic') {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((err) => {
      if (cached) return cached;
      throw err;
    });

  return cached || networkPromise;
}

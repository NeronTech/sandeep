const CACHE_NAME = 'sandeeps-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/logo.svg',
  '/icons/web-app-manifest-192x192.png',
  '/icons/web-app-manifest-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        // cache fetched resources for future
        const respClone = resp.clone();
        caches.open(CACHE_NAME).then(cache => {
          try { cache.put(event.request, respClone); } catch(e){/* opaque responses may fail */ }
        });
        return resp;
      }).catch(() => {
        // fallback to offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

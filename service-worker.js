// self.addEventListener("install", e => self.skipWaiting());
// self.addEventListener("fetch", e => {
//   e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
// });

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open("sandeep-cache-v1").then(cache => cache.addAll(["./", "./index.html"]))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
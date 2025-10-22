// self.addEventListener("install", e => self.skipWaiting());
// self.addEventListener("fetch", e => {
//   e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
// });

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("S&m-cache").then((cache) => {
      return cache.addAll(["/", "/index.html", "/manifest.json", "/icons/icon-192.png"]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

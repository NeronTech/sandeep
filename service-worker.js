// self.addEventListener("install", e => self.skipWaiting());
// self.addEventListener("fetch", e => {
//   e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
// });

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open("my-app-cache-v1");
      const urlsToCache = ["/", "/index.html", "/manifest.json"];

      for (const url of urlsToCache) {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (response.ok) {
            await cache.put(url, response.clone());
            console.log("Cached:", url);
          } else {
            console.warn("Skipping (bad response):", url);
          }
        } catch (err) {
          console.warn("Skipping (fetch failed):", url, err);
        }
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
